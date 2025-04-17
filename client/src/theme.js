import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#FFD8A8",  // Very light orange
      main: "#FFA64D",    // Main orange
      dark: "#CC7A29",    // Darker shade
      contrastText: "#fff", // Ensure text is readable
    },
    secondary: {
      main: "#333",  // Neutral dark for contrast
    },
    background: {
      default: "#f5f5f5", // Light background
      paper: "#fff", // White card background
    },
    text: {
      primary: "#333",
      secondary: "#555",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

export default theme;
