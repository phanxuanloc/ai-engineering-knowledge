import {useEffect, useMemo, useState} from 'react';
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
  type XYPosition,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import clsx from 'clsx';
import styles from './styles.module.css';

export type FlowExplainerNode = {
  id: string;
  label: string;
  detail?: string;
  role?: 'client' | 'service' | 'database' | 'network' | 'model' | 'tool' | 'data';
  column?: number;
  row?: number;
};

export type FlowExplainerEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
};

export type FlowExplainerStep = {
  title: string;
  description: string;
  from?: string;
  to?: string;
  edgeId?: string;
  message?: string;
  active?: string[];
  repeat?: boolean;
};

export type FlowExplainerScenario = {
  id: string;
  label: string;
  nodes: FlowExplainerNode[];
  edges?: FlowExplainerEdge[];
  steps: FlowExplainerStep[];
};

export type FlowExplainerProps = {
  title: string;
  description?: string;
  scenarios: FlowExplainerScenario[];
  stepDurationMs?: number;
};

type ExplainerNodeData = FlowExplainerNode & {active: boolean};
type ExplainerNode = Node<ExplainerNodeData, 'explainer'>;
type PacketEdgeData = {message?: string; repeat?: boolean};
type DirectedSegment = {id: string; source: string; target: string};

const NODE_WIDTH = 158;
const NODE_HEIGHT = 92;
const COLUMN_GAP = 220;
const ROW_GAP = 138;

function ExplainerNodeView({data}: NodeProps<ExplainerNode>) {
  return (
    <div className={clsx(styles.node, styles[`node_${data.role ?? 'service'}`], data.active && styles.nodeActive)}>
      {[Position.Top, Position.Right, Position.Bottom, Position.Left].map((position) => (
        <Handle
          className={styles.handle}
          id={`target-${position}`}
          key={`target-${position}`}
          position={position}
          type="target"
        />
      ))}
      <span>{data.role ?? 'service'}</span>
      <strong>{data.label}</strong>
      {data.detail && <small>{data.detail}</small>}
      {[Position.Top, Position.Right, Position.Bottom, Position.Left].map((position) => (
        <Handle
          className={styles.handle}
          id={`source-${position}`}
          key={`source-${position}`}
          position={position}
          type="source"
        />
      ))}
    </div>
  );
}

function PacketEdge({id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, data}: EdgeProps<Edge<PacketEdgeData>>) {
  const horizontal = sourcePosition === Position.Left || sourcePosition === Position.Right;
  const [path, labelX, labelY] = horizontal
    ? getBezierPath({sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, curvature: 0.28})
    : getSmoothStepPath({sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, borderRadius: 12});

  const packetCount = data?.repeat ? 3 : 1;

  return (
    <>
      <BaseEdge id={id} markerEnd={markerEnd} path={path} className={styles.activeEdgePath} />
      {Array.from({length: packetCount}, (_, index) => (
        <circle className={styles.packetDot} key={`${id}-packet-${index}`} r="4.5">
          <animateMotion
            begin={`${index * 0.42}s`}
            dur={data?.repeat ? '1.65s' : '1.35s'}
            path={path}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      {data?.message && (
        <EdgeLabelRenderer>
          <span
            className={styles.message}
            style={{transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`}}
          >
            {data.message}
          </span>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

const nodeTypes = {explainer: ExplainerNodeView};
const edgeTypes = {packet: PacketEdge};

function inferEdges(nodes: FlowExplainerNode[]): FlowExplainerEdge[] {
  return nodes.slice(1).map((node, index) => ({
    id: `${nodes[index].id}-${node.id}`,
    source: nodes[index].id,
    target: node.id,
  }));
}

function resolvePosition(node: FlowExplainerNode, index: number): XYPosition {
  return {
    x: (node.column ?? index) * COLUMN_GAP,
    y: (node.row ?? 0) * ROW_GAP,
  };
}

function closestHandle(source: XYPosition, target: XYPosition) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0
      ? {sourceHandle: `source-${Position.Right}`, targetHandle: `target-${Position.Left}`}
      : {sourceHandle: `source-${Position.Left}`, targetHandle: `target-${Position.Right}`};
  }

  return dy >= 0
    ? {sourceHandle: `source-${Position.Bottom}`, targetHandle: `target-${Position.Top}`}
    : {sourceHandle: `source-${Position.Top}`, targetHandle: `target-${Position.Bottom}`};
}

function directSegment(step: FlowExplainerStep, edges: FlowExplainerEdge[]): DirectedSegment[] | undefined {
  if (step.edgeId) {
    const edge = edges.find((item) => item.id === step.edgeId);
    if (!edge) return undefined;
    if (step.from === edge.target && step.to === edge.source) {
      return [{id: edge.id, source: edge.target, target: edge.source}];
    }
    return [{id: edge.id, source: edge.source, target: edge.target}];
  }

  if (!step.from || !step.to) return undefined;
  const forward = edges.find((edge) => edge.source === step.from && edge.target === step.to);
  if (forward) return [{id: forward.id, source: forward.source, target: forward.target}];
  const reverse = edges.find((edge) => edge.source === step.to && edge.target === step.from);
  if (reverse) return [{id: reverse.id, source: step.from, target: step.to}];
  return undefined;
}

function shortestPath(step: FlowExplainerStep, edges: FlowExplainerEdge[]): DirectedSegment[] {
  const direct = directSegment(step, edges);
  if (direct) return direct;
  if (!step.from || !step.to) return [];

  const adjacency = new Map<string, Array<{next: string; edge: FlowExplainerEdge}>>();
  for (const edge of edges) {
    adjacency.set(edge.source, [...(adjacency.get(edge.source) ?? []), {next: edge.target, edge}]);
    adjacency.set(edge.target, [...(adjacency.get(edge.target) ?? []), {next: edge.source, edge}]);
  }

  const queue: string[] = [step.from];
  const visited = new Set([step.from]);
  const previous = new Map<string, {node: string; edge: FlowExplainerEdge}>();

  while (queue.length) {
    const current = queue.shift()!;
    if (current === step.to) break;
    for (const candidate of adjacency.get(current) ?? []) {
      if (visited.has(candidate.next)) continue;
      visited.add(candidate.next);
      previous.set(candidate.next, {node: current, edge: candidate.edge});
      queue.push(candidate.next);
    }
  }

  if (!visited.has(step.to)) return [{id: `${step.from}-${step.to}`, source: step.from, target: step.to}];

  const reversed: DirectedSegment[] = [];
  let cursor = step.to;
  while (cursor !== step.from) {
    const entry = previous.get(cursor);
    if (!entry) break;
    reversed.push({id: entry.edge.id, source: entry.node, target: cursor});
    cursor = entry.node;
  }
  return reversed.reverse();
}

export function FlowExplainer({title, description, scenarios, stepDurationMs = 1800}: FlowExplainerProps) {
  const [scenarioId, setScenarioId] = useState(scenarios[0]?.id ?? '');
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const scenario = useMemo(
    () => scenarios.find((item) => item.id === scenarioId) ?? scenarios[0],
    [scenarioId, scenarios],
  );
  const step = scenario?.steps[stepIndex];

  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [scenarioId]);

  useEffect(() => {
    if (!playing || !scenario?.steps.length) return undefined;
    const timer = window.setInterval(() => {
      setStepIndex((current) => {
        if (current >= scenario.steps.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, stepDurationMs);
    return () => window.clearInterval(timer);
  }, [playing, scenario, stepDurationMs]);

  if (!scenario || !step) return null;

  const scenarioEdges = scenario.edges ?? inferEdges(scenario.nodes);
  const positionById = new Map(scenario.nodes.map((node, index) => [node.id, resolvePosition(node, index)]));
  const activeNodeIds = new Set([...(step.active ?? []), step.from, step.to].filter(Boolean));

  const graphNodes: ExplainerNode[] = scenario.nodes.map((node, index) => ({
    id: node.id,
    type: 'explainer',
    data: {...node, active: activeNodeIds.has(node.id)},
    position: resolvePosition(node, index),
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    draggable: false,
    selectable: false,
  }));

  const baseEdges: Edge[] = scenarioEdges.map((edge) => ({
    id: `base-${edge.id}`,
    source: edge.source,
    target: edge.target,
    ...closestHandle(positionById.get(edge.source)!, positionById.get(edge.target)!),
    markerEnd: {type: MarkerType.ArrowClosed, width: 14, height: 14},
    className: styles.baseEdge,
    type: 'smoothstep',
    label: edge.label,
  }));

  const segments = shortestPath(step, scenarioEdges);
  const activeEdges: Edge[] = segments
    .filter((segment) => positionById.has(segment.source) && positionById.has(segment.target))
    .map((segment, index) => ({
      id: `active-${segment.id}-${stepIndex}-${index}`,
      source: segment.source,
      target: segment.target,
      ...closestHandle(positionById.get(segment.source)!, positionById.get(segment.target)!),
      markerEnd: {type: MarkerType.ArrowClosed, width: 16, height: 16},
      type: 'packet',
      data: {
        message: index === Math.floor((segments.length - 1) / 2) ? step.message : undefined,
        repeat: step.repeat,
      },
    }));

  const graphEdges = [...baseEdges, ...activeEdges];
  const maxRow = Math.max(0, ...scenario.nodes.map((node) => node.row ?? 0));
  const graphHeight = Math.max(250, Math.min(520, 250 + maxRow * 100));

  const next = () => setStepIndex((current) => Math.min(current + 1, scenario.steps.length - 1));
  const replay = () => {
    setStepIndex(0);
    setPlaying(true);
  };

  return (
    <figure className={styles.figure}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Runtime Visual Explainer</span>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
        <div className={styles.tabs} role="tablist" aria-label={`${title} scenarios`}>
          {scenarios.map((item) => (
            <button
              aria-selected={item.id === scenario.id}
              className={clsx(styles.tab, item.id === scenario.id && styles.tabActive)}
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

      <div className={styles.stage}>
        <div className={styles.graphCanvas} style={{height: graphHeight}}>
          <ReactFlow
            aria-label={`${title}: ${scenario.label}`}
            colorMode="system"
            edgeTypes={edgeTypes}
            edges={graphEdges}
            elementsSelectable={false}
            fitView
            fitViewOptions={{padding: 0.16, maxZoom: 1.08}}
            maxZoom={1.35}
            minZoom={0.45}
            nodes={graphNodes}
            nodesConnectable={false}
            nodesDraggable={false}
            nodeTypes={nodeTypes}
            panOnDrag={false}
            preventScrolling={false}
            proOptions={{hideAttribution: true}}
            zoomOnDoubleClick={false}
            zoomOnPinch={false}
            zoomOnScroll={false}
          />
        </div>

        <div className={styles.story} aria-live="polite">
          <div className={styles.stepMeta}>Step {stepIndex + 1} / {scenario.steps.length}</div>
          <strong>{step.title}</strong>
          <p>{step.description}</p>
        </div>
      </div>

      <div className={styles.controls}>
        <button onClick={() => setPlaying((value) => !value)} type="button">{playing ? 'Pause' : 'Play'}</button>
        <button disabled={stepIndex >= scenario.steps.length - 1} onClick={next} type="button">Step</button>
        <button onClick={replay} type="button">Replay</button>
        <div className={styles.dots} aria-label="Step progress">
          {scenario.steps.map((item, index) => (
            <button
              aria-label={`Go to step ${index + 1}: ${item.title}`}
              className={clsx(styles.dot, index === stepIndex && styles.dotActive)}
              key={`${scenario.id}-${item.title}-${index}`}
              onClick={() => { setPlaying(false); setStepIndex(index); }}
              type="button"
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </figure>
  );
}
