import React from "react";
import { css } from "@emotion/react";

const baseStyles = css`
  margin: 0;
  font-size: 18px;
  color: red;
  background-color: mistyrose;
  padding: 1rem;
`;

const Message = css`
  ${baseStyles};
`;

const Title = css`
  ${baseStyles};
  font-size: 24px;
  text-align: center;
  color: #333;
`;

const Stack = css`
  ${baseStyles};
  margin: 2rem 4rem;
  background: #bbb;
  border: 2px solid #333;
  color: #000;
  font-size: 14px;
  overflow: auto;
`;

export function Error(error) {
  return (
    <>
      <pre css={Title}>Application Error</pre>
      <pre css={Message}>{error.message}</pre>
      <pre css={Stack}>{error.stack}</pre>
    </>
  );
}

export function errorElement(message, style = "", tag = "pre") {
  const element = document.createElement(tag);
  element.appendChild(document.createTextNode(message));
  element.style.cssText = `font-family: Monaco, monospace;margin:0;font-size: 18px; color: red; background-color: mistyrose;padding: 1rem; ${style}`;
  return element;
}

export function showError(e) {
  const root = document.getElementById("app");
  root.innerHTML = "";
  root.appendChild(
    errorElement(
      `Application Error`,
      "font-size:24px;text-align:center;color:#333;"
    )
  );
  root.appendChild(errorElement(`Error: ${e.stack}`));
}
