import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {sketchPalette, sketchPresets} from './excalidraw-presets.mjs';

const outputDir = path.resolve('static/img/diagrams/excalidraw');
let sequence = 0;

function base(type, x, y, width, height, preset = {}, options = {}) {
  sequence += 1;
  const style = {...sketchPresets.sketchDefaults, ...preset, ...options};
  return {
    id: `element-${sequence}`, type, x, y, width, height, angle: options.angle ?? 0,
    strokeColor: style.strokeColor, backgroundColor: style.backgroundColor,
    fillStyle: style.fillStyle, strokeWidth: style.strokeWidth,
    strokeStyle: style.strokeStyle, roughness: style.roughness, opacity: 100,
    groupIds: [], frameId: null, index: `a${sequence}`,
    roundness: type === 'rectangle' ? {type: 3} : null,
    seed: 3100 + sequence * 37, version: 1, versionNonce: 7100 + sequence * 53,
    isDeleted: false, boundElements: [], updated: 1, link: null, locked: false,
  };
}

function shape(type, x, y, width, height, preset, options) {
  return base(type, x, y, width, height, preset, options);
}

function note(x, y, value, fontSize = 20, color = '#343a40', align = 'left') {
  const width = Math.max(24, value.length * fontSize * .62);
  return {
    ...base('text', align === 'center' ? x - width / 2 : x, y, width, fontSize * 1.25, sketchPresets.annotation, {strokeColor: color, strokeWidth: 1}),
    text: value, fontSize, fontFamily: 1, textAlign: align, verticalAlign: 'top',
    baseline: fontSize, containerId: null, originalText: value, lineHeight: 1.25,
  };
}

function sketchArrow(points, label, preset = sketchPresets.sketchArrow) {
  const [origin, ...rest] = points;
  const relative = [[0, 0], ...rest.map(([x, y]) => [x - origin[0], y - origin[1]])];
  const xs = relative.map(([x]) => x); const ys = relative.map(([, y]) => y);
  const arrow = {
    ...base('arrow', origin[0], origin[1], Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), preset),
    points: relative, startBinding: null, endBinding: null,
    startArrowhead: null, endArrowhead: 'arrow', elbowed: false,
  };
  if (!label) return [arrow];
  const middle = points[Math.floor(points.length / 2)];
  return [arrow, note(middle[0] + 8, middle[1] - 28, label, 17, '#5f3dc4')];
}

function sketchLine(points, preset = sketchPresets.rejectedNoise) {
  const [origin, ...rest] = points;
  const relative = [[0, 0], ...rest.map(([x, y]) => [x - origin[0], y - origin[1]])];
  const xs = relative.map(([x]) => x); const ys = relative.map(([, y]) => y);
  return {...base('line', origin[0], origin[1], Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), preset), points: relative, startBinding: null, endBinding: null, startArrowhead: null, endArrowhead: null};
}

function contextWindow(vertical) {
  if (vertical) return {width: 390, height: 950, elements: [
    note(195, 18, 'AVAILABLE INFORMATION', 23, '#5f3dc4', 'center'),
    note(38, 68, '▣ repository', 19), note(210, 68, '◯ memory', 19),
    note(50, 108, '⌁ tools', 19), note(218, 108, '≡ docs + history', 17),
    ...sketchArrow([[92, 145], [145, 178], [165, 211]], null, sketchPresets.secondaryArrow),
    ...sketchArrow([[292, 145], [240, 178], [225, 211]], null, sketchPresets.secondaryArrow),
    note(20, 174, 'unused logs', 15, '#868e96'),
    sketchLine([[14, 170], [96, 198]]), sketchLine([[92, 169], [18, 201]]),
    sketchLine([[101, 177], [101, 207]]),
    shape('ellipse', 90, 215, 210, 64, sketchPresets.conceptBox, {angle: -.015}),
    note(195, 236, 'SELECT USEFUL', 19, '#343a40', 'center'),
    ...sketchArrow([[195, 284], [202, 307], [195, 326]], null),
    shape('rectangle', 65, 332, 260, 66, sketchPresets.conceptHighlight, {angle: .012}),
    note(195, 353, 'SELECTED CONTEXT', 18, '#343a40', 'center'),
    ...sketchArrow([[195, 404], [188, 426], [195, 446]], null),
    shape('rectangle', 36, 454, 318, 350, sketchPresets.conceptContainer, {angle: -.012}),
    note(195, 480, 'CONTEXT WINDOW', 26, '#343a40', 'center'),
    note(195, 517, 'limited capacity', 18, '#5f3dc4', 'center'),
    shape('ellipse', 75, 566, 240, 58, sketchPresets.conceptBox, {angle: .018}),
    note(195, 584, 'Task / Instructions', 18, '#343a40', 'center'),
    shape('rectangle', 104, 649, 182, 58, sketchPresets.sketchNote, {angle: -.014}),
    note(195, 668, 'Constraints', 18, '#343a40', 'center'),
    shape('rectangle', 72, 732, 246, 58, sketchPresets.conceptHighlight, {angle: .01}),
    note(195, 750, 'Relevant Information', 17, '#343a40', 'center'),
    ...sketchArrow([[195, 814], [202, 838], [195, 856]], null),
    shape('ellipse', 140, 862, 110, 60, sketchPresets.llmNode, {angle: .012}),
    note(195, 881, 'LLM', 24, '#343a40', 'center'),
  ]};
  return {width: 1060, height: 560, elements: [
    note(32, 22, 'AVAILABLE INFORMATION', 26, '#5f3dc4'),
    note(42, 88, '▣ repository', 21), note(42, 137, '◯ memory', 21),
    note(42, 186, '⌁ tools', 21), note(42, 235, '≡ docs', 21), note(42, 284, '↶ history', 21),
    ...sketchArrow([[190, 112], [245, 158], [282, 206]], null, sketchPresets.secondaryArrow),
    ...sketchArrow([[190, 205], [242, 217], [282, 226]], null, sketchPresets.secondaryArrow),
    ...sketchArrow([[190, 300], [244, 272], [282, 246]], null, sketchPresets.secondaryArrow),
    shape('ellipse', 270, 188, 190, 82, sketchPresets.conceptBox, {angle: -.018}),
    note(365, 214, 'SELECT USEFUL', 19, '#343a40', 'center'),
    note(62, 373, 'unused logs', 17, '#868e96'),
    sketchLine([[52, 365], [175, 405]]), sketchLine([[170, 363], [58, 408]]),
    ...sketchArrow([[180, 385], [232, 330], [282, 267]], null, sketchPresets.secondaryArrow),
    sketchLine([[274, 254], [288, 281]]),
    ...sketchArrow([[465, 229], [484, 218], [505, 229]], null),
    shape('rectangle', 505, 188, 200, 82, sketchPresets.conceptHighlight, {angle: .012}),
    note(605, 214, 'SELECTED CONTEXT', 18, '#343a40', 'center'),
    ...sketchArrow([[710, 229], [724, 218], [740, 229]], null),
    shape('rectangle', 740, 54, 290, 394, sketchPresets.conceptContainer, {angle: -.01}),
    note(885, 80, 'CONTEXT WINDOW', 29, '#343a40', 'center'),
    note(885, 120, 'limited capacity', 19, '#5f3dc4', 'center'),
    shape('ellipse', 775, 174, 220, 58, sketchPresets.conceptBox, {angle: .018}),
    note(885, 192, 'Task / Instructions', 18, '#343a40', 'center'),
    shape('rectangle', 795, 266, 180, 58, sketchPresets.sketchNote, {angle: -.015}),
    note(885, 284, 'Constraints', 18, '#343a40', 'center'),
    shape('rectangle', 770, 357, 230, 58, sketchPresets.conceptHighlight, {angle: .012}),
    note(885, 375, 'Relevant Information', 17, '#343a40', 'center'),
    ...sketchArrow([[885, 458], [892, 482], [885, 498]], null),
    shape('ellipse', 830, 500, 110, 58, sketchPresets.llmNode, {angle: .012}),
    note(885, 518, 'LLM', 23, '#343a40', 'center'),
  ]};
}

function contextQuality(vertical) {
  const checks = [
    ['Relevant?', 'right signal', sketchPalette.yellow], ['Sufficient?', 'enough evidence', sketchPalette.blue],
    ['Low noise?', 'remove clutter', sketchPalette.orange], ['Low repeat?', 'deduplicate', sketchPalette.green],
    ['Fresh?', 'current state', sketchPalette.purple], ['Correct?', 'source of truth', sketchPalette.blue],
  ];
  if (vertical) return {width: 390, height: 680, elements: [
    note(195, 22, 'Is this context good enough?', 24, '#5f3dc4', 'center'),
    shape('ellipse', 90, 70, 210, 70, sketchPresets.conceptBox), note(195, 92, 'candidate context', 21, '#343a40', 'center'),
    ...sketchArrow([[195, 145], [181, 170], [195, 196]], null),
    ...checks.flatMap(([label, detail, color], index) => {
      const x = index % 2 ? 207 : 28; const y = 205 + Math.floor(index / 2) * 112;
      return [shape(index % 3 === 0 ? 'ellipse' : 'rectangle', x, y, 155, 78, {...sketchPresets.conceptBox, backgroundColor: color}, {angle: index % 2 ? .018 : -.018}), note(x + 77, y + 17, label, 19, '#343a40', 'center'), note(x + 77, y + 47, detail, 15, '#59606f', 'center')];
    }),
    note(35, 548, 'all dimensions matter', 18, '#c92a2a'), ...sketchArrow([[195, 575], [210, 598], [195, 620]], null),
    shape('ellipse', 92, 618, 206, 58, sketchPresets.importantConcept), note(195, 636, 'good for next decision', 18, '#343a40', 'center'),
  ]};
  return {width: 920, height: 500, elements: [
    note(460, 20, 'Is this context good enough?', 28, '#5f3dc4', 'center'),
    shape('ellipse', 40, 178, 180, 88, sketchPresets.conceptBox, {angle: -.02}), note(130, 204, 'candidate context', 21, '#343a40', 'center'),
    ...sketchArrow([[225, 220], [268, 190], [300, 150]], null),
    ...checks.flatMap(([label, detail, color], index) => {
      const positions = [[300, 83], [490, 66], [676, 108], [326, 255], [520, 280], [700, 250]];
      const [x, y] = positions[index];
      return [shape(index % 2 ? 'ellipse' : 'rectangle', x, y, 165, 82, {...sketchPresets.conceptBox, backgroundColor: color}, {angle: (index % 3 - 1) * .018}), note(x + 82, y + 18, label, 20, '#343a40', 'center'), note(x + 82, y + 50, detail, 16, '#59606f', 'center')];
    }),
    ...sketchArrow([[828, 350], [850, 387], [820, 420]], 'all checks'),
    shape('ellipse', 610, 410, 250, 70, sketchPresets.importantConcept, {angle: .015}), note(735, 432, 'good for next decision', 20, '#343a40', 'center'),
    note(280, 430, 'one weak dimension can break it', 18, '#c92a2a'),
  ]};
}

function scene(name, data) {
  return {type: 'excalidraw', version: 2, source: 'https://github.com/phanxuanloc/ai-engineering-knowledge', elements: data.elements, appState: {gridSize: null, viewBackgroundColor: '#fffdfa'}, files: {}, name};
}

async function createExporter() {
  const bundle = await build({entryPoints: [path.resolve('scripts/excalidraw-export-entry.js')], bundle: true, platform: 'browser', format: 'iife', write: false, loader: {'.woff2': 'dataurl', '.woff': 'dataurl', '.ttf': 'dataurl', '.css': 'text'}, logLevel: 'silent'});
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {runScripts: 'dangerously', pretendToBeVisual: true});
  dom.window.HTMLCanvasElement.prototype.getContext = () => ({filter: '', font: '20px Virgil', measureText: (value) => ({width: String(value).length * 10, actualBoundingBoxLeft: 0, actualBoundingBoxRight: String(value).length * 10, actualBoundingBoxAscent: 16, actualBoundingBoxDescent: 4})});
  dom.window.FontFace = class {load() { return Promise.resolve(this); }};
  Object.defineProperty(dom.window.document, 'fonts', {value: {add() {}, load: async () => [], ready: Promise.resolve()}});
  dom.window.eval(bundle.outputFiles[0].text);
  const virgil = await readFile(path.resolve('node_modules/@excalidraw/excalidraw/dist/prod/fonts/Virgil/Virgil-Regular.woff2'));
  const embeddedFont = `@font-face{font-family:Virgil;src:url(data:font/woff2;base64,${virgil.toString('base64')}) format('woff2');font-weight:normal;font-style:normal}`;
  return async (sceneData) => {
    const svg = await dom.window.exportExcalidrawScene(sceneData);
    return svg.replace('<style class="style-fonts">', `<style class="style-fonts">${embeddedFont}`);
  };
}

await mkdir(outputDir, {recursive: true});
const exportScene = await createExporter();
for (const [name, data] of [
  ['context-window-mental-model', contextWindow(false)], ['context-window-mental-model-mobile', contextWindow(true)],
  ['context-quality', (sequence = 51, contextQuality(false))], ['context-quality-mobile', (sequence = 78, contextQuality(true))],
]) {
  const sceneData = scene(name, data);
  await writeFile(path.join(outputDir, `${name}.excalidraw`), `${JSON.stringify(sceneData, null, 2)}\n`);
  await writeFile(path.join(outputDir, `${name}.svg`), `${await exportScene(sceneData)}\n`);
}
