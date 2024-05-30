import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import Logo from "components/Common/Logo";
import { Outlet } from "react-router-dom";
import { NavButton } from "../NavButton";

const UnauthenticatedLayout = () => {
  const theme = useTheme();

  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          height: theme.layout.headerHeight,
          backgroundColor: theme.palette.background.paper,
        }}
        elevation={1}
      >
        <Toolbar disableGutters>
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <Logo height="70%" />

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <NavButton to="/" label="Home" />
              <NavButton to="/shop" label="Shop" />
              <NavButton to="/about" label="About" />
              <NavButton to="/login" label="Login" />
              <NavButton to="/signup" label="Sign up" />
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="lg"
        component="main"
        sx={{
          height: `calc(100dvh - 10px - ${theme.layout.headerHeight})`,
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};

export default UnauthenticatedLayout;
