import React, { useLayoutEffect } from "react";
import * as monaco from "monaco-editor";
import { useEditor } from "@app/renderer/EditorProvider";

const editorStyle = {
  minWidth: "100%",
  height: "100%",
  position: "relative",
  marginTop: "64px"
};
const containerStyle = {
  minWidth: "100%",
  height: "100%",
  position: "absolute"
};
export const defaultOptions = {
  theme: "vs-dark",
  height: "100%",
  fontSize: "18px",
  scrollBeyondLastLine: false,
  width: "100%"
};

export function loadCodeIntoEditor(instance, code) {
  instance.getModel().dispose();
  const model = monaco.editor.createModel(
    code.content,
    code.content, // detect language when `undefined`
    monaco.Uri.file(code.filename) // uri
  );
  instance.setModel(model);
  return model;
}
export default function Editor(options = defaultOptions) {
  const {
    code,
    dirty,
    language,
    instance,
    setDirty,
    setInstance,
    setLanguage
  } = useEditor();

  const loadEditor = current => {
    const container = document.getElementById("monaco-parent");
    container.innerHTML = "";
    const monacoInstance =
      current ||
      monaco.editor.create(container, {
        ...defaultOptions,
        ...options,
        language: undefined,
        value: code.content
      });

    if (code.content && code.filename) {
      const model = loadCodeIntoEditor(monacoInstance, code);
      const detectedLanguage = model.getLanguageId();
      model.onDidChangeContent(() => {
        const newValue = model.getValue();
        const hasChanged = newValue !== options.value;
        if (hasChanged) {
          if (!dirty) {
            setDirty(true);
            monacoInstance.focus();
          }
        }
      });
      setInstance(monacoInstance);
      console.warn({ detectedLanguage });
      if (detectedLanguage !== language) {
        setLanguage(detectedLanguage);
      }
    }
  };
  useLayoutEffect(() => {
    if (!instance) {
      loadEditor();
    } else {
      if (!instance.getModel().uri.path.match(options.filename)) {
        loadEditor(instance);
      }
      // auto resize editor
      window.addEventListener(
        "resize",
        // see: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IEditor.html#layout
        () => instance.layout()
      );
    }
  });

  return (
    <div style={containerStyle}>
      <div style={editorStyle} id="monaco-parent" />
    </div>
  );
}
