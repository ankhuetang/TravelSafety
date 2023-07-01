import React, { useState, useContext, useEffect } from "react";
import WarningContext from "../../../context/warning/WarningContext";
import AuthContext from "../../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const authContext = useContext(AuthContext);
  const warningContext = useContext(WarningContext);

  const { setWarning } = warningContext;
  const { login, error, clearErrors, isAuthenticated } = authContext;

  const navigate = useNavigate();
  useEffect(() => {
    // props.history.push() is deprecated!!! Use Navigate from react-router-dom instead
    if (isAuthenticated) {
      console.log("User is authenticated. Rendering profile page");
      // <Navigate to='/' />; // ???
      navigate("/profile");
    }

    if (error === "Invalid credentials") {
      // Kiem tra xem error message o backend co giong khong
      setWarning(error, "danger");
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated]);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { email, password } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      setWarning("Please fill in all fields", "danger");
    } else {
      login({ email, password });
    }
  };

  return (
    <div className="form-container">
      <h1>
        Account <span className="text-primary">Login</span>
      </h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <input
          type="submit"
          value="Login"
          className="btn btn-primary btn-block"
        />
      </form>
    </div>
  );
};

export default Login;
