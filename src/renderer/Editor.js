import React, { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";

/* theme="vs-dark"
 * height={400}
 * language={"shell"}
 * value={code.content || "#!/usr/bin/env bash\n"}
 *  */

const editorStyle = {
  minWidth: "100%",
  height: "100%",
  position: "absolute"
};
const containerStyle = {
  position: "absolute"
};
export const defaultOptions = {
  theme: "vs-dark",
  height: "100%",
  fontSize: "18px",
  width: "100%",
  value: undefined
};
export default function Editor(options = defaultOptions) {
  const element = useRef(null);
  const [editor, setEditor] = useState(null);
  const [language, setLanguage] = useState(options.language);
  const [value, setValue] = useState(null);

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
  monaco.editor.setTheme("myTheme");
  const loadEditor = params => {
    const editor = document.getElementById("main-editor");
    editor.innerHTML = "";
    monaco.editor.create(editor, {
      ...params
    });
  };
  useEffect(
    () => {
      if (value !== options.value) {
        loadEditor({
          ...defaultOptions,
          ...options
        });
        setValue(options.value);
      }
      if (language !== options.language) {
        setLanguage(options.language);
        loadEditor({
          ...defaultOptions,
          ...options
        });
      } else {
        console.log({ language, value });
      }
    },
    [defaultOptions, options]
  );
  /* useEffect(
   *   () => {
   *     if (editor && value) {
   *     }
   *   },
   *   [editor, value]
   * ); */

  return <div style={editorStyle} id="main-editor" />;
}
