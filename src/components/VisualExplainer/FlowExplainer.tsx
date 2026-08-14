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

export type FlowExplainerTransition = {
  from: string;
  to: string;
  edgeId?: string;
  message?: string;
  repeat?: boolean;
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

type NodePhase = 'idle' | 'active' | 'persistent';
type ExplainerNodeData = FlowExplainerNode & {phase: NodePhase};
type ExplainerNode = Node<ExplainerNodeData, 'explainer'>;
type PacketEdgeData = {message?: string; repeat?: boolean; motionKey: string};
type DirectedSegment = {id: string; source: string; target: string; message?: string; repeat?: boolean};

const NODE_WIDTH = 164;
const NODE_HEIGHT = 92;
const COLUMN_GAP = 300;
const ROW_GAP = 142;

function ExplainerNodeView({data}: NodeProps<ExplainerNode>) {
  return (
    <div className={clsx(styles.node, styles[`node_${data.role ?? 'service'}`], data.phase === 'active' && styles.nodeActive, data.phase === 'persistent' && styles.nodePersistent)}>
      {[Position.Top, Position.Right, Position.Bottom, Position.Left].map((position) => (
        <Handle className={styles.handle} id={`target-${position}`} key={`target-${position}`} position={position} type="target" />
      ))}
      <span>{data.role ?? 'service'}</span>
      <strong title={data.label}>{data.label}</strong>
      {data.detail && <small title={data.detail}>{data.detail}</small>}
      <i aria-hidden="true" className={styles.nodeSignal} />
      {[Position.Top, Position.Right, Position.Bottom, Position.Left].map((position) => (
        <Handle className={styles.handle} id={`source-${position}`} key={`source-${position}`} position={position} type="source" />
      ))}
    </div>
  );
}

function PacketEdge({id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, data}: EdgeProps<Edge<PacketEdgeData>>) {
  const horizontal = sourcePosition === Position.Left || sourcePosition === Position.Right;
  const [path, labelX, labelY] = horizontal
    ? getBezierPath({sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, curvature: 0.24})
    : getSmoothStepPath({sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, borderRadius: 16});
  const packetCount = data?.repeat ? 3 : 1;

  return (
    <>
      <BaseEdge id={id} markerEnd={markerEnd} path={path} className={styles.activeEdgePath} />
      {Array.from({length: packetCount}, (_, index) => (
        <circle className={styles.packetDot} key={`${data?.motionKey}-${index}`} r="5">
          <animate attributeName="opacity" begin={`${index * 0.23}s`} dur={data?.repeat ? '1.15s' : '.9s'} values="0;1;1;0" fill="freeze" />
          <animateMotion begin={`${index * 0.23}s`} dur={data?.repeat ? '1.15s' : '.9s'} path={path} repeatCount="1" fill="freeze" />
        </circle>
      ))}
      {data?.message && (
        <EdgeLabelRenderer>
          <span
            className={styles.message}
            title={data.message}
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
  return nodes.slice(1).map((node, index) => ({id: `${nodes[index].id}-${node.id}`, source: nodes[index].id, target: node.id}));
}

function resolvePosition(node: FlowExplainerNode, index: number): XYPosition {
  return {x: (node.column ?? index) * COLUMN_GAP, y: (node.row ?? 0) * ROW_GAP};
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

function directSegment(transition: FlowExplainerTransition, edges: FlowExplainerEdge[]): DirectedSegment[] | undefined {
  if (transition.edgeId) {
    const edge = edges.find((item) => item.id === transition.edgeId);
    if (!edge) return undefined;
    const reverse = transition.from === edge.target && transition.to === edge.source;
    return [{id: edge.id, source: reverse ? edge.target : edge.source, target: reverse ? edge.source : edge.target, message: transition.message, repeat: transition.repeat}];
  }
  const forward = edges.find((edge) => edge.source === transition.from && edge.target === transition.to);
  if (forward) return [{id: forward.id, source: forward.source, target: forward.target, message: transition.message, repeat: transition.repeat}];
  const reverse = edges.find((edge) => edge.source === transition.to && edge.target === transition.from);
  if (reverse) return [{id: reverse.id, source: transition.from, target: transition.to, message: transition.message, repeat: transition.repeat}];
  return undefined;
}

function shortestPath(transition: FlowExplainerTransition, edges: FlowExplainerEdge[]): DirectedSegment[] {
  const direct = directSegment(transition, edges);
  if (direct) return direct;
  const adjacency = new Map<string, Array<{next: string; edge: FlowExplainerEdge}>>();
  for (const edge of edges) {
    adjacency.set(edge.source, [...(adjacency.get(edge.source) ?? []), {next: edge.target, edge}]);
    adjacency.set(edge.target, [...(adjacency.get(edge.target) ?? []), {next: edge.source, edge}]);
  }
  const queue: string[] = [transition.from];
  const visited = new Set([transition.from]);
  const previous = new Map<string, {node: string; edge: FlowExplainerEdge}>();
  while (queue.length) {
    const current = queue.shift()!;
    if (current === transition.to) break;
    for (const candidate of adjacency.get(current) ?? []) {
      if (visited.has(candidate.next)) continue;
      visited.add(candidate.next);
      previous.set(candidate.next, {node: current, edge: candidate.edge});
      queue.push(candidate.next);
    }
  }
  if (!visited.has(transition.to)) return [{id: `${transition.from}-${transition.to}`, source: transition.from, target: transition.to, message: transition.message, repeat: transition.repeat}];
  const reversed: DirectedSegment[] = [];
  let cursor = transition.to;
  while (cursor !== transition.from) {
    const entry = previous.get(cursor);
    if (!entry) break;
    reversed.push({id: entry.edge.id, source: entry.node, target: cursor});
    cursor = entry.node;
  }
  const result = reversed.reverse();
  const messageIndex = Math.floor((result.length - 1) / 2);
  return result.map((segment, index) => ({...segment, message: index === messageIndex ? transition.message : undefined, repeat: transition.repeat}));
}

function stepTransitions(step: FlowExplainerStep): FlowExplainerTransition[] {
  if (step.transitions?.length) return step.transitions;
  if (!step.from || !step.to) return [];
  return [{from: step.from, to: step.to, edgeId: step.edgeId, message: step.message, repeat: step.repeat}];
}

export function FlowExplainer({title, description, scenarios, stepDurationMs = 2100}: FlowExplainerProps) {
  const [scenarioId, setScenarioId] = useState(scenarios[0]?.id ?? '');
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const scenario = useMemo(() => scenarios.find((item) => item.id === scenarioId) ?? scenarios[0], [scenarioId, scenarios]);
  const step = scenario?.steps[stepIndex];

  useEffect(() => { setStepIndex(0); setPlaying(false); }, [scenarioId]);
  useEffect(() => {
    if (!playing || !scenario?.steps.length || !step) return undefined;
    const timer = window.setTimeout(() => {
      setStepIndex((current) => {
        if (current >= scenario.steps.length - 1) { setPlaying(false); return current; }
        return current + 1;
      });
    }, step.durationMs ?? stepDurationMs);
    return () => window.clearTimeout(timer);
  }, [playing, scenario, step, stepDurationMs]);

  if (!scenario || !step) return null;
  const scenarioEdges = scenario.edges ?? inferEdges(scenario.nodes);
  const positionById = new Map(scenario.nodes.map((node, index) => [node.id, resolvePosition(node, index)]));
  const transitions = stepTransitions(step);
  const transitionNodeIds = transitions.flatMap((item) => [item.from, item.to]);
  const activeNodeIds = new Set([...(step.active ?? []), ...transitionNodeIds]);
  const persistentNodeIds = new Set(step.persistent ?? []);

  const graphNodes: ExplainerNode[] = scenario.nodes.map((node, index) => ({
    id: node.id,
    type: 'explainer',
    data: {...node, phase: activeNodeIds.has(node.id) ? 'active' : persistentNodeIds.has(node.id) ? 'persistent' : 'idle'},
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

  const segments = transitions.flatMap((transition, transitionIndex) => shortestPath(transition, scenarioEdges).map((segment, segmentIndex) => ({...segment, transitionIndex, segmentIndex})));
  const activeEdges: Edge[] = segments
    .filter((segment) => positionById.has(segment.source) && positionById.has(segment.target))
    .map((segment) => ({
      id: `active-${segment.id}-${stepIndex}-${segment.transitionIndex}-${segment.segmentIndex}`,
      source: segment.source,
      target: segment.target,
      ...closestHandle(positionById.get(segment.source)!, positionById.get(segment.target)!),
      markerEnd: {type: MarkerType.ArrowClosed, width: 16, height: 16},
      type: 'packet',
      data: {message: segment.message, repeat: segment.repeat, motionKey: `${scenario.id}-${stepIndex}-${segment.transitionIndex}-${segment.segmentIndex}`},
    }));

  const maxRow = Math.max(0, ...scenario.nodes.map((node) => node.row ?? 0));
  const graphHeight = Math.max(270, Math.min(520, 270 + maxRow * 92));
  const progress = scenario.steps.length <= 1 ? 100 : (stepIndex / (scenario.steps.length - 1)) * 100;
  const next = () => { setPlaying(false); setStepIndex((current) => Math.min(current + 1, scenario.steps.length - 1)); };
  const previous = () => { setPlaying(false); setStepIndex((current) => Math.max(current - 1, 0)); };
  const replay = () => { setStepIndex(0); setPlaying(true); };

  return (
    <figure className={styles.figure}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>Live system trace</span>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
        <div className={styles.tabs} role="tablist" aria-label={`${title} scenarios`}>
          {scenarios.map((item) => (
            <button aria-selected={item.id === scenario.id} className={clsx(styles.tab, item.id === scenario.id && styles.tabActive)} key={item.id} onClick={() => setScenarioId(item.id)} role="tab" type="button">{item.label}</button>
          ))}
        </div>
      </div>

      <div className={styles.stage}>
        <div className={styles.graphCanvas} style={{height: graphHeight}}>
          <div className={styles.scanline} aria-hidden="true" />
          <ReactFlow aria-label={`${title}: ${scenario.label}`} colorMode="system" edgeTypes={edgeTypes} edges={[...baseEdges, ...activeEdges]} elementsSelectable={false} fitView fitViewOptions={{padding: 0.18, maxZoom: 1.04}} maxZoom={1.25} minZoom={0.5} nodes={graphNodes} nodesConnectable={false} nodesDraggable={false} nodeTypes={nodeTypes} panOnDrag={false} preventScrolling={false} proOptions={{hideAttribution: true}} zoomOnDoubleClick={false} zoomOnPinch={false} zoomOnScroll={false} />
        </div>
        <aside className={styles.story} aria-live="polite">
          <div className={styles.stepMeta}><span>Event {String(stepIndex + 1).padStart(2, '0')}</span><span>{String(scenario.steps.length).padStart(2, '0')}</span></div>
          <strong>{step.title.replace(/^\d+\s*·\s*/, '')}</strong>
          {step.message && <code>{step.message}</code>}
          <p>{step.description}</p>
          <div className={styles.storySignal}><span className={styles.liveDot} aria-hidden="true" />{playing ? 'Tracing live' : 'Inspecting event'}</div>
        </aside>
      </div>

      <div className={styles.timeline}>
        <div className={styles.transport}>
          <button aria-label="Previous event" disabled={stepIndex === 0} onClick={previous} type="button">←</button>
          <button className={styles.playButton} onClick={() => setPlaying((value) => !value)} type="button">{playing ? 'Pause' : 'Play trace'}</button>
          <button aria-label="Next event" disabled={stepIndex >= scenario.steps.length - 1} onClick={next} type="button">→</button>
          <button className={styles.replayButton} onClick={replay} type="button">Replay</button>
        </div>
        <div className={styles.scrubber}>
          <div className={styles.progressTrack} aria-hidden="true"><span style={{width: `${progress}%`}} /></div>
          <div className={styles.eventRail}>
            {scenario.steps.map((item, index) => (
              <button aria-label={`Go to event ${index + 1}: ${item.title}`} className={clsx(styles.eventPoint, index === stepIndex && styles.eventPointActive)} key={`${scenario.id}-${item.title}-${index}`} onClick={() => { setPlaying(false); setStepIndex(index); }} type="button"><span>{String(index + 1).padStart(2, '0')}</span></button>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
