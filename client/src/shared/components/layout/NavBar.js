import React from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./NavBar.css";

const NavBar = () => {
  return (
    <div>
      <Navbar className="navbar-translucent" expand="lg">
        <Container>
          <Navbar.Brand href="/" className="travel-safety-logo">
            <span className="logo-circle">
              <i className="fas fa-suitcase"></i>
            </span>
            <span className="logo-text">SafeTraveler</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href="/profile" className="nav-link">
                Profile
              </Nav.Link>
              <Nav.Link href="/register" className="nav-link">
                Register
              </Nav.Link>
              <Nav.Link href="/login" className="nav-link">
                Login
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;

