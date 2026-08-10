import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';

const outputDir = path.resolve('static/img/diagrams/excalidraw');
const now = 1;
let sequence = 0;

function base(type, x, y, width, height, options = {}) {
  sequence += 1;
  return {
    id: `element-${sequence}`,
    type, x, y, width, height, angle: 0,
    strokeColor: options.strokeColor ?? '#343a46',
    backgroundColor: options.backgroundColor ?? 'transparent',
    fillStyle: 'solid', strokeWidth: options.strokeWidth ?? 2,
    strokeStyle: 'solid', roughness: 1, opacity: 100,
    groupIds: [], frameId: null, index: `a${sequence}`,
    roundness: type === 'rectangle' ? {type: 3} : null,
    seed: 1000 + sequence, version: 1, versionNonce: 2000 + sequence,
    isDeleted: false, boundElements: [], updated: now, link: null, locked: false,
  };
}

function box(x, y, width, height, label, detail, options = {}) {
  const rect = base('rectangle', x, y, width, height, options);
  const labelText = text(x + width / 2, y + (detail ? height / 2 - 10 : height / 2), label, options.fontSize ?? 20, true);
  const elements = [rect, labelText];
  if (detail) elements.push(text(x + width / 2, y + height / 2 + 18, detail, 15, false, '#59606f'));
  return elements;
}

function panel(x, y, width, height, label, detail) {
  return [
    base('rectangle', x, y, width, height, {backgroundColor: '#eef0ff', strokeColor: '#5966d0'}),
    text(x + width / 2, y + 36, label, 24, true),
    text(x + width / 2, y + 66, detail, 15, false, '#59606f'),
  ];
}

function text(x, y, value, fontSize = 18, bold = false, color = '#343a46') {
  const width = Math.max(20, value.length * fontSize * .57);
  return {...base('text', x - width / 2, y - fontSize / 2, width, fontSize * 1.25, {strokeColor: color, strokeWidth: 1}), text: value, fontSize, fontFamily: 2, textAlign: 'center', verticalAlign: 'middle', baseline: fontSize, containerId: null, originalText: value, lineHeight: 1.25, bold};
}

function arrow(x1, y1, x2, y2, label) {
  const element = {...base('arrow', x1, y1, x2 - x1, y2 - y1), points: [[0, 0], [x2 - x1, y2 - y1]], startBinding: null, endBinding: null, startArrowhead: null, endArrowhead: 'arrow', elbowed: false};
  return label ? [element, text((x1 + x2) / 2, (y1 + y2) / 2 - 14, label, 13, false, '#4654c7')] : [element];
}

function contextWindow(vertical) {
  if (vertical) return {
    width: 390, height: 540, elements: [
      text(195, 32, 'Nhiều nguồn thông tin', 18, true, '#4654c7'),
      ...box(28, 58, 150, 58, 'Repository · Memory', null, {fontSize: 15}),
      ...box(212, 58, 150, 58, 'Knowledge · Tools', null, {fontSize: 15}),
      ...arrow(195, 120, 195, 158, 'select'),
      ...panel(45, 165, 300, 245, 'CONTEXT WINDOW', 'capacity hữu hạn'),
      ...box(78, 260, 234, 58, 'Task + constraints'),
      ...box(78, 334, 234, 58, 'Relevant code + evidence'),
      ...arrow(195, 415, 195, 452),
      ...box(62, 458, 266, 58, 'Context Engineering', 'chọn đúng thứ cần giữ', {backgroundColor: '#f7f7f9', strokeColor: '#5966d0'}),
    ],
  };
  return {
    width: 920, height: 390, elements: [
      ...box(20, 70, 220, 82, 'Information Sources', 'repository · memory · tools'),
      ...arrow(245, 111, 295, 111, 'select'),
      ...panel(300, 35, 600, 300, 'CONTEXT WINDOW', 'capacity hữu hạn cho một invocation'),
      ...box(350, 170, 220, 78, 'Task + constraints', 'mục tiêu hiện tại'),
      ...box(620, 170, 230, 78, 'Relevant context', 'code + fresh evidence'),
      text(600, 302, 'Context Engineering chọn đúng thông tin cho current decision', 17, true, '#4654c7'),
    ],
  };
}

function contextQuality(vertical) {
  const checks = [['Relevant?', 'đúng tín hiệu'], ['Sufficient?', 'đủ evidence'], ['Low noise?', 'ít thông tin rác'], ['Low redundancy?', 'ít lặp'], ['Fresh?', 'current state'], ['Correct?', 'source of truth']];
  if (vertical) return {width: 390, height: 610, elements: [
    ...box(75, 25, 240, 62, 'Candidate Context'), ...arrow(195, 92, 195, 128),
    ...checks.flatMap(([label, detail], index) => box(index % 2 ? 207 : 37, 140 + Math.floor(index / 2) * 105, 146, 76, label, detail, {backgroundColor: '#eef0ff', strokeColor: '#5966d0', fontSize: 17})),
    ...arrow(195, 462, 195, 498), ...box(75, 505, 240, 70, 'Good Context', 'đủ tin cậy cho next decision', {backgroundColor: '#eef0ff', strokeColor: '#5966d0'}),
  ]};
  return {width: 920, height: 390, elements: [
    ...box(25, 145, 170, 82, 'Candidates', 'retrieved context'), ...arrow(200, 186, 255, 186),
    ...checks.flatMap(([label, detail], index) => box(270 + (index % 3) * 175, 65 + Math.floor(index / 3) * 150, 150, 82, label, detail, {backgroundColor: '#eef0ff', strokeColor: '#5966d0', fontSize: 17})),
    ...arrow(770, 186, 800, 186), ...box(805, 140, 95, 92, 'Good Context', 'next decision', {backgroundColor: '#eef0ff', strokeColor: '#5966d0', fontSize: 16}),
  ]};
}

function scene(name, data) {
  return {type: 'excalidraw', version: 2, source: 'https://github.com/phanxuanloc/ai-engineering-knowledge', elements: data.elements, appState: {gridSize: null, viewBackgroundColor: '#fffdfa'}, files: {}, name, width: data.width, height: data.height};
}

function escapeXml(value) { return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'); }

function render(sceneData) {
  const shapes = sceneData.elements.map((element) => {
    if (element.type === 'rectangle') return `<rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" rx="12" fill="${element.backgroundColor === 'transparent' ? '#fffdfa' : element.backgroundColor}" stroke="${element.strokeColor}" stroke-width="${element.strokeWidth}"/>`;
    if (element.type === 'text') return `<text x="${element.x + element.width / 2}" y="${element.y + element.height * .72}" text-anchor="middle" fill="${element.strokeColor}" font-family="Inter,ui-sans-serif,system-ui,sans-serif" font-size="${element.fontSize}" font-weight="${element.bold ? 700 : 450}">${escapeXml(element.text)}</text>`;
    if (element.type === 'arrow') return `<path d="M${element.x} ${element.y} L${element.x + element.width} ${element.y + element.height}" fill="none" stroke="${element.strokeColor}" stroke-width="2" stroke-linecap="round" marker-end="url(#arrow)"/>`;
    return '';
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${sceneData.width} ${sceneData.height}" role="img"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#343a46"/></marker></defs><rect width="100%" height="100%" rx="16" fill="#fffdfa"/>${shapes}</svg>\n`;
}

await mkdir(outputDir, {recursive: true});
for (const [name, data] of [
  ['context-window-mental-model', contextWindow(false)],
  ['context-window-mental-model-mobile', contextWindow(true)],
  ['context-quality', contextQuality(false)],
  ['context-quality-mobile', contextQuality(true)],
]) {
  const sceneData = scene(name, data);
  await writeFile(path.join(outputDir, `${name}.excalidraw`), `${JSON.stringify(sceneData, null, 2)}\n`);
  await writeFile(path.join(outputDir, `${name}.svg`), render(sceneData));
}
