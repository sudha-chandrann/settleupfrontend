export const colortheme = {
  // 🎯 Primary Colors
  primary: {
    light: "#4FB8A8",
    main: "#2A9D8F",
    dark: "#1E7A6E",
    contrastText: "#FFFFFF",
  },

  // 🎨 Secondary Colors
  secondary: {
    light: "#FFD580",
    main: "#E9C46A",
    dark: "#B58B33",
    contrastText: "#1A1A1A",
  },

  // 🖼️ Background Colors (Dark Base)
  background: {
    default: "#0F172A",     // App background
    surface: "#1E293B",     // Cards and modals
    muted: "#334155",       // Inputs, secondary surfaces
  },

  // 📝 Text Colors
  text: {
    primary: "#F1F5F9",     // Headings & main text
    secondary: "#CBD5E1",   // Labels, descriptions
    muted: "#94A3B8",       // Placeholder, subtle text
    inverse: "#0F172A",     // For light buttons (e.g., toast bg)
  },

  // ✅ Status Colors with Dark Backgrounds
  status: {
    success: {
      main: "#2ECC71",
      background: "#153E2B",   // Dark green surface
      text: "#A7F3D0",
    },
    warning: {
      main: "#F4A261",
      background: "#4C3727",   // Toasts or alert cards
      text: "#FCD9B0",
    },
    error: {
      main: "#E76F51",
      background: "#4A1D1D",
      text: "#FCA5A5",
    },
  },

  // 📋 Utilities
  divider: "#334155",        // Subtle divider
  border: "#475569",         // Card/input borders
  shadow: "rgba(0, 0, 0, 0.6)", // Stronger shadow for dark UI
};
