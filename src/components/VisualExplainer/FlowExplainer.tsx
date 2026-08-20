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
    | "client"
    | "service"
    | "database"
    | "network"
    | "model"
    | "tool"
    | "data";
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
  visible?: string[];
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
  layout?: "auto" | "compact" | "trace";
  presentation?: "overview" | "progressive" | "focused";
  steps: FlowExplainerStep[];
};
export type FlowExplainerProps = {
  title: string;
  description?: string;
  scenarios: FlowExplainerScenario[];
  stepDurationMs?: number;
};

type NodePhase = "idle" | "active" | "persistent" | "complete";
type ExplainerNodeData = FlowExplainerNode & {
  phase: NodePhase;
  arrival: boolean;
};
type ExplainerNode = Node<ExplainerNodeData, "explainer">;
type PacketEdgeData = {
  message?: string;
  repeat?: boolean;
  motionKey: string;
};
type DirectedSegment = {
  id: string;
  source: string;
  target: string;
  message?: string;
  repeat?: boolean;
};

const NODE_WIDTH = 204,
  NODE_HEIGHT = 116,
  COLUMN_GAP = 400,
  WIDE_COLUMN_GAP = 410,
  ROW_GAP = 184,
  MOBILE_ROW_GAP = 224;
const COMPACT_COLUMN_GAP = 420,
  COMPACT_ROW_GAP = 204;
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
        data.phase === "complete" && styles.nodeComplete,
        data.arrival && styles.nodeArrival,
      )}
    >
      {[Position.Top, Position.Right, Position.Bottom, Position.Left].map((p) => (
        <Handle className={styles.handle} id={`target-${p}`} key={`target-${p}`} position={p} type="target" />
      ))}
      <span>{data.role ?? "service"}</span>
      <strong title={data.label}>{data.label}</strong>
      {data.detail && <small title={data.detail}>{data.detail}</small>}
      <i aria-hidden="true" className={styles.nodeSignal} />
      {[Position.Top, Position.Right, Position.Bottom, Position.Left].map((p) => (
        <Handle className={styles.handle} id={`source-${p}`} key={`source-${p}`} position={p} type="source" />
      ))}
    </div>
  );
}

function PacketEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, data }: EdgeProps<Edge<PacketEdgeData>>) {
  const horizontal = sourcePosition === Position.Left || sourcePosition === Position.Right;
  const [path, labelX, labelY] = horizontal
    ? getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, curvature: 0.2 })
    : getSmoothStepPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, borderRadius: 18 });
  const packetCount = data?.repeat ? 3 : 1;
  return (
    <>
      <BaseEdge id={id} markerEnd={markerEnd} path={path} className={styles.activeEdgePath} />
      {Array.from({ length: packetCount }, (_, i) => (
        <circle className={styles.packetDot} key={`${data?.motionKey}-${i}`} r="4.5">
          <animate attributeName="opacity" begin={`${i * 0.22}s`} dur={data?.repeat ? "1.15s" : ".95s"} values="0;1;1;0" fill="freeze" />
          <animateMotion begin={`${i * 0.22}s`} dur={data?.repeat ? "1.15s" : ".95s"} path={path} repeatCount="1" fill="freeze" />
        </circle>
      ))}
      {data?.message && (
        <EdgeLabelRenderer>
          <span className={styles.message} title={data.message} style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}>
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
  return nodes.slice(1).map((n, i) => ({ id: `${nodes[i].id}-${n.id}`, source: nodes[i].id, target: n.id }));
}

function resolvePosition(node: FlowExplainerNode, index: number, mobile: boolean): XYPosition {
  if (!mobile) return { x: (node.column ?? index) * COLUMN_GAP, y: (node.row ?? 0) * ROW_GAP };
  if (node.column === undefined) return { x: 0, y: index * MOBILE_ROW_GAP };
  if (node.column <= 1) return { x: 0, y: node.column * MOBILE_ROW_GAP };
  const branchRow = node.row ?? 0;
  return { x: branchRow % 2 === 0 ? -106 : 106, y: (branchRow + 2) * MOBILE_ROW_GAP };
}

function resolveScenarioPosition(node: FlowExplainerNode, index: number, mobile: boolean, compactSequence: boolean, traceSequence: boolean, wideStage: boolean): XYPosition {
  if (mobile && traceSequence) return { x: 0, y: index * MOBILE_ROW_GAP };
  if (mobile) return resolvePosition(node, index, true);
  if (traceSequence && node.column !== undefined) return { x: node.column * WIDE_COLUMN_GAP, y: (node.row ?? 0) * ROW_GAP };
  if (!compactSequence) {
    return wideStage
      ? { x: (node.column ?? index) * WIDE_COLUMN_GAP, y: (node.row ?? 0) * ROW_GAP }
      : resolvePosition(node, index, false);
  }
  const compactColumns = 3;
  const row = Math.floor(index / compactColumns);
  const offset = index % compactColumns;
  const column = row % 2 === 0 ? offset : compactColumns - 1 - offset;
  return { x: column * COMPACT_COLUMN_GAP, y: row * COMPACT_ROW_GAP };
}

function closestHandle(source: XYPosition, target: XYPosition) {
  const dx = target.x - source.x, dy = target.y - source.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0
      ? { sourceHandle: `source-${Position.Right}`, targetHandle: `target-${Position.Left}` }
      : { sourceHandle: `source-${Position.Left}`, targetHandle: `target-${Position.Right}` };
  }
  return dy >= 0
    ? { sourceHandle: `source-${Position.Bottom}`, targetHandle: `target-${Position.Top}` }
    : { sourceHandle: `source-${Position.Top}`, targetHandle: `target-${Position.Bottom}` };
}

function directSegment(t: FlowExplainerTransition, edges: FlowExplainerEdge[]): DirectedSegment[] | undefined {
  if (t.edgeId) {
    const e = edges.find((x) => x.id === t.edgeId);
    if (!e) return;
    const rev = t.from === e.target && t.to === e.source;
    return [{ id: e.id, source: rev ? e.target : e.source, target: rev ? e.source : e.target, message: t.message, repeat: t.repeat }];
  }
  const f = edges.find((e) => e.source === t.from && e.target === t.to);
  if (f) return [{ id: f.id, source: f.source, target: f.target, message: t.message, repeat: t.repeat }];
  const r = edges.find((e) => e.source === t.to && e.target === t.from);
  if (r) return [{ id: r.id, source: t.from, target: t.to, message: t.message, repeat: t.repeat }];
}

function shortestPath(t: FlowExplainerTransition, edges: FlowExplainerEdge[]): DirectedSegment[] {
  const direct = directSegment(t, edges);
  if (direct) return direct;
  const adj = new Map<string, Array<{ next: string; edge: FlowExplainerEdge }>>();
  for (const e of edges) {
    adj.set(e.source, [...(adj.get(e.source) ?? []), { next: e.target, edge: e }]);
    adj.set(e.target, [...(adj.get(e.target) ?? []), { next: e.source, edge: e }]);
  }
  const q = [t.from], visited = new Set([t.from]), prev = new Map<string, { node: string; edge: FlowExplainerEdge }>();
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
  if (!visited.has(t.to)) return [{ id: `${t.from}-${t.to}`, source: t.from, target: t.to, message: t.message, repeat: t.repeat }];
  const rev: DirectedSegment[] = [];
  let cursor = t.to;
  while (cursor !== t.from) {
    const e = prev.get(cursor);
    if (!e) break;
    rev.push({ id: e.edge.id, source: e.node, target: cursor });
    cursor = e.node;
  }
  const result = rev.reverse(), mi = Math.floor((result.length - 1) / 2);
  return result.map((s, i) => ({ ...s, message: i === mi ? t.message : undefined, repeat: t.repeat }));
}

function stepTransitions(s: FlowExplainerStep): FlowExplainerTransition[] {
  if (s.transitions?.length) return s.transitions;
  if (!s.from || !s.to) return [];
  return [{ from: s.from, to: s.to, edgeId: s.edgeId, message: s.message, repeat: s.repeat }];
}

function idsTouchedByStep(step: FlowExplainerStep) {
  return new Set([...(step.active ?? []), ...(step.persistent ?? []), ...(step.visible ?? []), ...stepTransitions(step).flatMap((transition) => [transition.from, transition.to])]);
}

export function FlowExplainer({ title, description, scenarios, stepDurationMs = 2100 }: FlowExplainerProps) {
  const [scenarioId, setScenarioId] = useState(scenarios[0]?.id ?? "");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const flowRef = useRef<ReactFlowInstance<ExplainerNode, Edge>>(null);
  const mobile = useMobileLayout();
  const scenario = useMemo(() => scenarios.find((item) => item.id === scenarioId) ?? scenarios[0], [scenarioId, scenarios]);
  const step = scenario?.steps[stepIndex];
  const fitMinZoom = mobile ? 0.78 : (scenario?.nodes.length ?? 0) <= 3 ? 0.88 : 0.7;

  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [scenarioId]);

  useEffect(() => {
    if (!playing || !scenario?.steps.length || !step) return;
    const timer = window.setTimeout(() => setStepIndex((current) => {
      if (current >= scenario.steps.length - 1) {
        setPlaying(false);
        return current;
      }
      return current + 1;
    }), step.durationMs ?? stepDurationMs);
    return () => window.clearTimeout(timer);
  }, [playing, scenario, step, stepDurationMs]);

  useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => flowRef.current?.fitView({
        padding: mobile ? 0.12 : 0.18,
        minZoom: fitMinZoom,
        maxZoom: mobile ? 1 : 1.06,
        duration: 220,
      }));
    });
    return () => {
      cancelAnimationFrame(first);
      if (second) cancelAnimationFrame(second);
    };
  }, [fitMinZoom, mobile, scenarioId, stepIndex]);

  if (!scenario || !step) return null;

  const scenarioEdges = scenario.edges ?? inferEdges(scenario.nodes);
  const compactSequence = scenario.layout === "compact" || (!scenario.edges && scenario.nodes.length >= 4 && scenario.layout !== "trace");
  const traceSequence = scenario.layout === "trace";
  const wideStage = scenario.nodes.length >= 4;
  const presentation = scenario.presentation ?? (scenario.layout === "compact" ? "progressive" : "overview");

  const positionById = new Map(scenario.nodes.map((node, index) => [node.id, resolveScenarioPosition(node, index, mobile, compactSequence, traceSequence, wideStage)]));
  const transitions = stepTransitions(step);
  const transitionNodeIds = transitions.flatMap((transition) => [transition.from, transition.to]);
  const arrivalNodeIds = new Set(transitions.map((transition) => transition.to));
  const activeNodeIds = new Set([...(step.active ?? []), ...transitionNodeIds]);
  const persistentNodeIds = new Set(step.persistent ?? []);

  const previousSteps = scenario.steps.slice(0, stepIndex);
  const completedNodeIds = new Set<string>();
  const completedEdgeIds = new Set<string>();
  for (const previousStep of previousSteps) {
    idsTouchedByStep(previousStep).forEach((id) => completedNodeIds.add(id));
    stepTransitions(previousStep).forEach((transition) => {
      shortestPath(transition, scenarioEdges).forEach((segment) => completedEdgeIds.add(segment.id));
    });
  }

  const visibleNodeIds = new Set<string>();
  if (presentation === "progressive") {
    scenario.steps.slice(0, stepIndex + 1).forEach((sceneStep) => idsTouchedByStep(sceneStep).forEach((id) => visibleNodeIds.add(id)));
  } else {
    scenario.nodes.forEach((node) => visibleNodeIds.add(node.id));
  }

  const graphNodes: ExplainerNode[] = scenario.nodes.filter((node) => visibleNodeIds.has(node.id)).map((node) => {
    const index = scenario.nodes.findIndex((candidate) => candidate.id === node.id);
    const phase: NodePhase = activeNodeIds.has(node.id)
      ? "active"
      : persistentNodeIds.has(node.id)
        ? "persistent"
        : completedNodeIds.has(node.id)
          ? "complete"
          : "idle";
    return {
      id: node.id,
      type: "explainer",
      data: { ...node, phase, arrival: arrivalNodeIds.has(node.id) },
      position: resolveScenarioPosition(node, index, mobile, compactSequence, traceSequence, wideStage),
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      draggable: false,
      selectable: false,
    };
  });

  const baseEdges: Edge[] = scenarioEdges.filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)).map((edge) => ({
    id: `base-${edge.id}`,
    source: edge.source,
    target: edge.target,
    ...closestHandle(positionById.get(edge.source)!, positionById.get(edge.target)!),
    markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14 },
    className: clsx(styles.baseEdge, completedEdgeIds.has(edge.id) && styles.baseEdgeComplete),
    type: "smoothstep",
    label: edge.label,
  }));

  const segments = transitions.flatMap((transition, transitionIndex) => shortestPath(transition, scenarioEdges).map((segment, segmentIndex) => ({ ...segment, transitionIndex, segmentIndex })));
  const activeEdges: Edge[] = segments.filter((segment) => positionById.has(segment.source) && positionById.has(segment.target)).map((segment) => ({
    id: `active-${segment.id}-${stepIndex}-${segment.transitionIndex}-${segment.segmentIndex}`,
    source: segment.source,
    target: segment.target,
    ...closestHandle(positionById.get(segment.source)!, positionById.get(segment.target)!),
    markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
    type: "packet",
    data: {
      message: segment.message,
      repeat: segment.repeat,
      motionKey: `${scenario.id}-${stepIndex}-${segment.transitionIndex}-${segment.segmentIndex}`,
    },
  }));

  const visiblePositions = graphNodes.map((node) => node.position);
  const minY = Math.min(0, ...visiblePositions.map((position) => position.y));
  const maxY = Math.max(0, ...visiblePositions.map((position) => position.y));
  const contentHeight = maxY - minY + NODE_HEIGHT;
  const graphHeight = mobile ? Math.min(980, Math.max(330, contentHeight + 92)) : Math.min(650, Math.max(320, contentHeight + 96));
  const progress = scenario.steps.length <= 1 ? 100 : (stepIndex / (scenario.steps.length - 1)) * 100;

  const next = () => {
    setPlaying(false);
    setStepIndex((current) => Math.min(current + 1, scenario.steps.length - 1));
  };
  const previous = () => {
    setPlaying(false);
    setStepIndex((current) => Math.max(current - 1, 0));
  };
  const replay = () => {
    setStepIndex(0);
    setPlaying(true);
  };

  return (
    <figure className={styles.figure}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>System trace</span>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
        <div className={styles.tabs} role="tablist" aria-label={`${title} scenarios`}>
          {scenarios.map((item) => (
            <button aria-selected={item.id === scenario.id} className={clsx(styles.tab, item.id === scenario.id && styles.tabActive)} key={item.id} onClick={() => setScenarioId(item.id)} role="tab" type="button">
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className={clsx(styles.stage, wideStage && styles.stageCompact)}>
        <div className={styles.graphCanvas} style={{ height: graphHeight }}>
          <ReactFlow
            key={`${scenario.id}-${mobile ? "mobile" : "desktop"}`}
            aria-label={`${title}: ${scenario.label}`}
            colorMode="system"
            edgeTypes={edgeTypes}
            edges={[...baseEdges, ...activeEdges]}
            elementsSelectable={false}
            fitView
            fitViewOptions={{
              padding: mobile ? 0.12 : 0.18,
              minZoom: fitMinZoom,
              maxZoom: mobile ? 1 : 1.06,
            }}
            maxZoom={1.25}
            minZoom={fitMinZoom}
            nodes={graphNodes}
            nodesConnectable={false}
            nodesDraggable={false}
            nodeTypes={nodeTypes}
            onInit={(instance) => {
              flowRef.current = instance;
              requestAnimationFrame(() => instance.fitView({
                padding: mobile ? 0.12 : 0.18,
                minZoom: fitMinZoom,
                maxZoom: mobile ? 1 : 1.06,
                duration: 0,
              }));
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
            {step.inspection.decision && <div><span>Current decision</span><strong>{step.inspection.decision}</strong></div>}
            {step.inspection.invocation && <div><span>Invocation</span><strong>{step.inspection.invocation}</strong></div>}
            {step.inspection.context && <div><span>Context</span><strong>{step.inspection.context}</strong></div>}
            {step.inspection.selected && <div><span>Selected</span><strong>{step.inspection.selected}</strong></div>}
          </div>
          {step.inspection.occupancy !== undefined && (
            <div className={styles.occupancy}>
              <div><span>Context budget</span><strong>{step.inspection.occupancyLabel ?? `${step.inspection.occupancy}%`}</strong></div>
              <div className={styles.occupancyTrack} aria-label={`Illustrative context occupancy: ${step.inspection.occupancy}%`} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={step.inspection.occupancy}>
                <span style={{ width: `${step.inspection.occupancy}%` }} />
              </div>
              <small>Illustrative, not a measured run</small>
            </div>
          )}
          {step.inspection.items?.length ? (
            <div className={styles.contextItems} aria-label="Context items">
              {step.inspection.items.map((item) => (
                <span className={clsx(styles.contextItem, styles[`contextItem_${item.state ?? "available"}`])} key={item.label}>
                  <i aria-hidden="true" />{item.label}<em>{item.state ?? "available"}</em>
                </span>
              ))}
            </div>
          ) : null}
          {step.inspection.state?.length ? (
            <div className={styles.workingState}>
              <span>{step.inspection.stateLabel ?? "Working state"}</span>
              <ul>{step.inspection.state.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ) : null}
        </section>
      )}
      <div className={styles.timeline}>
        <div className={styles.transport}>
          <button aria-label="Previous event" disabled={stepIndex === 0} onClick={previous} type="button">←</button>
          <button className={styles.playButton} onClick={() => setPlaying((value) => !value)} type="button">{playing ? "Pause" : "Play trace"}</button>
          <button aria-label="Next event" disabled={stepIndex >= scenario.steps.length - 1} onClick={next} type="button">→</button>
          <button className={styles.replayButton} onClick={replay} type="button">Replay</button>
        </div>
        <div className={styles.scrubber}>
          <div className={styles.progressTrack} aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
          <div className={styles.eventRail}>
            {scenario.steps.map((item, index) => (
              <button aria-label={`Go to event ${index + 1}: ${item.title}`} className={clsx(styles.eventPoint, index === stepIndex && styles.eventPointActive)} key={`${scenario.id}-${item.title}-${index}`} onClick={() => { setPlaying(false); setStepIndex(index); }} type="button">
                <span>{String(index + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
