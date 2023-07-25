import React from "react";
import Alerts from "../alerts/Alerts";
import AlertForm from "../alerts/AlertForm";
import AuthContext from "../../../context/auth/AuthContext";
import { CssVarsProvider } from "@mui/joy/styles";
import customTheme from "../../theme";
import { GlobalStyles, CssBaseline, Box } from "@mui/joy";
import { root, formSide, formContainer, alertSide } from "../styles";
import { LoadScript } from "@react-google-maps/api";

const Profile = () => {
  const authContext = useContext(AuthContext);
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    console.log("Profile is calling loadUser()");
    authContext.loadUser();
    // eslint-disable-next-line
  }, []);

  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={["places", "geometry"]}>
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
    </LoadScript>
  );
};

export default Profile;
