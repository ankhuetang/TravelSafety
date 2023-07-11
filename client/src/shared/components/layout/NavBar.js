// TODO: Color styling for the buttons
// CHANGE THIS!!!

import React from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "./NavBar.css";

const NavBar = () => {
  return (
    <div>
      <Navbar className="navbar-translucent">
        <Container>
          <Navbar.Brand className="travel-safety">
            {" "}
            <i class="fa-solid fa-suitcase"></i> TravelSafety
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/" className="home-link">
                Home
              </Nav.Link>
            </Nav>
            <Nav className="justify-content-end">
              <Nav.Link href="/profile">
                <Button variant="light">Profile</Button>
              </Nav.Link>
              <Nav.Link href="/register">
                <Button variant="light">Register</Button>
              </Nav.Link>
              <Nav.Link href="/login">
                <Button variant="light">Login</Button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
