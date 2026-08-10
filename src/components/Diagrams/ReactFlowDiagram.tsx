import type {ReactNode} from 'react';
import {useMemo} from 'react';
import {
  Background,
  BackgroundVariant,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import clsx from 'clsx';
import styles from './diagrams.module.css';

export type DiagramNode = {
  id: string;
  label: string;
  detail?: string;
  eyebrow?: string;
  x: number;
  y: number;
  emphasis?: boolean;
};

export type DiagramEdge = {
  source: string;
  target: string;
  label?: string;
  dashed?: boolean;
};

export type ReactFlowDiagramProps = {
  ariaLabel: string;
  caption?: ReactNode;
  className?: string;
  edges: DiagramEdge[];
  height?: number;
  nodes: DiagramNode[];
};

type LearningNodeData = {label: string; detail?: string; eyebrow?: string; emphasis?: boolean};

function LearningNode({data}: NodeProps<Node<LearningNodeData>>) {
  return (
    <div className={clsx(styles.flowNode, data.emphasis && styles.flowNodeEmphasis)}>
      <Handle className={styles.handle} position={Position.Left} type="target" />
      {data.eyebrow && <span>{data.eyebrow}</span>}
      <strong>{data.label}</strong>
      {data.detail && <small>{data.detail}</small>}
      <Handle className={styles.handle} position={Position.Right} type="source" />
    </div>
  );
}

const nodeTypes = {learning: LearningNode};

export function ReactFlowDiagram({ariaLabel, caption, className, edges, height = 300, nodes}: ReactFlowDiagramProps) {
  const flowNodes = useMemo<Node<LearningNodeData>[]>(
    () => nodes.map(({id, x, y, ...data}) => ({id, type: 'learning', position: {x, y}, data})),
    [nodes],
  );
  const flowEdges = useMemo<Edge[]>(
    () => edges.map((edge, index) => ({
      id: `${edge.source}-${edge.target}-${index}`,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: false,
      className: edge.dashed ? styles.flowEdgeDashed : undefined,
      type: 'smoothstep',
    })),
    [edges],
  );

  return (
    <figure className={clsx(styles.reactFlowFigure, className)} aria-label={ariaLabel}>
      <div className={styles.reactFlowCanvas} style={{height}}>
        <ReactFlow
          edges={flowEdges}
          elementsSelectable={false}
          fitView
          fitViewOptions={{padding: 0.18}}
          maxZoom={1.25}
          minZoom={0.35}
          nodes={flowNodes}
          nodesConnectable={false}
          nodesDraggable={false}
          nodeTypes={nodeTypes}
          panOnDrag={false}
          preventScrolling={false}
          proOptions={{hideAttribution: true}}
          zoomOnDoubleClick={false}
          zoomOnPinch={false}
          zoomOnScroll={false}
        >
          <Background color="var(--diagram-grid)" gap={20} size={1} variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
