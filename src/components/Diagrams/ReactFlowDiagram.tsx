import type {CSSProperties, ReactNode} from 'react';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Background,
  BackgroundVariant,
  BaseEdge,
  Controls,
  EdgeLabelRenderer,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeProps,
  type ReactFlowInstance,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import clsx from 'clsx';
import {FeedbackEdge} from './FeedbackEdge';
import {layoutGraph, type FlowDirection} from './layoutGraph';
import {assertDiagramQuality} from './diagramSpec';
import styles from './diagrams.module.css';

export type DiagramNodeRole = 'source' | 'process' | 'decision' | 'storage' | 'model' | 'tool' | 'state' | 'evidence' | 'constraint' | 'output' | 'group';
export type DiagramNodeSize = 'compact' | 'standard' | 'wide';
export type DiagramKind = 'architecture' | 'workflow' | 'sequence' | 'data-flow' | 'lifecycle' | 'relationship';

export type DiagramNode = {
  id: string;
  items?: string[];
  label: string;
  detail?: string;
  eyebrow?: string;
  emphasis?: boolean;
  role?: DiagramNodeRole;
  size?: DiagramNodeSize;
  width?: number;
  height?: number;
};

export type DiagramEdge = {
  source: string;
  target: string;
  label?: string;
  dashed?: boolean;
  feedbackLabelPlacement?: 'endpoint' | 'outer';
  motion?: 'packet';
  route?: 'primary' | 'secondary' | 'feedback';
  sourceHandle?: 'top' | 'right' | 'bottom' | 'left';
  targetHandle?: 'top' | 'right' | 'bottom' | 'left';
  type?: 'straight' | 'step' | 'smoothstep' | 'bezier';
};

export type ReactFlowDiagramProps = {
  ariaLabel: string;
  background?: boolean;
  caption?: ReactNode;
  className?: string;
  controls?: boolean;
  direction?: FlowDirection;
  edges: DiagramEdge[];
  fullscreen?: boolean;
  height?: number;
  interactive?: boolean;
  kind?: DiagramKind;
  layout?: 'dagre' | 'primary-path';
  minimap?: boolean | 'auto';
  nodeSpacing?: number;
  nodes: DiagramNode[];
  nodesDraggable?: boolean;
  primaryPath?: string[];
  rankSpacing?: number;
};

type DocsNodeData = Omit<DiagramNode, 'id' | 'height'>;
type DocsNode = Node<DocsNodeData, 'docs' | 'fit-spacer'>;
type PacketEdgeData = {label?: string; pathType?: 'straight' | 'step' | 'smoothstep' | 'bezier'};

const MOBILE_QUERY = '(max-width: 700px)';

function useMobileDiagramLayout() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const sync = () => setMobile(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);
  return mobile;
}

function DocsFlowNode({data}: NodeProps<DocsNode>) {
  return (
    <div
      className={clsx(styles.flowNode, styles[`flowNode_${data.role ?? 'state'}`], data.emphasis && styles.flowNodeEmphasis)}
      style={data.width ? ({'--flow-node-width': `${data.width}px`} as CSSProperties) : undefined}
    >
      {[Position.Top, Position.Right, Position.Bottom, Position.Left].map((position) =>
        <Handle className={styles.handle} id={`target-${position}`} key={`target-${position}`} position={position} type="target" />)}
      {data.eyebrow && <span>{data.eyebrow}</span>}
      <strong>{data.label}</strong>
      {data.detail && <small>{data.detail}</small>}
      {data.items && <ul className={styles.flowNodeItems}>{data.items.map((item) => <li key={item}>{item}</li>)}</ul>}
      {[Position.Top, Position.Right, Position.Bottom, Position.Left].map((position) =>
        <Handle className={styles.handle} id={`source-${position}`} key={`source-${position}`} position={position} type="source" />)}
    </div>
  );
}

function PacketEdge({id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, style, data}: EdgeProps<Edge<PacketEdgeData>>) {
  const pathType = data?.pathType ?? 'smoothstep';
  const [path, labelX, labelY] = pathType === 'straight'
    ? getStraightPath({sourceX, sourceY, targetX, targetY})
    : pathType === 'bezier'
      ? getBezierPath({sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition})
      : getSmoothStepPath({sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition});

  return (
    <>
      <BaseEdge id={id} markerEnd={markerEnd} path={path} style={style} />
      <circle className={styles.packetDot} r="4.5">
        <animateMotion dur="2.4s" path={path} repeatCount="indefinite" />
      </circle>
      {data?.label && (
        <EdgeLabelRenderer>
          <span className={styles.packetEdgeLabel} style={{transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`}}>
            {data.label}
          </span>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

function FitSpacerNode() { return null; }

const nodeTypes = {docs: DocsFlowNode, 'fit-spacer': FitSpacerNode};
const edgeTypes = {feedback: FeedbackEdge, packet: PacketEdge};

const NODE_WIDTHS: Record<DiagramNodeSize, number> = {compact: 180, standard: 240, wide: 340};
function resolveNodeWidth(node: DiagramNode) { return node.width ?? NODE_WIDTHS[node.size ?? 'standard']; }
function estimateNodeHeight(node: DiagramNode) {
  const width = resolveNodeWidth(node);
  const usableTextWidth = Math.max(72, width - 26);
  const estimatedCharactersPerLine = Math.max(12, Math.floor(usableTextWidth / 6.4));
  const detailLines = node.detail ? Math.max(1, Math.ceil(node.detail.length / estimatedCharactersPerLine)) : 0;
  const itemRows = node.items ? Math.ceil(node.items.length / 2) : 0;
  const contentHeight = 54 + (node.eyebrow ? 17 : 0) + detailLines * 16 + (itemRows ? itemRows * 34 + 8 : 0);
  return Math.max(node.height ?? 0, contentHeight);
}

export function ReactFlowDiagram({ariaLabel, background = false, caption, className, controls, direction = 'TB', edges, fullscreen = true, height, interactive = true, kind = 'workflow', layout: layoutMode = 'dagre', minimap = 'auto', nodeSpacing, nodes, nodesDraggable, primaryPath, rankSpacing}: ReactFlowDiagramProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<ReactFlowInstance<DocsNode, Edge>>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mobile = useMobileDiagramLayout();
  const effectiveDirection: FlowDirection = mobile && direction === 'LR' ? 'TB' : direction;

  useEffect(() => {
    const updateFullscreen = () => setIsFullscreen(document.fullscreenElement === canvasRef.current);
    document.addEventListener('fullscreenchange', updateFullscreen);
    return () => document.removeEventListener('fullscreenchange', updateFullscreen);
  }, []);
  const toggleFullscreen = useCallback(async () => {
    if (!canvasRef.current) return;
    if (document.fullscreenElement === canvasRef.current) await document.exitFullscreen();
    else await canvasRef.current.requestFullscreen();
    requestAnimationFrame(() => flowRef.current?.fitView({padding: 0.1, maxZoom: 1}));
  }, []);
  const flowEdges = useMemo<Edge[]>(() => {
    const primaryPairs = new Set(primaryPath?.slice(1).map((target, index) => `${primaryPath[index]}->${target}`) ?? []);
    return edges.map((edge, index) => {
      const route = edge.route ?? (primaryPairs.has(`${edge.source}->${edge.target}`) ? 'primary' : undefined);
      const baseType = route === 'feedback' ? 'feedback' : edge.type === 'bezier' ? 'default' : edge.type ?? (route === 'primary' ? 'straight' : 'smoothstep');
      const type = edge.motion === 'packet' ? 'packet' : baseType;
      return {
        id: `${edge.source}-${edge.target}-${index}`,
        source: edge.source,
        target: edge.target,
        data: edge.motion === 'packet'
          ? {label: edge.label, pathType: baseType === 'default' ? 'bezier' : baseType}
          : route === 'feedback' ? {labelPlacement: edge.feedbackLabelPlacement} : undefined,
        label: edge.motion === 'packet' ? undefined : edge.label,
        markerEnd: {type: MarkerType.ArrowClosed, width: 16, height: 16},
        sourceHandle: `source-${edge.sourceHandle ?? (route === 'feedback' ? (effectiveDirection === 'TB' ? 'right' : 'bottom') : effectiveDirection === 'TB' ? 'bottom' : 'right')}`,
        targetHandle: `target-${edge.targetHandle ?? (route === 'feedback' ? (effectiveDirection === 'TB' ? 'right' : 'bottom') : effectiveDirection === 'TB' ? 'top' : 'left')}`,
        className: clsx(route === 'feedback' && styles.flowEdgeFeedback, route === 'secondary' && styles.flowEdgeSecondary, edge.dashed && styles.flowEdgeDashed),
        type,
        pathOptions: baseType === 'default' ? {curvature: 0.25} : undefined,
      };
    });
  }, [edges, effectiveDirection, primaryPath]);

  const layout = useMemo(() => layoutGraph<DocsNode>(nodes.map(({id, height: authoredHeight, ...data}) => {
    const width = resolveNodeWidth({id, height: authoredHeight, ...data});
    return {id, type: 'docs', data: {...data, width}, position: {x: 0, y: 0}, width, height: estimateNodeHeight({id, height: authoredHeight, ...data})};
  }), flowEdges, {direction: effectiveDirection, layout: layoutMode, nodeSpacing, primaryPath, rankSpacing}), [effectiveDirection, flowEdges, layoutMode, nodeSpacing, nodes, primaryPath, rankSpacing]);
  useMemo(() => assertDiagramQuality({direction: effectiveDirection, edges, kind, nodes, primaryPath}, layout.nodes, layout.bounds), [effectiveDirection, edges, kind, layout.bounds, layout.nodes, nodes, primaryPath]);
  const hasFeedback = edges.some(({route}) => route === 'feedback');
  const fitPadding = hasFeedback ? 0.08 : mobile ? 0.08 : 0.1;
  const viewportNodes = useMemo<DocsNode[]>(() => hasFeedback ? [...layout.nodes, {id: '__feedback-fit-spacer', type: 'fit-spacer', data: {label: ''}, position: {x: layout.bounds.width + 110, y: layout.bounds.height / 2}, width: 1, height: 1, selectable: false, draggable: false}] : layout.nodes, [hasFeedback, layout.bounds.height, layout.bounds.width, layout.nodes]);
  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState<DocsNode>(viewportNodes);
  useEffect(() => {
    setFlowNodes(viewportNodes);
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        flowRef.current?.fitView({padding: fitPadding, maxZoom: 1, duration: 0});
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      if (secondFrame) cancelAnimationFrame(secondFrame);
    };
  }, [effectiveDirection, fitPadding, mobile, setFlowNodes, viewportNodes]);
  const graphIsLarge = nodes.length >= 15 || layout.bounds.width > 1600 || layout.bounds.height > 1400;
  const showMiniMap = minimap === true || (minimap === 'auto' && graphIsLarge);
  const showControls = controls ?? interactive;
  const draggable = nodesDraggable ?? false;
  const canvasHeight = mobile
    ? Math.min(960, Math.max(380, layout.bounds.height + 96))
    : height ?? Math.min(900, Math.max(300, layout.bounds.height + 56));

  return (
    <figure className={clsx(styles.reactFlowFigure, className)} aria-label={ariaLabel}>
      <div className={styles.reactFlowCanvas} ref={canvasRef} style={{height: canvasHeight}}>
        <ReactFlow key={`${effectiveDirection}-${mobile ? 'mobile' : 'desktop'}`} aria-label={ariaLabel} colorMode="system" edges={flowEdges} elementsSelectable={false} fitView fitViewOptions={{padding: fitPadding, maxZoom: 1}} maxZoom={1.6} minZoom={mobile ? 0.4 : 0.35} nodes={flowNodes} nodesConnectable={false} nodesDraggable={draggable} nodeTypes={nodeTypes} edgeTypes={edgeTypes} onInit={(instance) => { flowRef.current = instance; requestAnimationFrame(() => instance.fitView({padding: fitPadding, maxZoom: 1, duration: 0})); }} onNodesChange={onNodesChange} panOnDrag={interactive} preventScrolling={!interactive} proOptions={{hideAttribution: true}} zoomOnDoubleClick={interactive} zoomOnPinch={interactive} zoomOnScroll={interactive}>
          {background && <Background variant={BackgroundVariant.Dots} gap={22} size={1} />}
          {showControls && <Controls position="bottom-right" showInteractive={draggable} />}
          {showMiniMap && <MiniMap pannable zoomable position="top-right" />}
        </ReactFlow>
        {fullscreen && <button aria-label={isFullscreen ? 'Exit fullscreen diagram' : 'View diagram fullscreen'} className={styles.fullscreenButton} onClick={toggleFullscreen} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'} type="button">{isFullscreen ? '↙' : '↗'}</button>}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
