import * as React from "react";
import * as ReactDOM from "react-dom";
import MainScreen from "./MainScreen";
import { showError } from "./util";

function render() {
  const root = document.getElementById("app");

  try {
    ReactDOM.render(<MainScreen />, root);
  } catch (e) {
    showError(e);
  }
}

render();
