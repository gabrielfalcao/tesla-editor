import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ipcRenderer } from "electron";

const dropdownStyle = {
  border: "none",
  background: "#333",
  appearance: "none",
  color: "white",
  position: "absolute",
  right: "0",
  margin: "0.5rem 2rem 0 0"
};
const knownFiles = [
  "~/.bashrc",
  "~/.bash_history",
  "~/.gitconfig",
  "~/.npmrc",
  "~/.vimrc",
  "~/.emacs.d/init.el",
  "~/.pypirc",
  "~/.yarnrc",
  "~/.ackrc",
  "~/.docker/config.json"
];
const languages = [
  "json",
  "javascript",
  "typescript",
  "shell",
  "ini",
  "python",
  "rust",
  "ruby",
  "markdown"
];
export default function TopBar({ filename, language, setLanguage }) {
  return (
    <Navbar bg="dark" variant="dark" expand="sm" fixed="top">
      <Container fluid>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <NavDropdown title="menu">
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
                defaultValue={language}
                onChange={event => {
                  const lang = event.target.value;
                  console.warn({ lang });
                  setLanguage(lang);
                }}
              >
                {languages.map(value => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </Nav.Item>
          </Nav>
          {filename ? <Navbar.Brand>{filename}</Navbar.Brand> : null}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
