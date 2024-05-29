import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    layout: {
      headerHeight: string;
      drawerWidth: string;
    };
  }
  interface ThemeOptions {
    layout?: {
      headerHeight?: string;
      drawerWidth?: string;
    };
  }
}

const defaultTheme = createTheme({
  components: {
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
    },
  },
  palette: {
    primary: {
      main: "#7F56D9",
    },
  },
  layout: {
    headerHeight: "70px",
    drawerWidth: "260px",
  },
});

export { defaultTheme };
