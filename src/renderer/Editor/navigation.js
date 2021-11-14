import * as monaco from "monaco-editor";
const { KeyMod, KeyCode } = monaco;

export function getPreviousWordPosition(editor) {
  const model = editor.getModel();
  const position = editor.getPosition();
  const { column, lineNumber } = position;
  const range = {
    endLineNumber: lineNumber,
    startLineNumber: lineNumber,
    startColumn: column - 1,
    endColumn: column
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
    endColumn: column + 1
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
    endColumn: column
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
    endColumn: column + 1
  };
  while (/^\w+$/.test(model.getValueInRange(range))) {
    range.endColumn += 1;
    if (range.endColumn >= model.getLineLength(lineNumber)) {
      break;
    }
  }
  return { lineNumber: range.endLineNumber, column: range.endColumn + 1 };
}

export function setupEmacsNavigation(editor) {
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
