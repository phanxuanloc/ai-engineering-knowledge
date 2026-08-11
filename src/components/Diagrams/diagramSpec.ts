import type {Node} from '@xyflow/react';
import type {DiagramEdge, DiagramKind, DiagramNode} from './ReactFlowDiagram';
import type {FlowDirection} from './layoutGraph';

export type DiagramDiagnostic = {
  code: string;
  evidence: string;
  severity: 'error' | 'warning';
  subject: string;
  supportedFixes: string[];
};

export type DiagramSpec = {
  edges: DiagramEdge[];
  direction?: FlowDirection;
  kind: DiagramKind;
  nodes: DiagramNode[];
  primaryPath?: string[];
};

const MAX_PRIMARY_NODES = 12;
const MAX_UNGROUPED_NODES = 18;

export function validateDiagramSpec({edges, kind, nodes, primaryPath}: DiagramSpec): DiagramDiagnostic[] {
  const diagnostics: DiagramDiagnostic[] = [];
  const nodeIds = new Set<string>();
  const edgeKeys = new Set<string>();

  for (const node of nodes) {
    if (!node.id.trim()) diagnostics.push({code: 'structural/empty-node-id', severity: 'error', subject: 'node', evidence: 'A node has an empty id.', supportedFixes: ['assign a stable non-empty node id']});
    else if (nodeIds.has(node.id)) diagnostics.push({code: 'structural/duplicate-node-id', severity: 'error', subject: node.id, evidence: `Node id ${node.id} appears more than once.`, supportedFixes: ['keep one semantic entity per stable id']});
    nodeIds.add(node.id);
    if (!node.label.trim()) diagnostics.push({code: 'readability/empty-label', severity: 'error', subject: node.id, evidence: 'The node has no readable label.', supportedFixes: ['add a concise semantic label']});
    if (node.label.length > 42) diagnostics.push({code: 'readability/long-label', severity: 'warning', subject: node.id, evidence: `The label is ${node.label.length} characters.`, supportedFixes: ['shorten the label and move explanation into detail or nearby prose']});
  }

  for (const edge of edges) {
    const key = `${edge.source}->${edge.target}`;
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) diagnostics.push({code: 'structural/invalid-edge-reference', severity: 'error', subject: key, evidence: 'The edge references a node id absent from the spec.', supportedFixes: ['correct the endpoint id or add the grounded missing node']});
    if (edge.source === edge.target) diagnostics.push({code: 'structural/self-loop', severity: 'warning', subject: key, evidence: 'The edge starts and ends at the same node.', supportedFixes: ['remove it unless a self-transition is essential and explicitly taught']});
    if (edgeKeys.has(key)) diagnostics.push({code: 'structural/duplicate-edge', severity: 'warning', subject: key, evidence: 'Equivalent endpoints appear more than once.', supportedFixes: ['keep one relationship or make the distinct semantics explicit']});
    edgeKeys.add(key);
  }

  if (primaryPath) {
    for (const id of primaryPath) if (!nodeIds.has(id)) diagnostics.push({code: 'structural/invalid-primary-path-node', severity: 'error', subject: id, evidence: 'The primary path references an absent node.', supportedFixes: ['correct the primary path or restore the grounded node']});
    for (let index = 1; index < primaryPath.length; index += 1) {
      const edge = `${primaryPath[index - 1]}->${primaryPath[index]}`;
      if (!edgeKeys.has(edge)) diagnostics.push({code: 'structural/disconnected-primary-path', severity: 'error', subject: edge, evidence: 'Consecutive primary-path nodes are not connected in the declared direction.', supportedFixes: ['add the grounded relationship or correct the primary-path order']});
    }
  }

  if (nodes.length > MAX_PRIMARY_NODES) diagnostics.push({code: 'readability/progressive-disclosure', severity: nodes.length > MAX_UNGROUPED_NODES ? 'error' : 'warning', subject: kind, evidence: `The diagram contains ${nodes.length} primary nodes.`, supportedFixes: ['group secondary detail', 'move supporting facts into MDX', 'split into focused diagrams']});
  return diagnostics;
}

export function validateDiagramLayout(nodes: Node[], bounds: {height: number; width: number}, spec?: DiagramSpec): DiagramDiagnostic[] {
  const diagnostics: DiagramDiagnostic[] = [];
  for (let leftIndex = 0; leftIndex < nodes.length; leftIndex += 1) {
    const left = nodes[leftIndex];
    const leftWidth = left.width ?? 0;
    const leftHeight = left.height ?? 0;
    for (let rightIndex = leftIndex + 1; rightIndex < nodes.length; rightIndex += 1) {
      const right = nodes[rightIndex];
      const overlaps = left.position.x < right.position.x + (right.width ?? 0)
        && left.position.x + leftWidth > right.position.x
        && left.position.y < right.position.y + (right.height ?? 0)
        && left.position.y + leftHeight > right.position.y;
      if (overlaps) diagnostics.push({code: 'layout/node-overlap', severity: 'error', subject: `${left.id},${right.id}`, evidence: 'The computed node rectangles overlap.', supportedFixes: ['increase shared spacing', 'correct semantic ranks', 'split the view']});
    }
  }
  const longAxisRatio = Math.max(bounds.width, bounds.height) / Math.max(1, Math.min(bounds.width, bounds.height));
  if (nodes.length >= 5 && longAxisRatio > 4.5) diagnostics.push({code: 'layout/excessive-aspect-ratio', severity: 'warning', subject: 'graph', evidence: `The graph bounds have a ${longAxisRatio.toFixed(1)}:1 long-axis ratio.`, supportedFixes: ['use multiple semantic ranks', 'choose a more suitable direction', 'split secondary detail']});
  if (spec?.primaryPath?.length) {
    const byId = new Map(nodes.map((node) => [node.id, node]));
    const direction = spec.direction ?? 'TB';
    const centers = spec.primaryPath.flatMap((id) => {
      const node = byId.get(id);
      if (!node) return [];
      return [direction === 'TB'
        ? node.position.x + (node.width ?? 0) / 2
        : node.position.y + (node.height ?? 0) / 2];
    });
    const spineDrift = Math.max(...centers) - Math.min(...centers);
    if (spineDrift > 4) diagnostics.push({code: 'layout/primary-spine-drift', severity: 'warning', subject: spec.primaryPath.join('→'), evidence: `Primary-path centers drift by ${spineDrift.toFixed(1)}px on the cross axis.`, supportedFixes: ['center-align primary ranks', 'use explicit semantic lanes only when topology requires them']});
  }
  return diagnostics;
}

export function assertDiagramQuality(spec: DiagramSpec, nodes: Node[], bounds: {height: number; width: number}): DiagramDiagnostic[] {
  const diagnostics = [...validateDiagramSpec(spec), ...validateDiagramLayout(nodes, bounds, spec)];
  const errors = diagnostics.filter(({severity}) => severity === 'error');
  if (errors.length) throw new Error(`Diagram validation failed:\n${errors.map(({code, evidence, subject}) => `- ${code} [${subject}]: ${evidence}`).join('\n')}`);
  return diagnostics;
}
