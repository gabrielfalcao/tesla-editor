import * as monaco from "monaco-editor";
import * as os from "os";
import { collapseHome } from "@app/renderer/fileSystem";

export function openFileCommand(editor) {
  console.log("C-x C-f");
  const filename = document.getElementById("filename").innerHTML || "";
  console.log({ filename });
  if (filename.length > 0) {
    showCommandLine(collapseHome(filename), "open-file");
  } else {
    showCommandLine("~/", "open-file");
  }
}
export function openEmacsCommand(editor) {
  console.log("M-x");
  const cmdline = showCommandLine("", "command");
  cmdline.placeholder = "type command...";
}
export function goToBufferStart(editor) {
  editor.setPosition({ lineNumber: 0, column: 0 });
}
export function goToBufferEnd(editor) {
  const model = editor.getModel();
  const lineNumber = model.getLineCount();
  const column = model.getLineLength(lineNumber);
  editor.setPosition({ lineNumber, column: column + 1 });
}

export function hideCompletion() {
  const completionElement = document.getElementById("command-line-completion");
  completionElement.style.visibility = "hidden";
  completionElement.innerHTML = "";
  return completionElement;
}
export function showCompletion(choices, isError = false) {
  const completionElement = document.getElementById("command-line-completion");
  const maxLength = Number.parseInt(completionElement.style.width || 80);
  console.log({ maxLength });
  completionElement.style.visibility = "visible";
  completionElement.innerHTML = choices
    ?.join(", ")
    .substring(0, maxLength * 1.8);

  completionElement.style.backgroundColor = "#111";
  completionElement.style.color = "#666";

  if (isError) {
    completionElement.style.backgroundColor = "#d00";
    completionElement.style.color = "#fff";
  }
  return completionElement;
}
export function hideCommandLine() {
  hideCompletion();
  const cmdline = document.getElementById("command-line");
  cmdline.style.visibility = "hidden";
  cmdline.value = "";
  return cmdline;
}
export function showCommandLine(value, commandType) {
  const cmdline = document.getElementById("command-line");
  cmdline.setAttribute("data-type", commandType);
  cmdline.style.visibility = "visible";
  cmdline.value = value;
  cmdline.focus();
  return cmdline;
}
