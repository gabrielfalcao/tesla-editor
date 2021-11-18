import * as monaco from "monaco-editor";
import { setupEmacsNavigation } from "@app/renderer/Editor/navigation";
import { createOverlayWidget } from "@app/renderer/Editor/Widget";
import monokai from "monaco-themes/themes/Monokai.json";

export const defaultOptions = {
  theme: "monokai",
  height: "100%",
  fontSize: "18px",
  scrollBeyondLastLine: false,
  width: "100%"
};
monaco.editor.defineTheme("monokai", monokai);

export function createEditor(parentElement, options, context) {
  const editor = monaco.editor.create(parentElement, {
    ...defaultOptions,
    ...options,
    language: undefined,
    value: ""
  });
  const widget = createOverlayWidget(context, editor);
  setupEmacsNavigation(context, editor);
  editor.addOverlayWidget(widget);
  window.addEventListener(
    "resize",
    // see: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IEditor.html#layout
    () => {
      parentElement.style.height = `${window.innerHeight - 48}px`;
      editor.layout();
      //editor.layoutWidget(widget);
    }
  );
  const supportedActions = editor.getSupportedActions().map(a => a.id);
  console.log({ supportedActions });
  return editor;
}
