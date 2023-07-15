// CHANGE THIS!!!
import React, { useContext, useState, useEffect } from "react";
import WarningContext from "../../../context/warning/WarningContext";
import AuthContext from "../../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { CssVarsProvider } from "@mui/joy/styles";
import {
  GlobalStyles,
  CssBaseline,
  Box,
  Button,
  FormControl,
  Input,
  Typography,
  FormLabel,
} from "@mui/joy";
import customTheme from "../../theme";
import { root, formSide, formContainer, form, imageSide } from "../styles";

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

  const labels = [
    "Name",
    "Email",
    "Phone Number",
    "Password",
    "Confirm Password",
  ];

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    // console.log("Submit button clicked");
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
    <CssVarsProvider
      defaultMode="light"
      disableTransitionOnChange
      theme={customTheme}
    >
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": root,
        }}
      />
      <Box sx={(theme) => formSide}>
        <Box sx={formContainer}>
          <Box component="main" sx={form}>
            <div>
              <Typography component="h1" fontSize="xl2" fontWeight="lg">
                Create a new account
              </Typography>
              <Typography level="body2" sx={{ my: 1, mb: 3 }}>
                Welcome to Safe Traveler - your go-to app for exploring and
                staying informed about the safety of places
              </Typography>
            </div>
            <form onSubmit={onSubmit}>
              {Object.entries(user).map(([key, value], index) => (
                <FormControl required>
                  <FormLabel>{labels[index]}</FormLabel>
                  <Input
                    name={key}
                    value={value}
                    onChange={onChange}
                    type={
                      key === "password" || key === "password2"
                        ? "password"
                        : "text"
                    }
                  />
                </FormControl>
              ))}
              <Button type="submit" fullWidth>
                Sign in
              </Button>
            </form>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body3" textAlign="center">
              © Safe Traveler {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={(theme) => imageSide} />
    </CssVarsProvider>
  );
};

export default Register;
