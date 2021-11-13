import * as path from "path";
import React, { useEffect, useRef, useState } from "react";
import { ipcRenderer } from "electron";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TopBar from "./TopBar";
import StatusBar from "./StatusBar";
import Editor from "./Editor";

//import { remote } from "electron";
//const { BrowserWindow, dialog, Menu } = remote;
const defaultCode = {
  filename: undefined,
  content: undefined,
  language: undefined
};

export default function MainScreen() {
  const [language, setLanguage] = useState("shell");
  const [dirty, setDirty] = useState(false);

  /* useEffect(() => {
   *     if (monaco) {
   *         console.log("here is the monaco instance:", monaco);
   *     }
   * }, [monaco]);
   */
  const [code, setCode] = useState(defaultCode);
  ipcRenderer.on("file-loaded", (_, arg) => {
    setCode(arg);
  });
  ipcRenderer.on("file-written", (_, arg) => {
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
