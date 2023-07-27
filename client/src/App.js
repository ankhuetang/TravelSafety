import MapContainer from "./Map/Map";
import "./App.css";
import NavBar from "./shared/components/NavBar";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Switch } from "react-router-dom/cjs/react-router-dom.min";
import Alert from "./shared/components/pages/Alert";
import Login from "./shared/components/pages/Login";
import Profile from "./shared/components/pages/Profile";
import AlertState from "./context/alert/AlertState";

function App() {
  return (
    <div className="App">
      <AlertState>
        <Router>
          <div className="App">
            <NavBar />
            {/* <div className='container'> */}
            <Switch>
              <Route exact path="/" component={MapContainer} />
              <Route exact path="/alert" component={Alert} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/profile" component={Profile} />
            </Switch>
            {/* </div> */}
          </div>
        </Router>
      </AlertState>
    </div>
  );
}

export default App;
