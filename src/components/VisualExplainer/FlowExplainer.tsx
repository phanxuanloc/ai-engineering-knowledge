import { useEffect, useMemo, useRef, useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  getBezierPath,
  getSmoothStepPath,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeProps,
  type ReactFlowInstance,
  type XYPosition,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import clsx from "clsx";
import styles from "./styles.module.css";

export type FlowExplainerNode = {
  id: string;
  label: string;
  detail?: string;
  role?:
    "client" | "service" | "database" | "network" | "model" | "tool" | "data";
  column?: number;
  row?: number;
};
export type FlowExplainerEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
};
export type FlowExplainerTransition = {
  from: string;
  to: string;
  edgeId?: string;
  message?: string;
  repeat?: boolean;
};
export type FlowExplainerInspectionItem = {
  label: string;
  state?: "available" | "selected" | "preserved" | "rejected" | "evicted";
};
export type FlowExplainerInspection = {
  decision?: string;
  invocation?: string;
  selected?: string;
  context?: string;
  occupancy?: number;
  occupancyLabel?: string;
  items?: FlowExplainerInspectionItem[];
  stateLabel?: string;
  state?: string[];
};
export type FlowExplainerStep = {
  title: string;
  description: string;
  from?: string;
  to?: string;
  edgeId?: string;
  message?: string;
  active?: string[];
  persistent?: string[];
  repeat?: boolean;
  transitions?: FlowExplainerTransition[];
  durationMs?: number;
  inspection?: FlowExplainerInspection;
};
export type FlowExplainerScenario = {
  id: string;
  label: string;
  nodes: FlowExplainerNode[];
  edges?: FlowExplainerEdge[];
  layout?: "auto" | "compact";
  steps: FlowExplainerStep[];
};
export type FlowExplainerProps = {
  title: string;
  description?: string;
  scenarios: FlowExplainerScenario[];
  stepDurationMs?: number;
};
type NodePhase = "idle" | "active" | "persistent";
type ExplainerNodeData = FlowExplainerNode & { phase: NodePhase };
type ExplainerNode = Node<ExplainerNodeData, "explainer">;
type PacketEdgeData = { message?: string; repeat?: boolean; motionKey: string };
type DirectedSegment = {
  id: string;
  source: string;
  target: string;
  message?: string;
  repeat?: boolean;
};

const NODE_WIDTH = 176,
  NODE_HEIGHT = 104,
  COLUMN_GAP = 320,
  WIDE_COLUMN_GAP = 400,
  ROW_GAP = 154,
  MOBILE_ROW_GAP = 190;
const COMPACT_COLUMN_GAP = 340,
  COMPACT_ROW_GAP = 190;
const MOBILE_QUERY = "(max-width: 700px)";
function useMobileLayout() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const q = window.matchMedia(MOBILE_QUERY);
    const sync = () => setMobile(q.matches);
    sync();
    q.addEventListener("change", sync);
    return () => q.removeEventListener("change", sync);
  }, []);
  return mobile;
}

function ExplainerNodeView({ data }: NodeProps<ExplainerNode>) {
  return (
    <div
      className={clsx(
        styles.node,
        styles[`node_${data.role ?? "service"}`],
        data.phase === "active" && styles.nodeActive,
        data.phase === "persistent" && styles.nodePersistent,
      )}
    >
      {[Position.Top, Position.Right, Position.Bottom, Position.Left].map(
        (p) => (
          <Handle
            className={styles.handle}
            id={`target-${p}`}
            key={`target-${p}`}
            position={p}
            type="target"
          />
        ),
      )}
      <span>{data.role ?? "service"}</span>
      <strong title={data.label}>{data.label}</strong>
      {data.detail && <small title={data.detail}>{data.detail}</small>}
      <i aria-hidden="true" className={styles.nodeSignal} />
      {[Position.Top, Position.Right, Position.Bottom, Position.Left].map(
        (p) => (
          <Handle
            className={styles.handle}
            id={`source-${p}`}
            key={`source-${p}`}
            position={p}
            type="source"
          />
        ),
      )}
    </div>
  );
}

function PacketEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
}: EdgeProps<Edge<PacketEdgeData>>) {
  const horizontal =
    sourcePosition === Position.Left || sourcePosition === Position.Right;
  const [path, labelX, labelY] = horizontal
    ? getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        curvature: 0.24,
      })
    : getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        borderRadius: 16,
      });
  const packetCount = data?.repeat ? 3 : 1;
  return (
    <>
      <BaseEdge
        id={id}
        markerEnd={markerEnd}
        path={path}
        className={styles.activeEdgePath}
      />
      {Array.from({ length: packetCount }, (_, i) => (
        <circle
          className={styles.packetDot}
          key={`${data?.motionKey}-${i}`}
          r="5"
        >
          <animate
            attributeName="opacity"
            begin={`${i * 0.23}s`}
            dur={data?.repeat ? "1.15s" : ".9s"}
            values="0;1;1;0"
            fill="freeze"
          />
          <animateMotion
            begin={`${i * 0.23}s`}
            dur={data?.repeat ? "1.15s" : ".9s"}
            path={path}
            repeatCount="1"
            fill="freeze"
          />
        </circle>
      ))}
      {data?.message && (
        <EdgeLabelRenderer>
          <span
            className={styles.message}
            title={data.message}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {data.message}
          </span>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
const nodeTypes = { explainer: ExplainerNodeView };
const edgeTypes = { packet: PacketEdge };
function inferEdges(nodes: FlowExplainerNode[]): FlowExplainerEdge[] {
  return nodes.slice(1).map((n, i) => ({
    id: `${nodes[i].id}-${n.id}`,
    source: nodes[i].id,
    target: n.id,
  }));
}

// Mobile must preserve authored topology semantics. Explicit column/row metadata means the
// author is describing spatial structure (for example a fan-out), not a sequential pipeline.
function resolvePosition(
  node: FlowExplainerNode,
  index: number,
  mobile: boolean,
): XYPosition {
  if (!mobile)
    return {
      x: (node.column ?? index) * COLUMN_GAP,
      y: (node.row ?? 0) * ROW_GAP,
    };
  if (node.column === undefined) return { x: 0, y: index * MOBILE_ROW_GAP };
  if (node.column <= 1) return { x: 0, y: node.column * MOBILE_ROW_GAP };
  const branchRow = node.row ?? 0;
  return {
    x: branchRow % 2 === 0 ? -96 : 96,
    y: (branchRow + 2) * MOBILE_ROW_GAP,
  };
}
function resolveScenarioPosition(
  node: FlowExplainerNode,
  index: number,
  mobile: boolean,
  compactSequence: boolean,
  wideStage: boolean,
): XYPosition {
  if (mobile) return resolvePosition(node, index, true);
  if (!compactSequence)
    return wideStage
      ? {
          x: (node.column ?? index) * WIDE_COLUMN_GAP,
          y: (node.row ?? 0) * ROW_GAP,
        }
      : resolvePosition(node, index, false);
  const row = Math.floor(index / 2);
  const column = row % 2 === 0 ? index % 2 : 1 - (index % 2);
  return { x: column * COMPACT_COLUMN_GAP, y: row * COMPACT_ROW_GAP };
}
function closestHandle(source: XYPosition, target: XYPosition) {
  const dx = target.x - source.x,
    dy = target.y - source.y;
  if (Math.abs(dx) >= Math.abs(dy))
    return dx >= 0
      ? {
          sourceHandle: `source-${Position.Right}`,
          targetHandle: `target-${Position.Left}`,
        }
      : {
          sourceHandle: `source-${Position.Left}`,
          targetHandle: `target-${Position.Right}`,
        };
  return dy >= 0
    ? {
        sourceHandle: `source-${Position.Bottom}`,
        targetHandle: `target-${Position.Top}`,
      }
    : {
        sourceHandle: `source-${Position.Top}`,
        targetHandle: `target-${Position.Bottom}`,
      };
}
function directSegment(
  t: FlowExplainerTransition,
  edges: FlowExplainerEdge[],
): DirectedSegment[] | undefined {
  if (t.edgeId) {
    const e = edges.find((x) => x.id === t.edgeId);
    if (!e) return;
    const rev = t.from === e.target && t.to === e.source;
    return [
      {
        id: e.id,
        source: rev ? e.target : e.source,
        target: rev ? e.source : e.target,
        message: t.message,
        repeat: t.repeat,
      },
    ];
  }
  const f = edges.find((e) => e.source === t.from && e.target === t.to);
  if (f)
    return [
      {
        id: f.id,
        source: f.source,
        target: f.target,
        message: t.message,
        repeat: t.repeat,
      },
    ];
  const r = edges.find((e) => e.source === t.to && e.target === t.from);
  if (r)
    return [
      {
        id: r.id,
        source: t.from,
        target: t.to,
        message: t.message,
        repeat: t.repeat,
      },
    ];
}
function shortestPath(
  t: FlowExplainerTransition,
  edges: FlowExplainerEdge[],
): DirectedSegment[] {
  const direct = directSegment(t, edges);
  if (direct) return direct;
  const adj = new Map<
    string,
    Array<{ next: string; edge: FlowExplainerEdge }>
  >();
  for (const e of edges) {
    adj.set(e.source, [
      ...(adj.get(e.source) ?? []),
      { next: e.target, edge: e },
    ]);
    adj.set(e.target, [
      ...(adj.get(e.target) ?? []),
      { next: e.source, edge: e },
    ]);
  }
  const q = [t.from],
    visited = new Set([t.from]),
    prev = new Map<string, { node: string; edge: FlowExplainerEdge }>();
  while (q.length) {
    const cur = q.shift()!;
    if (cur === t.to) break;
    for (const c of adj.get(cur) ?? []) {
      if (visited.has(c.next)) continue;
      visited.add(c.next);
      prev.set(c.next, { node: cur, edge: c.edge });
      q.push(c.next);
    }
  }
  if (!visited.has(t.to))
    return [
      {
        id: `${t.from}-${t.to}`,
        source: t.from,
        target: t.to,
        message: t.message,
        repeat: t.repeat,
      },
    ];
  const rev: DirectedSegment[] = [];
  let cursor = t.to;
  while (cursor !== t.from) {
    const e = prev.get(cursor);
    if (!e) break;
    rev.push({ id: e.edge.id, source: e.node, target: cursor });
    cursor = e.node;
  }
  const result = rev.reverse(),
    mi = Math.floor((result.length - 1) / 2);
  return result.map((s, i) => ({
    ...s,
    message: i === mi ? t.message : undefined,
    repeat: t.repeat,
  }));
}
function stepTransitions(s: FlowExplainerStep): FlowExplainerTransition[] {
  if (s.transitions?.length) return s.transitions;
  if (!s.from || !s.to) return [];
  return [
    {
      from: s.from,
      to: s.to,
      edgeId: s.edgeId,
      message: s.message,
      repeat: s.repeat,
    },
  ];
}

export function FlowExplainer({
  title,
  description,
  scenarios,
  stepDurationMs = 2100,
}: FlowExplainerProps) {
  const [scenarioId, setScenarioId] = useState(scenarios[0]?.id ?? "");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const flowRef = useRef<ReactFlowInstance<ExplainerNode, Edge>>(null);
  const mobile = useMobileLayout();
  const scenario = useMemo(
    () => scenarios.find((i) => i.id === scenarioId) ?? scenarios[0],
    [scenarioId, scenarios],
  );
  const step = scenario?.steps[stepIndex];
  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [scenarioId]);
  useEffect(() => {
    if (!playing || !scenario?.steps.length || !step) return;
    const timer = window.setTimeout(
      () =>
        setStepIndex((cur) => {
          if (cur >= scenario.steps.length - 1) {
            setPlaying(false);
            return cur;
          }
          return cur + 1;
        }),
      step.durationMs ?? stepDurationMs,
    );
    return () => window.clearTimeout(timer);
  }, [playing, scenario, step, stepDurationMs]);
  useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() =>
        flowRef.current?.fitView({
          padding: mobile ? 0.14 : 0.22,
          maxZoom: 1.04,
          duration: 0,
        }),
      );
    });
    return () => {
      cancelAnimationFrame(first);
      if (second) cancelAnimationFrame(second);
    };
  }, [mobile, scenarioId]);
  if (!scenario || !step) return null;
  const scenarioEdges = scenario.edges ?? inferEdges(scenario.nodes);
  const compactSequence =
    scenario.layout === "compact" ||
    (!scenario.edges && scenario.nodes.length >= 4);
  const wideStage = scenario.nodes.length >= 4;
  const positionById = new Map(
    scenario.nodes.map((n, i) => [
      n.id,
      resolveScenarioPosition(n, i, mobile, compactSequence, wideStage),
    ]),
  );
  const transitions = stepTransitions(step);
  const transitionNodeIds = transitions.flatMap((i) => [i.from, i.to]);
  const activeNodeIds = new Set([...(step.active ?? []), ...transitionNodeIds]);
  const persistentNodeIds = new Set(step.persistent ?? []);
  const graphNodes: ExplainerNode[] = scenario.nodes.map((n, i) => ({
    id: n.id,
    type: "explainer",
    data: {
      ...n,
      phase: activeNodeIds.has(n.id)
        ? "active"
        : persistentNodeIds.has(n.id)
          ? "persistent"
          : "idle",
    },
    position: resolveScenarioPosition(n, i, mobile, compactSequence, wideStage),
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    draggable: false,
    selectable: false,
  }));
  const baseEdges: Edge[] = scenarioEdges.map((e) => ({
    id: `base-${e.id}`,
    source: e.source,
    target: e.target,
    ...closestHandle(positionById.get(e.source)!, positionById.get(e.target)!),
    markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14 },
    className: styles.baseEdge,
    type: "smoothstep",
    label: e.label,
  }));
  const segments = transitions.flatMap((t, ti) =>
    shortestPath(t, scenarioEdges).map((s, si) => ({
      ...s,
      transitionIndex: ti,
      segmentIndex: si,
    })),
  );
  const activeEdges: Edge[] = segments
    .filter((s) => positionById.has(s.source) && positionById.has(s.target))
    .map((s) => ({
      id: `active-${s.id}-${stepIndex}-${s.transitionIndex}-${s.segmentIndex}`,
      source: s.source,
      target: s.target,
      ...closestHandle(
        positionById.get(s.source)!,
        positionById.get(s.target)!,
      ),
      markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
      type: "packet",
      data: {
        message: s.message,
        repeat: s.repeat,
        motionKey: `${scenario.id}-${stepIndex}-${s.transitionIndex}-${s.segmentIndex}`,
      },
    }));
  const maxRow = Math.max(0, ...scenario.nodes.map((n) => n.row ?? 0));
  const compactRows = Math.ceil(scenario.nodes.length / 2);
  const mobileMaxY = Math.max(
    0,
    ...scenario.nodes.map((n, i) => resolvePosition(n, i, true).y),
  );
  const mobileContentHeight = mobileMaxY + NODE_HEIGHT;
  const graphHeight = mobile
    ? Math.min(1240, Math.max(420, mobileContentHeight + 120))
    : compactSequence
      ? Math.min(720, Math.max(360, compactRows * COMPACT_ROW_GAP + 76))
      : Math.max(290, Math.min(540, 290 + maxRow * 98));
  const progress =
    scenario.steps.length <= 1
      ? 100
      : (stepIndex / (scenario.steps.length - 1)) * 100;
  const next = () => {
    setPlaying(false);
    setStepIndex((c) => Math.min(c + 1, scenario.steps.length - 1));
  };
  const previous = () => {
    setPlaying(false);
    setStepIndex((c) => Math.max(c - 1, 0));
  };
  const replay = () => {
    setStepIndex(0);
    setPlaying(true);
  };
  return (
    <figure className={styles.figure}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>Live system trace</span>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
        <div
          className={styles.tabs}
          role="tablist"
          aria-label={`${title} scenarios`}
        >
          {scenarios.map((item) => (
            <button
              aria-selected={item.id === scenario.id}
              className={clsx(
                styles.tab,
                item.id === scenario.id && styles.tabActive,
              )}
              key={item.id}
              onClick={() => setScenarioId(item.id)}
              role="tab"
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className={clsx(styles.stage, wideStage && styles.stageCompact)}>
        <div className={styles.graphCanvas} style={{ height: graphHeight }}>
          <div className={styles.scanline} aria-hidden="true" />
          <ReactFlow
            key={`${scenario.id}-${mobile ? "mobile" : "desktop"}`}
            aria-label={`${title}: ${scenario.label}`}
            colorMode="system"
            edgeTypes={edgeTypes}
            edges={[...baseEdges, ...activeEdges]}
            elementsSelectable={false}
            fitView
            fitViewOptions={{ padding: mobile ? 0.14 : 0.22, maxZoom: 1.04 }}
            maxZoom={1.25}
            minZoom={mobile ? 0.55 : 0.5}
            nodes={graphNodes}
            nodesConnectable={false}
            nodesDraggable={false}
            nodeTypes={nodeTypes}
            onInit={(instance) => {
              flowRef.current = instance;
              requestAnimationFrame(() =>
                instance.fitView({
                  padding: mobile ? 0.14 : 0.22,
                  maxZoom: 1.04,
                  duration: 0,
                }),
              );
            }}
            panOnDrag={false}
            preventScrolling={false}
            proOptions={{ hideAttribution: true }}
            zoomOnDoubleClick={false}
            zoomOnPinch={false}
            zoomOnScroll={false}
          />
        </div>
        <aside className={styles.story} aria-live="polite">
          <div className={styles.stepMeta}>
            <span>Event {String(stepIndex + 1).padStart(2, "0")}</span>
            <span>{String(scenario.steps.length).padStart(2, "0")}</span>
          </div>
          <strong>{step.title.replace(/^\d+\s*·\s*/, "")}</strong>
          {step.message && <code>{step.message}</code>}
          <p>{step.description}</p>
          <div className={styles.storySignal}>
            <span className={styles.liveDot} aria-hidden="true" />
            {playing ? "Tracing live" : "Inspecting event"}
          </div>
        </aside>
      </div>
      {step.inspection && (
        <section className={styles.inspector} aria-label="Runtime state">
          <div className={styles.inspectorStrip}>
            {step.inspection.decision && (
              <div>
                <span>Current decision</span>
                <strong>{step.inspection.decision}</strong>
              </div>
            )}
            {step.inspection.invocation && (
              <div>
                <span>Invocation</span>
                <strong>{step.inspection.invocation}</strong>
              </div>
            )}
            {step.inspection.context && (
              <div>
                <span>Context</span>
                <strong>{step.inspection.context}</strong>
              </div>
            )}
            {step.inspection.selected && (
              <div>
                <span>Selected</span>
                <strong>{step.inspection.selected}</strong>
              </div>
            )}
          </div>
          {step.inspection.occupancy !== undefined && (
            <div className={styles.occupancy}>
              <div>
                <span>Context budget</span>
                <strong>
                  {step.inspection.occupancyLabel ??
                    `${step.inspection.occupancy}%`}
                </strong>
              </div>
              <div
                className={styles.occupancyTrack}
                aria-label={`Illustrative context occupancy: ${step.inspection.occupancy}%`}
                role="meter"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={step.inspection.occupancy}
              >
                <span style={{ width: `${step.inspection.occupancy}%` }} />
              </div>
              <small>Illustrative, not a measured run</small>
            </div>
          )}
          {step.inspection.items?.length ? (
            <div className={styles.contextItems} aria-label="Context items">
              {step.inspection.items.map((item) => (
                <span
                  className={clsx(
                    styles.contextItem,
                    styles[`contextItem_${item.state ?? "available"}`],
                  )}
                  key={item.label}
                >
                  <i aria-hidden="true" />
                  {item.label}
                  <em>{item.state ?? "available"}</em>
                </span>
              ))}
            </div>
          ) : null}
          {step.inspection.state?.length ? (
            <div className={styles.workingState}>
              <span>{step.inspection.stateLabel ?? "Working state"}</span>
              <ul>
                {step.inspection.state.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      )}
      <div className={styles.timeline}>
        <div className={styles.transport}>
          <button
            aria-label="Previous event"
            disabled={stepIndex === 0}
            onClick={previous}
            type="button"
          >
            ←
          </button>
          <button
            className={styles.playButton}
            onClick={() => setPlaying((v) => !v)}
            type="button"
          >
            {playing ? "Pause" : "Play trace"}
          </button>
          <button
            aria-label="Next event"
            disabled={stepIndex >= scenario.steps.length - 1}
            onClick={next}
            type="button"
          >
            →
          </button>
          <button
            className={styles.replayButton}
            onClick={replay}
            type="button"
          >
            Replay
          </button>
        </div>
        <div className={styles.scrubber}>
          <div className={styles.progressTrack} aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.eventRail}>
            {scenario.steps.map((item, index) => (
              <button
                aria-label={`Go to event ${index + 1}: ${item.title}`}
                className={clsx(
                  styles.eventPoint,
                  index === stepIndex && styles.eventPointActive,
                )}
                key={`${scenario.id}-${item.title}-${index}`}
                onClick={() => {
                  setPlaying(false);
                  setStepIndex(index);
                }}
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
