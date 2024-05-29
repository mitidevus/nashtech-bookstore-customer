import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import { Link, Outlet } from "react-router-dom";

import Logo from "components/Common/Logo";

import { Button } from "@mui/material";
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
            maxWidth="xl"
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              columnGap: "10px",
            }}
          >
            <Logo height="80%" />
            <Box sx={{ flex: 1 }} />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button component={Link} to="/" color="primary">
                Home
              </Button>
              <Button component={Link} to="/shop" color="primary">
                Shop
              </Button>
              <Button component={Link} to="/about" color="primary">
                About
              </Button>
            </Box>
            <Box>
              <AvatarMenu />
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="xl"
        component="main"
        sx={{
          height: `calc(100dvh - 10px - ${theme.layout.headerHeight})`,
          marginTop: "10px",
          overflow: "auto",
          scrollbarGutter: "stable",
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};

export default AuthenticatedLayout;
