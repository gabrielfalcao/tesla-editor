import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ipcRenderer } from "electron";

const statusBarStyle = {
  height: "32px",
  fontSize: "12px",
  padding: "1px",
  margin: "0px"
};
export default function StatusBar({ filename }) {
  if (!filename) {
    return null;
  }
  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="sm"
      sticky="bottom"
      style={{ statusBarStyle }}
    >
      <Container fluid>
        <Navbar.Collapse id="basic-navbar-nav">
          <Navbar.Brand>{filename}</Navbar.Brand>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
