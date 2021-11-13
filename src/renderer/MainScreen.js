import * as path from "path";
import React, { useEffect, useRef, useState } from "react";
import { ipcRenderer } from "electron";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import TopBar from "./TopBar";
import Editor from "./Editor";

const defaultCode = {
  filename: undefined,
  content: undefined,
  language: undefined,
};

export default function MainScreen() {
  const [language, setLanguage] = useState("shell");
  const [dirty, setDirty] = useState(false);

  const [code, setCode] = useState(defaultCode);
  ipcRenderer.once("file-loaded", (_, arg) => {
    setCode(arg);
  });
  ipcRenderer.once("file-written", (_, arg) => {
    setDirty(false);
  });

  return (
    <>
      <TopBar
        filename={code.filename}
        language={language}
        setLanguage={setLanguage}
        dirty={dirty}
      />
      <Editor
        setLanguage={setLanguage}
        filename={code.filename}
        language={language}
        value={code.content}
        dirty={dirty}
        setDirty={setDirty}
      />
    </>
  );
}
