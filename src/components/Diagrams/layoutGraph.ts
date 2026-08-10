import dagre from '@dagrejs/dagre';
import {Position, type Edge, type Node} from '@xyflow/react';

export type FlowDirection = 'TB' | 'LR';

export type LayoutOptions = {
  direction?: FlowDirection;
  nodeSpacing?: number;
  rankSpacing?: number;
};

export type LayoutResult<NodeType extends Node = Node> = {
  bounds: {height: number; width: number};
  nodes: NodeType[];
};

export function layoutWithDagre<NodeType extends Node>(
  nodes: NodeType[],
  edges: Edge[],
  {direction = 'TB', nodeSpacing = 48, rankSpacing = 52}: LayoutOptions = {},
): LayoutResult<NodeType> {
  const graph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  graph.setGraph({rankdir: direction, nodesep: nodeSpacing, ranksep: rankSpacing, marginx: 0, marginy: 0});

  for (const node of nodes) {
    graph.setNode(node.id, {width: node.width ?? 168, height: node.height ?? 76});
  }
  for (const edge of edges) graph.setEdge(edge.source, edge.target);
  dagre.layout(graph);

  const horizontal = direction === 'LR';
  const laidOutNodes = nodes.map((node) => {
    const position = graph.node(node.id);
    const width = node.width ?? 168;
    const height = node.height ?? 76;
    return {
      ...node,
      position: {x: position.x - width / 2, y: position.y - height / 2},
      sourcePosition: horizontal ? Position.Right : Position.Bottom,
      targetPosition: horizontal ? Position.Left : Position.Top,
    };
  });

  const graphBounds = graph.graph();
  return {
    nodes: laidOutNodes,
    bounds: {width: graphBounds.width ?? 0, height: graphBounds.height ?? 0},
  };
}

export function layoutGraph<NodeType extends Node>(
  nodes: NodeType[],
  edges: Edge[],
  options: LayoutOptions = {},
): LayoutResult<NodeType> {
  return layoutWithDagre(nodes, edges, options);
}
