import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { ipcRenderer } from "electron";
import * as monaco from "monaco-editor";

const editorStyle = {
  minWidth: "100%",
  height: "100%",
  position: "relative",
  marginTop: "56px"
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
  width: "100%",
  value: undefined,
  setDirty: () => {},
  dirty: undefined
};
export default function Editor({
  setLanguage,
  setDirty,
  dirty,
  ...options
} = defaultOptions) {
  const element = useRef(null);
  const [editor, setEditor] = useState(null);
  const [value, setValue] = useState(options.value);
  const [filename, setFilename] = useState(options.filename);

  monaco.editor.defineTheme("myTheme", {
    base: "vs",
    inherit: true,
    rules: [{ background: "EDF9FA" }],
    colors: {
      "editor.foreground": "#000000",
      "editor.background": "#EDF9FA",
      "editorCursor.foreground": "#8B0000",
      "editor.lineHighlightBackground": "#0000FF20",
      "editorLineNumber.foreground": "#008800",
      "editor.selectionBackground": "#88000030",
      "editor.inactiveSelectionBackground": "#88000015"
    }
  });
  //monaco.editor.setTheme("myTheme");
  const loadEditor = current => {
    const container = document.getElementById("editor");
    container.innerHTML = "";
    const editor =
      current ||
      monaco.editor.create(container, {
        ...defaultOptions,
        ...options,
        value: undefined
      });

    if (options.value) {
      editor.getModel().dispose();
      const model = monaco.editor.createModel(
        options.value,
        undefined, // language
        monaco.Uri.file(options.filename) // uri
      );

      editor.setModel(model);
      editor.getModel().onDidChangeContent(event => {
        const newValue = editor.getModel().getValue();
        const hasChanged = newValue !== options.value;
        if (hasChanged) {
          if (!dirty) {
            setDirty(true);
          }
          editor.focus();
        }
      });
      setEditor(editor);
      setLanguage(model.getLanguageId());
    }
  };
  useEffect(() => {
    if (!editor) {
      loadEditor();
      window.addEventListener("resize", () => loadEditor());
    } else {
      if (!editor.getModel().uri.path.match(options.filename)) {
        loadEditor(editor);
      }
    }
  });
  ipcRenderer.on("save-file", (event, arg) => {
    if (editor && dirty) {
      const model = editor.getModel();
      const code = {
        filename: model.uri.path,
        content: model.getValue()
      };
      console.log("requesting to write file", code);
      ipcRenderer.send("write-code", code);
    }
  });

  return (
    <div style={containerStyle}>
      <div style={editorStyle} id="editor" />
    </div>
  );
}
