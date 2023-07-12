import React, { Fragment, useContext, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "./NavBar.css";
import AuthContext from "../../../context/auth/AuthContext";
import AlertContext from "../../../context/alert/AlertContext";

const NavBar = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { isAuthenticated, logout, user } = authContext;
  const { clearAlerts } = alertContext;

  const onLogout = () => {
    logout();
    clearAlerts();
  };

  useEffect(() => {
    console.log("NavBar is calling loadUser()");
    authContext.loadUser();
    // eslint-disable-next-line
  }, []);

  const authLinks = (
    <Fragment>
      <Nav.Link href="/profile">
        <Button variant="light">Profile</Button>
      </Nav.Link>
      <Nav.Link href="#!" onClick={onLogout}>
        <Button variant="light">
          <i className="fas fa-sign-out-alt"></i> Logout
        </Button>
      </Nav.Link>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <Nav.Link href="/register">
        <Button variant="light">Register</Button>
      </Nav.Link>
      <Nav.Link href="/login">
        <Button variant="light">Login</Button>
      </Nav.Link>
    </Fragment>
  );

  return (
    <Fragment>
      <Navbar className="navbar-translucent">
        <Container>
          <Navbar.Brand className="travel-safety">
            {" "}
            <i className="fa-solid fa-suitcase"></i> TravelSafety
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/" className="home-link">
                Home
              </Nav.Link>
            </Nav>
            <Nav className="justify-content-end">
              {isAuthenticated ? authLinks : guestLinks}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Fragment>
  );
};

export default NavBar;
