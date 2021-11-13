import React, { useState } from "react";
import { ipcRenderer } from "electron";
//import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SplitPane from "react-split-pane";
import ReactMarkdown from "react-markdown";

import TopBar from "./TopBar";
import Editor from "./Editor";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./MainScreen.css";

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
  ipcRenderer.once("file-written", () => {
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
      <SplitPane>
        <Editor
          setLanguage={setLanguage}
          filename={code.filename}
          language={language}
          value={code.content}
          dirty={dirty}
          setDirty={setDirty}
        />
        <ReactMarkdown className="result" source={code.content} />
      </SplitPane>
    </>
  );
}
