import React, { useEffect } from "react";
import { styled } from "pretty-lights";
import * as monaco from "monaco-editor";
import { useEditor } from "@app/renderer/Editor/Provider";
import { createEditor } from "./create";
import { Widget } from "./Widget";

const MonacoContainer = styled.div`
  position: relative;
  height: ${() => window.innerHeight - 48}px;
`;

export default function Editor({ ...options }) {
  const context = useEditor();
  const { setInstance, instance } = context;
  Object.defineProperty(window, "editorContext", {
    value: context,
    writable: true,
  });
  Object.defineProperty(window, "editorInstance", {
    value: instance,
    writable: true,
  });

  window.editorContext = context;
  useEffect(() => {
    if (!instance) {
      setInstance(
        createEditor(document.getElementById("monaco-parent"), options, context)
      );
    }
  });

  return (
    <>
      {/* <Widget context={context} editor={context?.instance} /> */}
      <MonacoContainer id="monaco-parent" />
    </>
  );
}
