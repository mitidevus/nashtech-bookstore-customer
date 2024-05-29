import { Button } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import Logo from "components/Common/Logo";
import { Link, Outlet } from "react-router-dom";

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
      >
        <Toolbar disableGutters>
          <Container
            maxWidth="xl"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",

              height: "100%",
            }}
          >
            <Logo height="80%" />

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
              <Button component={Link} to="/login" color="primary">
                Log in
              </Button>
              <Button
                component={Link}
                to="/signup"
                color="primary"
                size="large"
                variant="contained"
              >
                Sign up
              </Button>
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

export default UnauthenticatedLayout;
