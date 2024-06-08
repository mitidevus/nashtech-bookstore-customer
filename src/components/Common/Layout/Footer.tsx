import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { Divider, Grid, Typography } from "@mui/material";
import LinkMUI from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import logo from "assets/images/logo.png";
import { Link } from "react-router-dom";

const LinkTitle = ({ title, link }: { title: string; link: string }) => {
  return (
    <Typography
      component={Link}
      to={link}
      variant="body2"
      sx={{
        color: "text.secondary",
        textDecoration: "none",
        "&:hover": {
          textDecoration: "underline",
        },
      }}
    >
      {title}
    </Typography>
  );
};

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        pt: 4,
        pb: 2,
        mt: 4,
        minWidth: 350,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <img src={logo} alt="logo" style={{ height: 40 }} />
              <Typography variant="h6" color="textPrimary">
                Nash Bookstore
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary">
              The best place to find your favorite books.
              <br />
              Email:{" "}
              <LinkMUI
                href="mailto: support@nashbookstore.com"
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                support@nashbookstore.com
              </LinkMUI>
              <br />
              Hotline:{" "}
              <LinkMUI
                href="tel:1900 1234"
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                1900 1234
              </LinkMUI>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight={500}>
              Company
            </Typography>
            <LinkTitle title="About Us" link="/about" />
            <br />
            <LinkTitle title="Contact Us" link="/contact" />
            <br />
            <LinkTitle title="Careers" link="/careers" />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight={500}>
              Support
            </Typography>
            <LinkTitle title="FAQ" link="/faq" />
            <br />
            <LinkTitle title="Privacy Policy" link="/privacy" />
            <br />
            <LinkTitle title="Terms of Service" link="/terms" />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight={500}>
              Legal
            </Typography>
            <LinkTitle title="Return Policy" link="/return-policy" />
            <br />
            <LinkTitle title="Refund Policy" link="/refund-policy" />
            <br />
            <LinkTitle title="Shipping Policy" link="/shipping-policy" />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight={500}>
              Follow Us
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography
                component={LinkMUI}
                href="https://facebook.com"
                target="_blank"
              >
                <FacebookIcon />
              </Typography>
              <Typography
                component={LinkMUI}
                href="https://twitter.com"
                target="_blank"
              >
                <TwitterIcon />
              </Typography>
              <Typography
                component={LinkMUI}
                href="https://instagram.com"
                target="_blank"
              >
                <InstagramIcon />
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="textSecondary">
            © {new Date().getFullYear()} Nash Bookstore. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
