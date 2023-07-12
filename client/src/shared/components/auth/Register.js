// CHANGE THIS!!!
import React, { useContext, useState, useEffect } from "react";
import WarningContext from "../../../context/warning/WarningContext";
import AuthContext from "../../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const warningContext = useContext(WarningContext);
  const authContext = useContext(AuthContext);

  const { setWarning } = warningContext;
  const { register, error, clearErrors, isAuthenticated } = authContext;

  const navigate = useNavigate();
  useEffect(() => {
    console.log("Register is calling useEffect()");
    // props.history.push() is deprecated!!! Use Navigate from react-router-dom instead
    if (isAuthenticated) {
      console.log("User is authenticated. Rendering profile page");
      navigate("/profile");
    }
    console.log("error message:", error);
    if (error !== null) {
      setWarning(error, "danger");
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated]);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
  });

  const { name, email, phone, password, password2 } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    console.log("Submit button clicked");
    e.preventDefault();
    if (name === "" || email === "" || phone === "" || password === "") {
      setWarning("Please enter all fields", "danger");
    } else if (password !== password2) {
      setWarning("Passwords do not match", "danger");
    } else {
      register({
        name,
        email,
        phone,
        password,
      });
    }
  };

  return (
    <div className="form-container">
      <h1>
        Account <span className="text-primary">Register</span>
      </h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
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
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={phone}
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
            minLength="6"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            name="password2"
            value={password2}
            onChange={onChange}
            required
            minLength="6"
          />
        </div>
        <input
          type="submit"
          value="Register"
          className="btn btn-primary btn-block"
        />
      </form>
    </div>
  );
};

export default Register;
