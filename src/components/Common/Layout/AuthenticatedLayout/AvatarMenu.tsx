import AccountCircle from "@mui/icons-material/AccountCircle";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Typography from "@mui/material/Typography";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "store";
import { useLogoutMutation } from "store/api/user/userApiSlice";

const AvatarMenu = () => {
  const userInfo = useAppSelector((state) => state.user.userInfo);
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [logoutRequest] = useLogoutMutation();

  const handleLogout = useCallback(async () => {
    await logoutRequest();
    navigate("/");
  }, [logoutRequest, navigate]);

  return (
    <>
      <IconButton size="large" onClick={handleOpenUserMenu}>
        {userInfo?.image ? (
          <Avatar alt="avatar" src={userInfo.image} />
        ) : (
          <AccountCircle />
        )}
      </IconButton>

      <Menu
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={!!anchorElUser}
        onClose={handleCloseUserMenu}
      >
        <MenuList disablePadding sx={{ minWidth: "150px" }}>
          <MenuItem
            onClick={() => {
              navigate("/profile");
              handleCloseUserMenu();
            }}
          >
            <ListItemIcon>
              <ManageAccountsIcon />
            </ListItemIcon>
            <ListItemText>
              <Typography>Profile</Typography>
            </ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate("/order");
              handleCloseUserMenu();
            }}
          >
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText>
              <Typography>Order history</Typography>
            </ListItemText>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText>
              <Typography>Log out</Typography>
            </ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export default AvatarMenu;
