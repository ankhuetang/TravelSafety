import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import { StyledEngineProvider, CssVarsProvider } from "@mui/joy/styles";
import { StyledEngineProvider } from "@mui/joy/styles";
// import customTheme from "./shared/theme";

ReactDOM.createRoot(document.querySelector("#root")).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      {/* <CssVarsProvider
        defaultMode="light"
        disableTransitionOnChange
        theme={customTheme}
      > */}
      <App />
      {/* </CssVarsProvider> */}
    </StyledEngineProvider>
  </React.StrictMode>
);
