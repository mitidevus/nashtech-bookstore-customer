import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom";

import Logo from "components/Common/Logo";

import { NavButton } from "../NavButton";
import AvatarMenu from "./AvatarMenu";

const AuthenticatedLayout = () => {
  const theme = useTheme();

  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          height: theme.layout.headerHeight,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Toolbar disableGutters>
          <Container
            maxWidth="lg"
            sx={{
              height: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Logo height="70%" />

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <NavButton to="/" label="Home" />
              <NavButton to="/shop" label="Shop" />
              <NavButton to="/about" label="About" />
              <AvatarMenu />
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

export default AuthenticatedLayout;
