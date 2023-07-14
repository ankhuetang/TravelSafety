import { extendTheme } from "@mui/joy/styles";

export default extendTheme({
  fontFamily: {
    display: "'Inter', var(--joy-fontFamily-fallback)",
    body: "'Inter', var(--joy-fontFamily-fallback)",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          500: "#458586",
        },
      },
    },
  },
});
