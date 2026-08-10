import type {CSSProperties, ReactNode} from 'react';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
  type ReactFlowInstance,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import clsx from 'clsx';
import {layoutGraph, type FlowDirection} from './layoutGraph';
import {assertDiagramQuality} from './diagramSpec';
import styles from './diagrams.module.css';

export type DiagramNodeRole = 'source' | 'process' | 'decision' | 'storage' | 'model' | 'tool' | 'state' | 'constraint' | 'output' | 'group';
export type DiagramKind = 'architecture' | 'workflow' | 'sequence' | 'data-flow' | 'lifecycle' | 'relationship';

export type DiagramNode = {
  id: string;
  items?: string[];
  label: string;
  detail?: string;
  eyebrow?: string;
  emphasis?: boolean;
  role?: DiagramNodeRole;
  width?: number;
  height?: number;
};

export type DiagramEdge = {
  source: string;
  target: string;
  label?: string;
  dashed?: boolean;
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
type DocsNode = Node<DocsNodeData, 'docs'>;

function DocsFlowNode({data, sourcePosition = Position.Bottom, targetPosition = Position.Top}: NodeProps<DocsNode>) {
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

const nodeTypes = {docs: DocsFlowNode};

function estimateNodeHeight(node: DiagramNode) {
  const width = node.width ?? 168;
  const usableTextWidth = Math.max(72, width - 26);
  const estimatedCharactersPerLine = Math.max(12, Math.floor(usableTextWidth / 6.4));
  const detailLines = node.detail ? Math.max(1, Math.ceil(node.detail.length / estimatedCharactersPerLine)) : 0;
  const itemRows = node.items ? Math.ceil(node.items.length / 2) : 0;
  const contentHeight = 70
    + (node.eyebrow ? 18 : 0)
    + detailLines * 17
    + (itemRows ? itemRows * 34 + 8 : 0);
  return Math.max(node.height ?? 0, contentHeight);
}

export function ReactFlowDiagram({
  ariaLabel,
  background = false,
  caption,
  className,
  controls,
  direction = 'TB',
  edges,
  fullscreen = true,
  height,
  interactive = true,
  kind = 'workflow',
  layout: layoutMode = 'dagre',
  minimap = 'auto',
  nodeSpacing,
  nodes,
  nodesDraggable,
  primaryPath,
  rankSpacing,
}: ReactFlowDiagramProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<ReactFlowInstance<DocsNode, Edge>>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
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
  const flowEdges = useMemo<Edge[]>(() => edges.map((edge, index) => ({
    id: `${edge.source}-${edge.target}-${index}`,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    markerEnd: {type: MarkerType.ArrowClosed, width: 18, height: 18},
    sourceHandle: `source-${edge.sourceHandle ?? (direction === 'TB' ? 'bottom' : 'right')}`,
    targetHandle: `target-${edge.targetHandle ?? (direction === 'TB' ? 'top' : 'left')}`,
    className: clsx(
      edge.route === 'feedback' && styles.flowEdgeFeedback,
      edge.route === 'secondary' && styles.flowEdgeSecondary,
      edge.dashed && styles.flowEdgeDashed,
    ),
    type: edge.type === 'bezier' ? 'default' : edge.type ?? 'smoothstep',
    pathOptions: edge.type === 'bezier' ? {curvature: edge.route === 'feedback' ? 0.16 : 0.25} : undefined,
  })), [direction, edges]);

  const layout = useMemo(() => layoutGraph<DocsNode>(nodes.map(({id, height: authoredHeight, width = 168, ...data}) => ({
    id,
    type: 'docs',
    data: {...data, width},
    position: {x: 0, y: 0},
    width,
    height: estimateNodeHeight({id, height: authoredHeight, width, ...data}),
  })), flowEdges, {direction, layout: layoutMode, nodeSpacing, primaryPath, rankSpacing}), [direction, flowEdges, layoutMode, nodeSpacing, nodes, primaryPath, rankSpacing]);
  useMemo(() => assertDiagramQuality({edges, kind, nodes, primaryPath}, layout.nodes, layout.bounds), [edges, kind, layout.bounds, layout.nodes, nodes, primaryPath]);
  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState<DocsNode>(layout.nodes);
  useEffect(() => setFlowNodes(layout.nodes), [layout.nodes, setFlowNodes]);

  const graphIsLarge = nodes.length >= 15 || layout.bounds.width > 1600 || layout.bounds.height > 1400;
  const showMiniMap = minimap === true || (minimap === 'auto' && graphIsLarge);
  const showControls = controls ?? interactive;
  const draggable = nodesDraggable ?? false;
  const canvasHeight = height ?? Math.min(760, Math.max(300, layout.bounds.height + 80));

  return (
    <figure className={clsx(styles.reactFlowFigure, className)} aria-label={ariaLabel}>
      <div className={styles.reactFlowCanvas} ref={canvasRef} style={{height: canvasHeight}}>
        <ReactFlow
          aria-label={ariaLabel}
          colorMode="system"
          edges={flowEdges}
          elementsSelectable={false}
          fitView
          fitViewOptions={{padding: 0.1, maxZoom: 1}}
          maxZoom={1.6}
          minZoom={0.35}
          nodes={flowNodes}
          nodesConnectable={false}
          nodesDraggable={draggable}
          nodeTypes={nodeTypes}
          onInit={(instance) => { flowRef.current = instance; }}
          onNodesChange={onNodesChange}
          panOnDrag={interactive}
          preventScrolling={!interactive}
          proOptions={{hideAttribution: true}}
          zoomOnDoubleClick={interactive}
          zoomOnPinch={interactive}
          zoomOnScroll={interactive}
        >
          {background && <Background variant={BackgroundVariant.Dots} gap={22} size={1} />}
          {showControls && <Controls position="bottom-right" showInteractive={draggable} />}
          {showMiniMap && <MiniMap pannable zoomable position="top-right" />}
        </ReactFlow>
        {fullscreen && (
          <button
            aria-label={isFullscreen ? 'Exit fullscreen diagram' : 'View diagram fullscreen'}
            className={styles.fullscreenButton}
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            type="button"
          >
            {isFullscreen ? '↙' : '↗'}
          </button>
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
