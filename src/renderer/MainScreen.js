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
  language: "shell"
};

export default function MainScreen() {
  const [language, setLanguage] = useState("shell");

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
  const MainEditor = () => (
    <Editor theme="vs-dark" language={language} value={code.content} />
  );
  return (
    <>
      <TopBar
        filename={code.filename}
        language={language}
        setLanguage={setLanguage}
      />
      <MainEditor />
    </>
  );
}
