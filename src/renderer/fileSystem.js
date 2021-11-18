import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as monaco from "monaco-editor";

export function resolveHome(filepath) {
  if (filepath[0] === "~") {
    return path.join(os.homedir(), filepath.slice(1));
  }
  return path.resolve(filepath);
}

export function writeFile(filename, content) {
  fs.writeFileSync(resolveHome(filename), content);
}

export function readFile(filename) {
  return fs.readFileSync(resolveHome(filename), "utf-8");
}

// @param {string} filename
// @return {monaco.Model}
export function loadCodeForMonaco(filename, language) {
  const content = readFile(filename);
  const model = monaco.editor.createModel(
    content,
    language, // detect language when `undefined`
    monaco.Uri.file(filename) // uri
  );
  return model;
}

export const collapseHome = (t) => t.replace(os.homedir(), "~");
