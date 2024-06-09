import { Avatar, Box, Button, Paper, TextField } from "@mui/material";
import { Breadcrumbs } from "components/Common/Breadcrumbs";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "store";
import { selectUserInfo } from "store/slice/userSlice";

export default function Profile() {
  const userInfo = useAppSelector(selectUserInfo);
  const navigate = useNavigate();

  return (
    <Box>
      <Breadcrumbs />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            padding: 2,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            minWidth: 400,
            maxWidth: 450,
            p: 4,
          }}
        >
          <Avatar
            alt="avatar"
            src={userInfo?.image}
            sx={{
              width: 120,
              height: 120,
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              width: "100%",
            }}
          >
            <TextField
              fullWidth
              id="name"
              label="Name"
              variant="outlined"
              size="small"
              value={userInfo?.name}
              disabled
            />

            <TextField
              fullWidth
              id="phone"
              label="Phone Number"
              variant="outlined"
              size="small"
              value={userInfo?.phone}
              disabled
            />

            <TextField
              fullWidth
              id="address"
              label="Address"
              variant="outlined"
              size="small"
              value={userInfo?.address}
              disabled
            />

            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/profile/edit")}
            >
              Edit
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
