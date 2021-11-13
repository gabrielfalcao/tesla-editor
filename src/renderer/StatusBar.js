import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

const statusBarStyle = {
  height: "32px",
  fontSize: "12px",
  padding: "1px",
  margin: "0px",
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
