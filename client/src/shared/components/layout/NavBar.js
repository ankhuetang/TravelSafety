// TODO: Color styling for the buttons

import React, { Fragment, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import "@fortawesome/fontawesome-free/css/all.css";
import { Link } from "react-router-dom";
import AuthContext from "../../../context/auth/AuthContext";
import AlertContext from "../../../context/alert/AlertContext";
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "./NavBar.css";

const Navbar = ({ title, icon }) => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const { isAuthenticated, logout, user } = authContext;
  const { clearAlerts } = alertContext;

  const onLogout = () => {
    logout();
    clearAlerts();
  };
  useEffect(() => {
    // console.log('NavBar is calling loadUser()');
    authContext.loadUser();
    // eslint-disable-next-line
  }, []);

  const authLinks = (
    <Fragment>
      <li>Hello {user && user.name}</li>
      <li>
        <a href="#!" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i>{" "}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </Fragment>
  );

  return (
    <div className="navbar bg-primary">
      <h1>
        <i className={icon} /> {title}
      </h1>
      <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
    </div>
  );
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
};

Navbar.defaultProps = {
  title: "Travel Safety",
  icon: "fas fa-id-card-alt",
};

export default Navbar;

// const NavBar = () => {
//   return (
//     <div>
//       <Navbar className="navbar-translucent">
//         <Container>
//           <Navbar.Brand className="travel-safety">TravelSafety</Navbar.Brand>
//           <Navbar.Toggle aria-controls="basic-navbar-nav" />
//           <Navbar.Collapse id="basic-navbar-nav">
//             <Nav className="me-auto">
//               <Nav.Link href="/" className="home-link">
//                 Home
//               </Nav.Link>
//             </Nav>
//             <Nav className="justify-content-end">
//               <Nav.Link href="/profile">
//                 <Button variant="light">Profile</Button>
//               </Nav.Link>
//               <Nav.Link href="/register">
//                 <Button variant="light">Register</Button>
//               </Nav.Link>
//               <Nav.Link href="/login">
//                 <Button variant="light">Login</Button>
//               </Nav.Link>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>
//     </div>
//   );
// };

// export default NavBar;
