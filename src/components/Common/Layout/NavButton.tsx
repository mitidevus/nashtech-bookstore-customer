import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

export const NavButton = ({ to, label }: { to: string; label: string }) => {
  return (
    <Box>
      <Button
        component={Link}
        to={to}
        sx={{
          color: "primary.main",
          borderRadius: "9999px",
          "&:hover": {
            backgroundColor: "primary.main",
            color: "white",
          },
        }}
        size="small"
      >
        {label}
      </Button>
    </Box>
  );
};
