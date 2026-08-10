import type {ReactNode} from 'react';
import {useEffect, useMemo, useState} from 'react';
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

type LearningNodeData = {label: string; detail?: string; eyebrow?: string; emphasis?: boolean; vertical?: boolean};

function LearningNode({data}: NodeProps<Node<LearningNodeData>>) {
  return (
    <div className={clsx(styles.flowNode, data.emphasis && styles.flowNodeEmphasis)}>
      <Handle className={styles.handle} position={data.vertical ? Position.Top : Position.Left} type="target" />
      {data.eyebrow && <span>{data.eyebrow}</span>}
      <strong>{data.label}</strong>
      {data.detail && <small>{data.detail}</small>}
      <Handle className={styles.handle} position={data.vertical ? Position.Bottom : Position.Right} type="source" />
    </div>
  );
}

const nodeTypes = {learning: LearningNode};

export function ReactFlowDiagram({ariaLabel, caption, className, edges, height = 300, nodes}: ReactFlowDiagramProps) {
  const [vertical, setVertical] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 700px)');
    const updateLayout = (event: MediaQueryListEvent | MediaQueryList) => setVertical(event.matches);
    updateLayout(mediaQuery);
    mediaQuery.addEventListener('change', updateLayout);
    return () => mediaQuery.removeEventListener('change', updateLayout);
  }, []);

  const flowNodes = useMemo<Node<LearningNodeData>[]>(
    () => nodes.map(({id, x, y, ...data}, index) => ({
      id,
      type: 'learning',
      position: vertical ? {x: 0, y: index * 112} : {x, y},
      data: {...data, vertical},
    })),
    [nodes, vertical],
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
      <div
        className={clsx(styles.reactFlowCanvas, vertical && styles.reactFlowCanvasVertical)}
        style={{height: vertical ? nodes.length * 112 + 48 : height}}
      >
        <ReactFlow
          key={vertical ? 'vertical' : 'horizontal'}
          edges={flowEdges}
          elementsSelectable={false}
          fitView
          fitViewOptions={{padding: vertical ? 0.12 : 0.06}}
          maxZoom={1.15}
          minZoom={0.6}
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
