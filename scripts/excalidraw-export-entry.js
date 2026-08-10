import {exportToSvg} from '@excalidraw/excalidraw';

window.exportExcalidrawScene = async (scene) => {
  const svg = await exportToSvg({
    elements: scene.elements,
    appState: {...scene.appState, exportBackground: true, exportWithDarkMode: false},
    files: scene.files ?? {},
    exportPadding: 12,
    skipInliningFonts: true,
  });
  return svg.outerHTML;
};
