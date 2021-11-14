import React, { useEffect } from "react";
import { styled } from "pretty-lights";
import * as monaco from "monaco-editor";
import { useEditor } from "@app/renderer/Editor/Provider";
import { createEditor } from "./create";

const MonacoContainer = styled.div`
  position: relative;
`;

export default function Editor(options = defaultOptions) {
  const { setInstance, instance } = useEditor();

  useEffect(() => {
    if (!instance) {
      setInstance(
        createEditor(document.getElementById("monaco-parent"), options)
      );
    }
  });

  return (
    <MonacoContainer
      style={{ height: `${window.innerHeight - 48}px` }}
      id="monaco-parent"
    />
  );
}
