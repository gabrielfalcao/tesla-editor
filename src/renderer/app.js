import * as React from "react";
import * as ReactDOM from "react-dom";
import MainScreen from "@app/renderer/MainScreen";
import { EditorProvider } from "@app/renderer/Editor/Provider";
import { showError } from "@app/renderer/util";

function render() {
  const root = document.getElementById("app");

  try {
    ReactDOM.render(
      <EditorProvider>
        <MainScreen />
      </EditorProvider>,
      root
    );
  } catch (e) {
    showError(e);
  }
}

render();
