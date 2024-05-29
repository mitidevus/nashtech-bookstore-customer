import { Box } from "@mui/material";
import { Link } from "react-router-dom";

import logo from "assets/images/logo.png";

function Logo({ height = "100%" }: { height?: string }) {
  return (
    <Box height={height}>
      <Link to="/" style={{ display: "inline-block", height: "100%" }}>
        <img src={logo} alt="logo" style={{ maxHeight: "100%" }} />
      </Link>
    </Box>
  );
}

export default Logo;
