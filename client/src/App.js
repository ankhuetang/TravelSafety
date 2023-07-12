// CHANGE THIS!!!
import MapContainer from "./Map/Map";
import "./App.css";
import NavBar from "./shared/components/layout/NavBar";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "./shared/components/pages/Profile";
import AlertState from "./context/alert/AlertState";
import AuthState from "./context/auth/AuthState";
import Register from "./shared/components/auth/Register";
import Login from "./shared/components/auth/Login";
import WarningState from "./context/warning/WarningState";
import Warnings from "./shared/components/layout/Warnings";
import setAuthToken from "./utils/setAuthToken";
import PrivateRoute from "./shared/components/routing/PrivateRoute";

if (localStorage.getItem("token") !== null) {
  setAuthToken(localStorage.getItem("token"));
}

const App = () => {
  return (
    <div className="App">
      <AuthState>
        <AlertState>
          <WarningState>
            <Router>
              <div className="App">
                <NavBar />
                {/* <div className="container"> */}
                <Warnings />
                <Routes>
                  <Route exact path="/" element={<MapContainer />} />
                  <Route
                    exact
                    path="/profile"
                    element={<PrivateRoute component={Profile} />}
                  />
                  <Route exact path="/register" element={<Register />} />
                  <Route exact path="/login" element={<Login />} />
                </Routes>
                {/* </div> */}
              </div>
            </Router>
          </WarningState>
        </AlertState>
      </AuthState>
    </div>
  );
};

export default App;
