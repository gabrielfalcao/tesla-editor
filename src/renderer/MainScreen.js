import React from "react";
import TopBar from "@app/renderer/TopBar";
import Editor from "@app/renderer/Editor";
import { EditorProvider } from "@app/renderer/EditorProvider";

export default function MainScreen() {
  return (
    <EditorProvider>
      <TopBar />
      <Editor />
    </EditorProvider>
  );
}
