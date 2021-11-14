import React, { useEffect } from "react";
import { styled } from "pretty-lights";
import * as monaco from "monaco-editor";

import { useEditor } from "@app/renderer/EditorProvider";
const { KeyMod, KeyCode } = monaco;
export const defaultOptions = {
  theme: "vs-dark",
  height: "100%",
  fontSize: "18px",
  scrollBeyondLastLine: false,
  width: "100%",
};
export function getPreviousWordPosition(editor) {
  const model = editor.getModel();
  const position = editor.getPosition();
  const { column, lineNumber } = position;
  const range = {
    endLineNumber: lineNumber,
    startLineNumber: lineNumber,
    startColumn: column - 1,
    endColumn: column,
  };
  if (range.startColumn <= 0) {
    if (lineNumber > 0) {
      return { lineNumber: lineNumber - 1, column: 0 };
    }
  }
  while (/^\w+$/.test(model.getValueInRange(range))) {
    range.startColumn -= 1;
    if (range.startColumn <= 0) {
      break;
    }
  }
  return { lineNumber: range.startLineNumber, column: range.startColumn };
}
export function getNextWordPosition(editor) {
  const model = editor.getModel();
  const position = editor.getPosition();
  const { column, lineNumber } = position;
  const range = {
    endLineNumber: lineNumber,
    startLineNumber: lineNumber,
    startColumn: column,
    endColumn: column + 1,
  };
  const lineLength = model.getLineLength(lineNumber);
  if (column - 1 === lineLength) {
    if (lineNumber < model.getLineCount()) {
      return { lineNumber: lineNumber + 1, column: 0 };
    }
  }

  while (/^\w+$/.test(model.getValueInRange(range))) {
    range.endColumn += 1;
    if (range.endColumn > model.getLineLength(lineNumber)) {
      break;
    }
  }

  return { lineNumber: range.endLineNumber, column: range.endColumn };
}
export function getPreviousCharacterPosition(editor) {
  const position = editor.getPosition();
  const { column, lineNumber } = position;
  const range = {
    endLineNumber: lineNumber,
    startLineNumber: lineNumber,
    startColumn: column - 1,
    endColumn: column,
  };
  if (range.startColumn < 0) {
    if (lineNumber > 1) {
      return { lineNumber: lineNumber - 1, column: 0 };
    }
  }
  return { lineNumber: range.startLineNumber, column: range.startColumn };
}
export function getNextCharacterPosition(editor) {
  const model = editor.getModel();
  const position = editor.getPosition();
  const { column, lineNumber } = position;
  const range = {
    endLineNumber: lineNumber,
    startLineNumber: lineNumber,
    startColumn: column,
    endColumn: column + 1,
  };
  while (/^\w+$/.test(model.getValueInRange(range))) {
    range.endColumn += 1;
    if (range.endColumn >= model.getLineLength(lineNumber)) {
      break;
    }
  }
  return { lineNumber: range.endLineNumber, column: range.endColumn + 1 };
}

export function createEditor(parentElement, options) {
  const editor = monaco.editor.create(parentElement, {
    ...defaultOptions,
    ...options,
    language: undefined,
    value: "",
  });
  console.log({
    "KeyCode-Alt": KeyCode.Alt,
    "KeyMod-Alt": KeyMod.Alt,
  });

  window.addEventListener(
    "resize",
    // see: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IEditor.html#layout
    () => {
      parentElement.style.height = `${window.innerHeight - 48}px`;
      editor.layout();
    }
  );
  // Emacs Navigation Keybindings
  editor.addCommand(KeyMod.Alt | KeyCode.KeyB, () => {
    editor.setPosition(getPreviousWordPosition(editor));
  });
  editor.addCommand(KeyMod.Alt | KeyCode.KeyF, () => {
    editor.setPosition(getNextWordPosition(editor));
  });
  editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyB, () => {
    editor.setPosition(getPreviousCharacterPosition(editor));
  });
  editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyF, () => {
    editor.setPosition(getNextCharacterPosition(editor));
  });
  editor.addCommand(KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Comma, () => {
    editor.setPosition({ lineNumber: 0, column: 0 });
  });
  editor.addCommand(KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Period, () => {
    const model = editor.getModel();
    const lineNumber = model.getLineCount();
    const column = model.getLineLength(lineNumber);
    editor.setPosition({ lineNumber, column: column + 1 });
  });
  return editor;
}

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
