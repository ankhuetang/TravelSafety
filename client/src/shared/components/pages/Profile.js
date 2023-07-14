import React, { useContext, useEffect } from "react";
import Alerts from "../alerts/Alerts";
import AlertForm from "../alerts/AlertForm";
import AuthContext from "../../../context/auth/AuthContext";
import { CssVarsProvider } from "@mui/joy/styles";
import customTheme from "../../theme";
import { GlobalStyles, CssBaseline, Box } from "@mui/joy";
import { root, formSide, formContainer, alertSide } from "../styles";

const Profile = () => {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    console.log("Profile is calling loadUser()");
    authContext.loadUser();
    // eslint-disable-next-line
  }, []);

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
          <AlertForm />
        </Box>
      </Box>
      <Box sx={(theme) => alertSide}>
        <Box sx={formContainer}>
          <Alerts />
        </Box>
      </Box>
    </CssVarsProvider>
  );
};

export default Profile;
