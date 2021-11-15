import * as monaco from "monaco-editor";
import { setupEmacsNavigation } from "@app/renderer/Editor/navigation";
import { createOverlayWidget } from "@app/renderer/Editor/Widget";

export const defaultOptions = {
  theme: "vs-dark",
  height: "100%",
  fontSize: "18px",
  scrollBeyondLastLine: false,
  width: "100%",
};

export function createEditor(parentElement, options, context) {
  const editor = monaco.editor.create(parentElement, {
    ...defaultOptions,
    ...options,
    language: undefined,
    value: "",
  });
  const widget = createOverlayWidget({ ...context, instance: editor });
  setupEmacsNavigation(editor);
  editor.addOverlayWidget(widget);
  window.addEventListener(
    "resize",
    // see: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IEditor.html#layout
    () => {
      parentElement.style.height = `${window.innerHeight - 48}px`;
      editor.layout();
      editor.layoutWidget(widget);
    }
  );

  return editor;
}
