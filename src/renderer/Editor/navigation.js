import * as monaco from "monaco-editor";
import * as os from "os";
const { KeyMod, KeyCode } = monaco;
import {
  openEmacsCommand,
  openFileCommand,
  goToBufferStart,
  goToBufferEnd,
  hideCompletion,
  hideCommandLine,
} from "@app/renderer/Editor/commands";

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
const selection = {
  active: false,
  range: {
    endLineNumber: 0,
    startLineNumber: 0,
    startColumn: 0,
    endColumn: 0,
  },
};
export function setupEmacsNavigation(context, editor) {
  const { saveFile, filename, openFile } = context;
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
  editor.addCommand(KeyMod.Alt | KeyMod.Shift | KeyCode.Comma, () => {
    goToBufferStart(editor);
  });
  editor.addCommand(KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Comma, () => {
    goToBufferStart(editor);
  });
  editor.addCommand(KeyMod.Alt | KeyMod.Shift | KeyCode.Period, () => {
    goToBufferEnd(editor);
  });
  editor.addCommand(KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Period, () => {
    goToBufferEnd(editor);
  });
  editor.addCommand(KeyMod.CtrlCmd | KeyCode.Space, () => {
    console.log("set selection");
    const position = editor.getPosition();
    selection.active = true;
    selection.range.startLineNumber = position.lineNumber;
    selection.range.endLineNumber = position.lineNumber;
    selection.range.startColumn = position.column;
    selection.range.endColumn = position.column;
    console.log(selection.range);
    editor.selection(selection.range);
  });

  editor.addCommand(KeyMod.WinCtrl | KeyCode.Space, () => {
    console.log("set selection");
    const position = editor.getPosition();
    selection.active = true;
    selection.range.startLineNumber = position.lineNumber;
    selection.range.endLineNumber = position.lineNumber;
    selection.range.startColumn = position.column;
    selection.range.endColumn = position.column;
    console.log(selection.range);
    editor.selection(selection.range);
  });
  editor.addCommand(KeyMod.WinCtrl | KeyCode.KeyG, () => {
    console.log("interrupt");
    hideCompletion();
    hideCommandLine();
  });
  editor.addCommand(KeyMod.WinCtrl | KeyCode.KeyS, () => {
    console.log("find box");
    editor.getAction("actions.find").run("");
  });
  editor.addCommand(
    monaco.KeyMod.chord(
      monaco.KeyMod.WinCtrl | monaco.KeyCode.KeyX,
      monaco.KeyMod.WinCtrl | monaco.KeyCode.KeyF
    ),
    () => openFileCommand(editor)
  );
  editor.addCommand(
    KeyMod.chord(KeyMod.WinCtrl | KeyCode.KeyC, KeyCode.KeyU),
    () => {
      console.log("uncomment line");
      editor.getAction("editor.action.removeCommentLine").run("");
    }
  );
  editor.addCommand(KeyMod.WinCtrl | KeyMod.Shift | KeyCode.Digit3, () => {
    console.log("comment line");
    editor.getAction("editor.action.commentLine").run("");
  });
  editor.addCommand(KeyMod.WinCtrl | KeyMod.Shift | KeyCode.KeyR, () => {
    console.log("run command");
    editor.getAction("editor.action.quickCommand").run("");
  });
  editor.addCommand(KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyR, () => {
    console.log("run command");
    editor.getAction("editor.action.quickCommand").run("");
  });
  editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyR, () => {
    console.log("run command");
    editor.getAction("editor.action.quickCommand").run("");
  });
  editor.addCommand(
    KeyMod.chord(KeyMod.WinCtrl | KeyCode.KeyX, KeyMod.WinCtrl | KeyCode.KeyS),
    () => {
      console.log("save file C-x C-s");
      saveFile();
    }
  );
  editor.addCommand(
    KeyMod.chord(KeyMod.WinCtrl | KeyCode.KeyX, KeyCode.KeyK),
    () => {
      console.log("kill-buffer");
      openFile(filename);
    }
  );
  editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyS, () => {
    console.log("save file Cmd+S");
    saveFile();
  });

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX, () =>
    openEmacsCommand(editor)
  );
  editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyX, () =>
    openEmacsCommand(editor)
  );
  return editor;
}
