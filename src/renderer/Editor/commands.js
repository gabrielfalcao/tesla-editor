import * as monaco from "monaco-editor";
import * as os from "os";
import { collapseHome } from "@app/renderer/fileSystem";

export function openFileCommand(editor) {
  console.log("C-x C-f");
  const model = editor.getModel();
  const cmdline = document.getElementById("command-line");

  const filename = document.getElementById("filename").innerHTML || "";
  console.log({ filename });
  if (filename.length > 0) {
    cmdline.value = collapseHome(filename);
  } else {
    cmdline.value = "~/";
  }
  cmdline.style.visibility = "visible";
  cmdline.focus();
}
export function openEmacsCommand(editor) {
  console.log("M-x");
  const model = editor.getModel();
  const cmdline = document.getElementById("command-line");
  cmdline.style.visibility = "visible";
  cmdline.placeholder = "type command...";
  cmdline.focus();
}

export function hideCompletion() {
  const completionElement = document.getElementById("command-line-completion");
  completionElement.style.visibility = "hidden";
  completionElement.innerHTML = "";
  return completionElement;
}
export function showCompletion(choices) {
  const completionElement = document.getElementById("command-line-completion");
  const maxLength = Number.parseInt(completionElement.style.width || 80);
  console.log({ maxLength });
  completionElement.style.visibility = "visible";
  completionElement.innerHTML = choices
    .join(", ")
    .substring(0, maxLength * 1.8);

  return completionElement;
}
export function hideCommandLine() {
  const cmdline = document.getElementById("command-line");
  cmdline.style.visibility = "hidden";
  cmdline.value = "";
  return cmdline;
}
export function showCommandLine(value) {
  const cmdline = document.getElementById("command-line");
  cmdline.style.visibility = "visible";
  cmdline.value = value;
  return cmdline;
}
