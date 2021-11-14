import * as React from "react";
import * as ReactDOM from "react-dom";
import MainScreen from "./MainScreen";
import { EditorProvider } from "./EditorProvider";
import { showError } from "./util";

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
