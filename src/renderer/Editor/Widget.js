import React from "react";
import ReactDOM from "react-dom";
import * as monaco from "monaco-editor";
import * as path from "path";
import * as fs from "fs";
import { styled, css } from "pretty-lights";
import { resolveHome, collapseHome } from "@app/renderer/fileSystem";
import { useEditor } from "@app/renderer/Editor/Provider";
import {
  hideCommandLine,
  showCommandLine,
  hideCompletion,
  showCompletion
} from "@app/renderer/Editor/commands";

function getParentHeight() {
  return Number.parseInt(window.innerHeight);
}
function getParentWidth() {
  return Number.parseInt(window.innerWidth);
}
const INTERNAL_COMMANDS = ["find-file", "save-buffer", "revert-buffer"];
const containerStyle = css`
  height: 28px;
  overflow: hidden;
  position: absolute;
  top: ${() => getParentHeight() - 86}px;
  width: ${() => getParentWidth()}px;
  z-index: 10;
`;
const Completion = styled.div`
  position: absolute;
  height: 24px;
  background: #111;
  font-family: Monaco, monospace;
  font-size: 14px;
  color: #666;
  top: ${() => getParentHeight() - 86 - 24}px;
  width: ${() => getParentWidth()}px;
  z-index: 1000;
  visibility: hidden;
`;

const CommandLine = styled.input`
  height: 28px;
  overflow: visible;
  position: absolute;
  top: ${() => getParentHeight() - 86}px;
  width: ${() => getParentWidth()}px;
  z-index: 100;
  background: #333;
  border: none;
  color: #efe;
  font-family: Monaco, monospace;
  font-size: 16px;
  ::placeholder {
    color: #676;
  }
  visibility: hidden;
  outline: none;

  :focus {
    outline: none !important;
    border: none;
    box-shadow: rgba(255, 255, 255, 0.1) 0px 4px 12px;
  }
`;

export function loadPathFromCommandLine() {
  const inputElement = document.getElementById("command-line");
  const commandType = inputElement.getAttribute("data-type");

  const text = inputElement.value;
  const target = resolveHome(text);
  let directory = path.dirname(target);
  let filename = path.basename(target);
  let stat = null;
  let exists = false;
  if (!fs.existsSync(target)) {
    directory = path.dirname(target);
  } else {
    stat = fs.lstatSync(target);
    if (stat.isFile()) {
      exists = true;
      directory = path.dirname(target);
    } else if (stat.isDirectory()) {
      directory = target;
      filename = "";
    }
  }

  return {
    text,
    target,
    exists,
    directory,
    filename,
    stat,
    inputElement,
    commandType
  };
}
export function executeInternalCommand(context, editor) {
  const { saveFile, openFile, code } = context;
  const inputElement = document.getElementById("command-line");
  const [command, ...args] = `${inputElement.value}`.split();
  console.log("internal command", { command, args });
  switch (command) {
    case "save":
    case "save-file":
      saveFile(code.filename, editor);
      return hideCommandLine();
    case "open":
    case "open-file":
      openFile(args[0], editor);
      return hideCommandLine();

    default:
      if (command.length > 0) {
        showCompletion(
          [`The command "${command}" is not implemented yet`],
          true
        );
      } else {
        showCompletion([`empty command`], true);
      }
      break;
  }
  setTimeout(() => hideCompletion(), Math.PI * 1000);
}
export function doOpenFile({ openFile }, editor) {
  const loaded = loadPathFromCommandLine();
  const { target } = loaded;
  if (fs.existsSync(target)) {
    hideCompletion();
    hideCommandLine();
    openFile(target, editor);
  } else {
    showCompletion([`path does not exist: ${collapseHome(target)}`], true);
  }
}
export function autoComplete(e) {
  const completionElement = document.getElementById("command-line-completion");

  const {
    stat,
    target,
    directory,
    filename,
    inputElement,
    commandType
  } = loadPathFromCommandLine();
  let choices = [];
  if (commandType === "path") {
    if (fs.existsSync(directory)) {
      choices = fs
        .readdirSync(directory)
        .filter(f => f.startsWith(filename) && f !== filename);
    } else if (stat.isDirectory()) {
      choices = fs.readdirSync(target);
    } else if (filename.length === 0) {
      choices = fs.readdirSync(directory);
    }
    console.log({ choices, filename, target, directory });

    if (choices.length === 1) {
      hideCompletion();
      showCommandLine(collapseHome(path.join(directory, choices[0])), "path");
    } else if (choices.length > 1) {
      showCompletion(choices);
    } else {
      hideCompletion();
    }
  } else {
    choices = INTERNAL_COMMANDS.filter(
      cmd => cmd.indexOf(inputElement.value) !== -1
    );
    showCompletion(choices);
  }
}
export function Widget({ editor, ...props }) {
  function onKeyDown(e) {
    const context = props?.context?.instance
      ? props.context
      : editor.teslaContext;
    const inputElement = document.getElementById("command-line");
    const commandType = inputElement.getAttribute("data-type");
    switch (e.keyCode) {
      case 8: // Backspace
        hideCompletion();
        return true;
      case 9: // Tab
        autoComplete(e);
        e.preventDefault();
        return false;
      case 27: // Escape
        hideCommandLine();
        hideCompletion();
        document.querySelector(".monaco-editor textarea").focus();
        e.preventDefault();
        return false;
      case 13: // Enter
        if (commandType === "path") {
          doOpenFile(context, editor);
        } else {
          executeInternalCommand(context, editor);
        }
        e.preventDefault();
        return false;
      default:
        break;
    }
  }
  return (
    <div id="command-line-widget" css={containerStyle}>
      <Completion id="command-line-completion" />
      <CommandLine id="command-line" type="text" onKeyDown={onKeyDown} />
    </div>
  );
}

export function createWidget(context, editor) {
  const element = document.createElement("div");
  ReactDOM.render(<Widget context={context} editor={editor} />, element);
  window.addEventListener(
    "resize",
    // see: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IEditor.html#layout
    () => {
      ReactDOM.render(<Widget context={context} editor={editor} />, element);
    }
  );

  return element;
}

export function createOverlayWidget(context, editor) {
  const element = createWidget(context, editor);
  return {
    getDomNode() {
      //const element = document.getElementById("command-line-widget");
      return element;
    },
    getId() {
      return "command-line";
    },
    getPosition() {
      return null;
    }
  };
}
