import React, { useContext, createContext, useState } from "react";
import { ipcRenderer } from "electron";
import { loadCodeForMonaco, writeFile } from "@app/renderer/fileSystem";
import * as monaco from "monaco-editor";

export const EditorContext = createContext();

export const defaultCode = {
  filename: undefined,
  content: undefined,
  language: undefined
};

export function EditorProvider({ children }) {
  const editor = useEditorProvider();
  const { setCode, setDirty, instance, dirty } = editor;
  ipcRenderer.on("file-loaded", (_, code) => {
    console.warn(code);
    setCode(code);
  });
  ipcRenderer.on("file-written", () => {
    setDirty(false);
  });
  ipcRenderer.on("save-file", () => {
    if (instance && dirty) {
      const model = instance.getModel();
      const code = {
        filename: model.uri.path,
        content: model.getValue()
      };
      console.log("requesting to write file", code);
      ipcRenderer.send("write-code", code);
    }
  });

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
    const model = loadCodeForMonaco();
    instance.getModel().dispose();
    instance.setModel(model);
    setCode(model.getValue());
    setLanguage(model.getLanguageId());
    setDirty(false);
    return model;
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

    openFile
  };
}
