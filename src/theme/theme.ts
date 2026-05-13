import { createTheme } from "@mui/material/styles";

export const verbMasterTheme = createTheme({
  palette: {
    primary: {
      main: "#0052CC",
    },
    secondary: {
      main: "#E3F2FD",
    },
    success: {
      main: "#2E7D32",
      light: "#E8F5E9",
    },
    error: {
      main: "#C62828",
      light: "#FFEBEE",
    },
    warning: {
      main: "#C9A227",
    },
    background: {
      default: "#F8F9FA",
      paper: "#FFFFFF",
    },
    text: {
      secondary: "rgba(0, 0, 0, 0.6)",
    },
  },
  typography: {
    fontFamily:
      'var(--font-roboto), "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 12,
  },
});
