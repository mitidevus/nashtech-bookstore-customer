import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import Logo from "components/Common/Logo";
import { Outlet, useNavigate } from "react-router-dom";

import { Badge, IconButton } from "@mui/material";
import { NavButton } from "../NavButton";
import AvatarMenu from "./AvatarMenu";

const AuthenticatedLayout = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5fa",
      }}
    >
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
              <IconButton size="large" onClick={() => navigate("/cart")}>
                <Badge badgeContent={0} color="error">
                  <LocalGroceryStoreIcon color="primary" />
                </Badge>
              </IconButton>
              <AvatarMenu />
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="lg"
        component="main"
        sx={{
          minHeight: `calc(100dvh - 10px - ${theme.layout.headerHeight})`,
          height: "auto",
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};

export default AuthenticatedLayout;
