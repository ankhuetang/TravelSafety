import React, { useState, useContext, useEffect } from "react";
import WarningContext from "../../../context/warning/WarningContext";
import AuthContext from "../../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { CssVarsProvider } from "@mui/joy/styles";
import customTheme from "../../theme";
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
import { root, formSide, formContainer, form, imageSide } from "../styles";

const Login = () => {
  const authContext = useContext(AuthContext);
  const warningContext = useContext(WarningContext);

  const { setWarning } = warningContext;
  const { login, error, clearErrors, isAuthenticated } = authContext;

  const navigate = useNavigate();
  useEffect(() => {
    console.log(authContext);
    // props.history.push() is deprecated!!! Use Navigate from react-router-dom instead
    if (isAuthenticated) {
      console.log("User is authenticated. Rendering profile page");
      // <Navigate to='/' />; // ???
      navigate("/profile");
    }
    if (error !== null) {
      // console.log("Login component is raising error:", error);
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
    const formElements = e.currentTarget.elements;
    const email = formElements.email.value;
    const password = formElements.password.value;
    if (email === "" || password === "") {
      setWarning("Please fill in all fields", "danger");
    } else {
      login({ email, password });
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
                Sign in to your account
              </Typography>
              <Typography level="body2" sx={{ my: 1, mb: 3 }}>
                Welcome back
              </Typography>
            </div>
            <form onSubmit={onSubmit}>
              <FormControl required>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                />
              </FormControl>
              <FormControl required>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                />
              </FormControl>
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

export default Login;
