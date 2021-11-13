import React, { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import * as monaco from "monaco-editor";

const editorStyle = {
  minWidth: "100%",
  height: "100%",
  position: "relative",
  marginTop: "56px",
};
const containerStyle = {
  minWidth: "100%",
  height: "100%",
  position: "absolute",
};
export const defaultOptions = {
  theme: "vs-dark",
  height: "100%",
  fontSize: "18px",
  scrollBeyondLastLine: false,
  width: "100%",
  value: undefined,
  setDirty: () => {},
  dirty: undefined,
};
export default function Editor({
  setLanguage,
  language,
  setDirty,
  dirty,
  ...options
} = defaultOptions) {
  const [editor, setEditor] = useState(null);

  const loadEditor = (current) => {
    const container = document.getElementById("e80dd5");
    container.innerHTML = "";
    const editor =
      current ||
      monaco.editor.create(container, {
        ...defaultOptions,
        ...options,
        language,
        value: undefined,
      });

    if (options.value) {
      editor.getModel().dispose();
      const model = monaco.editor.createModel(
        options.value,
        undefined, // language
        monaco.Uri.file(options.filename) // uri
      );
      const detectedLanguage = model.getLanguageId();
      editor.setModel(model);
      model.onDidChangeContent(() => {
        const newValue = model.getValue();
        const hasChanged = newValue !== options.value;
        if (hasChanged) {
          if (!dirty) {
            setDirty(true);
            editor.focus();
          }
        }
      });
      setEditor(editor);
      if (detectedLanguage) {
        setLanguage(detectedLanguage);
      }
    }
  };
  useEffect(() => {
    if (!editor) {
      loadEditor();
    } else {
      if (!editor.getModel().uri.path.match(options.filename)) {
        loadEditor(editor);
      }
      window.addEventListener("resize", () => loadEditor(editor));
    }
  });
  ipcRenderer.once("save-file", () => {
    if (editor && dirty) {
      const model = editor.getModel();
      const code = {
        filename: model.uri.path,
        content: model.getValue(),
      };
      console.log("requesting to write file", code);
      ipcRenderer.send("write-code", code);
    }
  });

  return (
    <div style={containerStyle}>
      <div style={editorStyle} id="e80dd5" />
    </div>
  );
}
