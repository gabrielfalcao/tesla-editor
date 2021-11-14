import React from "react";

import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { ipcRenderer } from "electron";
//import { FileCode } from "react-bootstrap-icons";
import appIcon from "@app.png";
import { useEditor } from "@app/renderer/EditorProvider";
import { basicLanguages, knownFiles } from "@app/renderer/constants";

//green: "#d5ce6d"
const dropdownStyle = {
  border: "none",
  background: "#333",
  appearance: "none",
  color: "white",
  position: "absolute",
  right: "0",
  margin: "0.5rem 2rem 0 0"
};

export default function TopBar() {
  const { dirty, code, setLanguage, language } = useEditor();
  const { filename } = code;
  return (
    <Navbar bg="dark" variant="dark" expand="sm" fixed="top">
      <Container fluid>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <NavDropdown
              title={
                <>
                  <img src={appIcon} width="32" height="32" /> Tesla Editor
                </>
              }
            >
              {knownFiles.map(filename => (
                <NavDropdown.Item
                  key={filename}
                  onClick={() => {
                    ipcRenderer.send("read-file", filename);
                  }}
                >
                  {filename}
                </NavDropdown.Item>
              ))}
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={() => {
                  if (confirm("Are you sure you want to quit?")) {
                    ipcRenderer.send("quit");
                  }
                }}
              >
                Quit
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Item>
              <select
                style={dropdownStyle}
                value={language}
                onChange={event => {
                  const lang = event.target.value;
                  setLanguage(lang);
                }}
              >
                {basicLanguages.map(value => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </Nav.Item>
          </Nav>
          {filename ? (
            <Navbar.Brand
              style={{
                fontSize: "1rem",
                fontWeight: "normal",
                fontStyle: dirty ? "italic" : "normal",
                color: dirty ? "tan" : "#fff"
              }}
            >
              {dirty ? "*" : null}
              {filename}
            </Navbar.Brand>
          ) : null}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
