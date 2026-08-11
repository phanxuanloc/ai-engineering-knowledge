import dagre from '@dagrejs/dagre';
import {Position, type Edge, type Node} from '@xyflow/react';

export type FlowDirection = 'TB' | 'LR';

export type LayoutOptions = {
  direction?: FlowDirection;
  layout?: 'dagre' | 'primary-path';
  nodeSpacing?: number;
  primaryPath?: string[];
  rankSpacing?: number;
};

export type LayoutResult<NodeType extends Node = Node> = {
  bounds: {height: number; width: number};
  nodes: NodeType[];
};

const MIN_PRIMARY_PATH_GAP = 28;

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
  if (options.layout === 'primary-path' && options.primaryPath?.length) {
    const {direction = 'TB', nodeSpacing = 48, primaryPath, rankSpacing = MIN_PRIMARY_PATH_GAP} = options;
    const primaryPathGap = Math.max(rankSpacing, MIN_PRIMARY_PATH_GAP);
    const byId = new Map(nodes.map((node) => [node.id, node]));
    const positions = new Map<string, {x: number; y: number}>();
    const primaryNodes = primaryPath.flatMap((id) => byId.get(id) ? [byId.get(id)!] : []);
    const primaryCrossSize = Math.max(...primaryNodes.map((node) => direction === 'TB' ? node.width ?? 168 : node.height ?? 76));
    let cursor = 0;

    for (const id of primaryPath) {
      const node = byId.get(id);
      if (!node) continue;
      positions.set(id, direction === 'TB'
        ? {x: (primaryCrossSize - (node.width ?? 168)) / 2, y: cursor}
        : {x: cursor, y: (primaryCrossSize - (node.height ?? 76)) / 2});
      cursor += (direction === 'TB' ? node.height ?? 76 : node.width ?? 168) + primaryPathGap;
    }

    const sideNodes = nodes.filter((node) => !positions.has(node.id));
    sideNodes.forEach((node, index) => {
      const connectedPrimary = edges
        .flatMap((edge) => edge.source === node.id ? [edge.target] : edge.target === node.id ? [edge.source] : [])
        .find((id) => positions.has(id));
      const anchor = connectedPrimary ? byId.get(connectedPrimary) : byId.get(primaryPath.at(-1) ?? '');
      const anchorPosition = anchor ? positions.get(anchor.id) : undefined;
      const offset = index * ((direction === 'TB' ? node.height ?? 76 : node.width ?? 168) + nodeSpacing);
      positions.set(node.id, direction === 'TB'
        ? {x: primaryCrossSize + nodeSpacing, y: (anchorPosition?.y ?? cursor) + 24 + offset}
        : {x: (anchorPosition?.x ?? cursor) + offset, y: 140 + nodeSpacing});
    });

    const laidOutNodes = nodes.map((node) => ({
      ...node,
      position: positions.get(node.id) ?? {x: 0, y: 0},
      sourcePosition: direction === 'TB' ? Position.Bottom : Position.Right,
      targetPosition: direction === 'TB' ? Position.Top : Position.Left,
    }));
    const minX = Math.min(...laidOutNodes.map((node) => node.position.x));
    const minY = Math.min(...laidOutNodes.map((node) => node.position.y));
    const normalized = laidOutNodes.map((node) => ({...node, position: {x: node.position.x - minX, y: node.position.y - minY}}));
    return {
      nodes: normalized,
      bounds: {
        width: Math.max(...normalized.map((node) => node.position.x + (node.width ?? 168))),
        height: Math.max(...normalized.map((node) => node.position.y + (node.height ?? 76))),
      },
    };
  }
  return layoutWithDagre(nodes, edges, options);
}
