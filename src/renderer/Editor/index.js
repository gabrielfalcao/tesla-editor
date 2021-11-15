import React, { useEffect } from "react";
import { styled } from "pretty-lights";
import * as monaco from "monaco-editor";
import { useEditor } from "@app/renderer/Editor/Provider";
import { createEditor } from "./create";

const MonacoContainer = styled.div`
  position: relative;
  height: ${() => window.innerHeight - 48}px;
`;

export default function Editor({ ...options }) {
  const context = useEditor();
  const { setInstance, instance } = context;

  useEffect(() => {
    if (!instance) {
      setInstance(
        createEditor(document.getElementById("monaco-parent"), options, context)
      );
    }
  });

  return <MonacoContainer id="monaco-parent" />;
}
