import React, { Fragment, useContext, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import AuthContext from "../../../context/auth/AuthContext";
import AlertContext from "../../../context/alert/AlertContext";
import { Typography, Box, Breadcrumbs, Link } from "@mui/joy";
import customTheme from "../../theme";
import { CssVarsProvider } from "@mui/joy/styles";

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
      <Breadcrumbs separator="—" aria-label="breadcrumbs" size="sm">
        <Link
          href="/profile"
          underline="hover"
          color="neutral"
          fontSize="inherit"
        >
          Profile
        </Link>
        <Link
          href="#!"
          onClick={onLogout}
          underline="hover"
          color="neutral"
          fontSize="inherit"
        >
          Logout
        </Link>
      </Breadcrumbs>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <Breadcrumbs separator="—" aria-label="breadcrumbs" size="sm">
        <Link
          href="/register"
          underline="hover"
          color="neutral"
          fontSize="inherit"
        >
          Sign up
        </Link>
        <Link
          href="/login"
          underline="hover"
          color="neutral"
          fontSize="inherit"
        >
          Log in
        </Link>
      </Breadcrumbs>
    </Fragment>
  );

  return (
    <CssVarsProvider
      defaultMode="light"
      disableTransitionOnChange
      theme={customTheme}
    >
      <Fragment>
        <Navbar className="navbar-translucent" expand="lg">
          <Container>
            <Navbar.Brand href="/" className="travel-safety-logo">
              <Typography
                fontWeight="lg"
                startDecorator={
                  <Box
                    component="span"
                    sx={{
                      width: 24,
                      height: 24,
                      background: (theme) =>
                        `linear-gradient(45deg, ${theme.vars.palette.primary.solidBg}, ${theme.vars.palette.primary.solidBg} 30%, ${theme.vars.palette.primary.softBg})`,
                      borderRadius: "50%",
                      boxShadow: (theme) => theme.shadow.md,
                      "--joy-shadowChannel": (theme) =>
                        theme.vars.palette.primary.mainChannel,
                    }}
                  />
                }
              >
                Safe Traveler
              </Typography>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                {isAuthenticated ? authLinks : guestLinks}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Fragment>
    </CssVarsProvider>
  );
};

export default NavBar;
