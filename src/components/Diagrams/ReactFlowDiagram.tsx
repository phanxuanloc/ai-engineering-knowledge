import type {CSSProperties, ReactNode} from 'react';
import {useEffect, useMemo} from 'react';
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
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import clsx from 'clsx';
import {layoutGraph, type FlowDirection} from './layoutGraph';
import styles from './diagrams.module.css';

export type DiagramNodeRole = 'source' | 'process' | 'decision' | 'storage' | 'model' | 'tool' | 'state' | 'constraint' | 'output' | 'group';

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
  type?: 'straight' | 'step' | 'smoothstep';
};

export type ReactFlowDiagramProps = {
  ariaLabel: string;
  background?: boolean;
  caption?: ReactNode;
  className?: string;
  controls?: boolean;
  direction?: FlowDirection;
  edges: DiagramEdge[];
  height?: number;
  interactive?: boolean;
  minimap?: boolean | 'auto';
  nodeSpacing?: number;
  nodes: DiagramNode[];
  nodesDraggable?: boolean;
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
      <Handle className={styles.handle} position={targetPosition} type="target" />
      {data.eyebrow && <span>{data.eyebrow}</span>}
      <strong>{data.label}</strong>
      {data.detail && <small>{data.detail}</small>}
      {data.items && <ul className={styles.flowNodeItems}>{data.items.map((item) => <li key={item}>{item}</li>)}</ul>}
      <Handle className={styles.handle} position={sourcePosition} type="source" />
    </div>
  );
}

const nodeTypes = {docs: DocsFlowNode};

export function ReactFlowDiagram({
  ariaLabel,
  background = true,
  caption,
  className,
  controls,
  direction = 'TB',
  edges,
  height,
  interactive = true,
  minimap = 'auto',
  nodeSpacing,
  nodes,
  nodesDraggable,
  rankSpacing,
}: ReactFlowDiagramProps) {
  const flowEdges = useMemo<Edge[]>(() => edges.map((edge, index) => ({
    id: `${edge.source}-${edge.target}-${index}`,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    markerEnd: {type: MarkerType.ArrowClosed, width: 18, height: 18},
    className: edge.dashed ? styles.flowEdgeDashed : undefined,
    type: edge.type ?? 'smoothstep',
  })), [edges]);

  const layout = useMemo(() => layoutGraph<DocsNode>(nodes.map(({id, height: nodeHeight = 76, width = 168, ...data}) => ({
    id,
    type: 'docs',
    data: {...data, width},
    position: {x: 0, y: 0},
    width,
    height: nodeHeight,
  })), flowEdges, {direction, nodeSpacing, rankSpacing}), [direction, flowEdges, nodeSpacing, nodes, rankSpacing]);
  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState<DocsNode>(layout.nodes);
  useEffect(() => setFlowNodes(layout.nodes), [layout.nodes, setFlowNodes]);

  const graphIsLarge = nodes.length >= 15 || layout.bounds.width > 1600 || layout.bounds.height > 1400;
  const showMiniMap = minimap === true || (minimap === 'auto' && graphIsLarge);
  const showControls = controls ?? interactive;
  const draggable = nodesDraggable ?? (interactive && nodes.length >= 7);
  const canvasHeight = height ?? Math.min(760, Math.max(300, layout.bounds.height + 80));

  return (
    <figure className={clsx(styles.reactFlowFigure, className)} aria-label={ariaLabel}>
      <div className={styles.reactFlowCanvas} style={{height: canvasHeight}}>
        <ReactFlow
          aria-label={ariaLabel}
          colorMode="system"
          edges={flowEdges}
          elementsSelectable={interactive}
          fitView
          fitViewOptions={{padding: 0.1, maxZoom: 1}}
          maxZoom={1.6}
          minZoom={0.35}
          nodes={flowNodes}
          nodesConnectable={false}
          nodesDraggable={draggable}
          nodeTypes={nodeTypes}
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
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
