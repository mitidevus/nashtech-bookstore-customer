import { Button, TextField } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import Logo from "components/Common/Logo";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../Footer";
import { NavButton } from "../NavButton";

const UnauthenticatedLayout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();

  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (!searchParams.has("search")) {
      setKeyword("");
    }
  }, [searchParams]);

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
            <Box
              height="70%"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Logo />

              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  navigate(`/shop?search=${keyword}`);
                  return;
                }}
                autoComplete="off"
                sx={{
                  display: {
                    xs: "none",
                    md: "flex",
                  },
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <TextField
                  label="Search"
                  variant="outlined"
                  size="small"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  sx={{ width: 300 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="medium"
                  disabled={!keyword}
                >
                  Search
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
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
          minHeight: `calc(100dvh - 10px - ${theme.layout.headerHeight})`,
          height: "auto",
        }}
      >
        <Outlet />
      </Container>

      <Footer />
    </Box>
  );
};

export default UnauthenticatedLayout;
