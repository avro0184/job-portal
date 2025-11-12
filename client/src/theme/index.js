// src/theme.js
import { createTheme } from "@mui/material/styles";

const fontStack =
  '"Tiro Bangla", "Noto Sans Bengali", "Noto Sans", ui-sans-serif, system-ui, sans-serif';

const withMode = (mode = "light") =>
  createTheme({
    palette: {
      mode,
      primary: { main: "#6754e8" },
      secondary: { main: "#64748b" },
      ...(mode === "dark"
        ? {
            background: { default: "#0f172a", paper: "#1f2937" }, // slate-900 / gray-800
            text: { primary: "#f9fafb", secondary: "#d1d5db" },   // gray-50 / -300
          }
        : {
            background: { default: "#ffffff", paper: "#ffffff" },
            text: { primary: "#111827", secondary: "#4b5563" },   // gray-900 / -600
          }),
    },
    typography: {
      fontFamily: fontStack,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: { fontFamily: fontStack },
          body: { fontFamily: fontStack },
        },
      },

      MuiButton: {
        styleOverrides: {
          containedPrimary: {
            backgroundColor: "#4e3ecf",
            color: "#ffffff",
            "&:hover": { backgroundColor: "#4e3ecf" },
          },
          outlinedPrimary: {
            color: "#6754e8",
            borderColor: "#6754e8",
            "&:hover": { backgroundColor: mode === "dark" ? "#1e293b" : "#f2f2ff" },
          },
        },
      },

      MuiRadio: {
        styleOverrides: {
          root: {
            color: "#6754e8",
            "&.Mui-checked": { color: "#6754e8" },
          },
        },
      },

      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: "#6754e8",
            "&.Mui-checked": { color: "#6754e8" },
          },
        },
      },

      // ⬇️ This makes ALL TextFields/Selects dark-mode aware automatically
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? "#1f2937" : "#fff",
            borderRadius: "6px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: mode === "dark" ? "#374151" : "#6754e8",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#6754e8" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6754e8" },
            "& .MuiInputBase-input": {
              color: mode === "dark" ? "#f9fafb" : "#111827",
            },
          },
        },
      },

      MuiSelect: {
        styleOverrides: { icon: { color: "#6754e8" } },
      },

      // Menus adapt to dark, so Select menus look right
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "dark" ? "#1f2937" : "#ffffff",
            color: mode === "dark" ? "#f9fafb" : "#111827",
          },
        },
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: "#6754e8",
              color: "#ffffff",
            },
          },
        },
      },

      // Let MuiInputLabel own label color (no need to duplicate in FormControl)
      MuiFormControl: {
        styleOverrides: { root: {} },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: "#6754e8",
            "&.Mui-focused": { color: "#6754e8" },
          },
        },
      },
    },
  });

export const makeTheme = withMode;
export default makeTheme;
