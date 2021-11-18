import React, { useEffect } from "react";
import * as os from "os";
import * as fs from "fs";

import { css, styled } from "pretty-lights";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import Spinner from "react-bootstrap/Spinner";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { ipcRenderer } from "electron";
//import { FileCode } from "react-bootstrap-icons";
import appIcon from "@app.png";
import { useEditor } from "@app/renderer/Editor/Provider";
import { basicLanguages } from "@app/renderer/constants";
import { collapseHome } from "@app/renderer/fileSystem";

const getKnownFiles = () => [];
/* fs
 *   .readdirSync(os.homedir())
 *   .map(collapseHome)
 *   .filter(file => fs.statsSync(file).isFile())
 *   .slice(0, 10); */
//green: "#d5ce6d"
const dropdownStyle = {
  border: "none",
  background: "#333",
  appearance: "none",
  color: "white",
  position: "absolute",
  right: "0",
  margin: "0.5rem 2rem 0 0",
};

const showDropDown = false;
const Select = styled.select`
  background-color: #272822;
`;
export default function TopBar() {
  const { dirty, code, updateOptions, language, openFile, instance } =
    useEditor();

  return (
    <Navbar
      style={{ backgroundColor: "#272822" }}
      bg="dark"
      variant="dark"
      expand="sm"
      sticky="top"
    >
      <Container fluid>
        <Navbar.Collapse>
          {instance ? (
            <Nav>
              {showDropDown ? (
                <NavDropdown
                  title={
                    <>
                      <img src={appIcon} width="16" height="16" /> Tesla Editor
                    </>
                  }
                >
                  {getKnownFiles().map((filename) => (
                    <NavDropdown.Item
                      key={filename}
                      onClick={() => {
                        openFile(filename);
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
              ) : (
                <Nav.Item style={{ color: "#ddd" }}>
                  Emacs Keybindings:
                  {"    "}
                  <span>
                    <strong>Ctrl+X Ctrl+F</strong>
                    {"    "}
                    open file
                  </span>
                  {"    "}
                  <span>
                    <strong>Meta+X</strong>
                    {`    run "emacs" command`}
                  </span>
                </Nav.Item>
              )}
              <Nav.Item>
                <Select
                  style={dropdownStyle}
                  value={language || "plaintext"}
                  onChange={(event) => {
                    console.log(`manual language change ${event.target.value}`);
                    updateOptions({ language: event.target.value });
                  }}
                >
                  {basicLanguages.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
              </Nav.Item>
            </Nav>
          ) : (
            <Nav>
              <Navbar.Brand>Loading</Navbar.Brand>
              <Nav.Item>
                <Spinner animation="grow" variant="info" />
              </Nav.Item>
            </Nav>
          )}
          <Navbar.Brand
            style={{
              fontSize: "1rem",
              fontWeight: "normal",
              fontStyle: dirty ? "italic" : "normal",
              color: dirty ? "tan" : "#fff",
            }}
          >
            {dirty ? "*" : null}
            <span id="filename">{code?.filename}</span>
          </Navbar.Brand>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
