import React, { useContext, createContext, useState } from "react";
import { ipcRenderer } from "electron";

import { loadCodeForMonaco, writeFile } from "@app/renderer/fileSystem";

export const EditorContext = createContext();

export const defaultCode = {
  filename: undefined,
  content: undefined,
  language: undefined,
};

export function EditorProvider({ children }) {
  const editor = useEditorProvider();
  return (
    <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>
  );
}

export function useEditor() {
  return useContext(EditorContext);
}

export function useEditorProvider() {
  const [language, setLanguage] = useState(undefined);
  const [dirty, setDirty] = useState(false);
  const [code, setCode] = useState(defaultCode);
  const [instance, setInstance] = useState(null);

  function openFile(filename) {
    instance.getModel().dispose();
    const model = loadCodeForMonaco(filename);
    const detectedLanguage = model.getLanguageId();

    instance.setModel(model);
    setCode(model.getValue());
    setDirty(false);
    setLanguage(detectedLanguage);

    model.onDidChangeContent(() => {
      const newValue = model.getValue();
      const hasChanged = newValue !== code;
      if (hasChanged) {
        if (!dirty) {
          setDirty(true);
          instance.focus();
        }
      }
    });
    console.log("openFile", { filename, detectedLanguage });

    return model;
  }
  if (instance) {
    ipcRenderer.on("open-file", (_, filename) => {
      openFile(filename);
    });
    ipcRenderer.on("save-file", () => {
      writeFile(code.filename, instance.getModel().getValue());
    });
  }
  function updateOptions(opts) {
    const options = opts || {};
    instance.updateOptions(options);

    console.log("updateOptions", options);
    if ("language" in options) {
      setLanguage(options.language);
    }
    // TODO: do I need to redraw the editor in case font size changes?
    instance.layout();
  }
  return {
    code,
    setCode,

    dirty,
    setDirty,

    language,
    setLanguage,

    instance,
    setInstance,

    openFile,
    updateOptions,
  };
}
