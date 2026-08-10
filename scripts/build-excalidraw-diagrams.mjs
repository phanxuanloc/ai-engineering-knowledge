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
  if (vertical) return {width: 390, height: 720, elements: [
    note(28, 20, 'lots of available information', 22, '#5f3dc4'),
    note(40, 70, '▣ repository', 21), note(205, 64, '◯ memory', 21),
    note(58, 112, '⌁ tools', 21), note(220, 118, '≡ docs + history', 19),
    note(25, 162, 'old logs', 17, '#868e96'),
    sketchLine([[20, 158], [105, 188]]), sketchLine([[100, 156], [24, 190]]),
    ...sketchArrow([[108, 176], [145, 190], [168, 208]], null, sketchPresets.secondaryArrow),
    sketchLine([[171, 194], [171, 222]]),
    ...sketchArrow([[275, 157], [248, 198], [205, 235]], 'select useful only'),
    shape('rectangle', 38, 245, 316, 310, sketchPresets.conceptContainer, {angle: -.015}),
    note(195, 272, 'CONTEXT WINDOW', 27, '#343a40', 'center'),
    note(195, 312, 'limited capacity', 19, '#5f3dc4', 'center'),
    shape('ellipse', 78, 360, 118, 58, sketchPresets.conceptBox), note(137, 379, 'task', 21, '#343a40', 'center'),
    shape('rectangle', 205, 352, 120, 68, sketchPresets.sketchNote, {angle: .018}), note(265, 373, 'constraints', 18, '#343a40', 'center'),
    shape('rectangle', 82, 445, 220, 68, sketchPresets.conceptHighlight, {angle: -.012}), note(192, 466, 'relevant information', 18, '#343a40', 'center'),
    ...sketchArrow([[195, 565], [204, 592], [195, 620]], null),
    shape('ellipse', 140, 628, 110, 60, sketchPresets.llmNode, {angle: .012}), note(195, 647, 'LLM', 24, '#343a40', 'center'),
  ]};
  return {width: 920, height: 500, elements: [
    note(28, 22, 'lots of available information', 25, '#5f3dc4'),
    note(45, 85, '▣ repository', 23), note(54, 133, '◯ memory', 23),
    note(40, 181, '⌁ tools', 23), note(58, 229, '≡ docs', 23), note(45, 277, '↶ history', 23),
    ...sketchArrow([[210, 118], [285, 148], [330, 195]], null, sketchPresets.secondaryArrow),
    note(150, 166, 'select useful only', 17, '#5f3dc4'),
    ...sketchArrow([[190, 215], [276, 224], [337, 242]], null),
    ...sketchArrow([[215, 302], [290, 292], [340, 275]], null, sketchPresets.secondaryArrow),
    note(72, 352, 'unrelated logs', 18, '#868e96'),
    sketchLine([[62, 347], [205, 382]]), sketchLine([[198, 345], [68, 384]]),
    ...sketchArrow([[210, 365], [270, 350], [322, 329]], null, sketchPresets.secondaryArrow),
    sketchLine([[326, 311], [329, 348]]),
    shape('rectangle', 345, 55, 535, 355, sketchPresets.conceptContainer, {angle: -.012}),
    note(605, 80, 'CONTEXT WINDOW', 31, '#343a40', 'center'),
    note(604, 124, 'limited capacity', 20, '#5f3dc4', 'center'),
    shape('ellipse', 405, 185, 145, 70, sketchPresets.conceptBox, {angle: .025}), note(477, 207, 'task', 24, '#343a40', 'center'),
    shape('rectangle', 610, 174, 195, 78, sketchPresets.sketchNote, {angle: -.018}), note(707, 199, 'constraints', 22, '#343a40', 'center'),
    shape('rectangle', 470, 292, 255, 74, sketchPresets.conceptHighlight, {angle: .012}), note(597, 314, 'relevant information', 21, '#343a40', 'center'),
    ...sketchArrow([[610, 416], [630, 440], [655, 452]], null),
    shape('ellipse', 650, 430, 118, 62, sketchPresets.llmNode, {angle: .015}), note(709, 450, 'LLM', 25, '#343a40', 'center'),
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
  ['context-quality', contextQuality(false)], ['context-quality-mobile', contextQuality(true)],
]) {
  const sceneData = scene(name, data);
  await writeFile(path.join(outputDir, `${name}.excalidraw`), `${JSON.stringify(sceneData, null, 2)}\n`);
  await writeFile(path.join(outputDir, `${name}.svg`), `${await exportScene(sceneData)}\n`);
}
