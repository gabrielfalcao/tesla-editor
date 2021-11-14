import * as monaco from "monaco-editor";
import { setupEmacsNavigation } from "./navigation";

export const defaultOptions = {
  theme: "vs-dark",
  height: "100%",
  fontSize: "18px",
  scrollBeyondLastLine: false,
  width: "100%"
};

export function createEditor(parentElement, options) {
  const editor = monaco.editor.create(parentElement, {
    ...defaultOptions,
    ...options,
    language: undefined,
    value: ""
  });
  setupEmacsNavigation(editor);

  window.addEventListener(
    "resize",
    // see: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IEditor.html#layout
    () => {
      parentElement.style.height = `${window.innerHeight - 48}px`;
      editor.layout();
    }
  );

  return editor;
}
