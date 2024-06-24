import styled from "@emotion/styled";
import {
  AppBar,
  Stack,
  Toolbar,
  Typography,
  Box,
  MenuItem,
  Menu,
  Avatar,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Flag from "react-world-flags";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LanguageIcon from "@mui/icons-material/Language";
import LogoutIcon from "@mui/icons-material/Logout";
import logoBig from "../../logo/BYH_logo3.png";
import logoSmall from "../../logo/BYHlogo1.png";
import { useCookies } from "react-cookie";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const Icons = styled(Box)(({ theme }) => ({
  backgroundColor: "",
  display: "flex",
  alignItems: "center",
  gap: "20px",
}));

const Navbar = ({ setLang, onSidebarToggle }) => {
  const [open, setOpen] = useState(false);
  const [openLang, setOpenLang] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageContent",
    "nameCookie",
    "isAdminCookie",
  ]);

  const username = cookies.nameCookie;
  const isAdmin = cookies.isAdminCookie;
  const userEmail = cookies.emailCookie;

  const [userData, setUserData] = useState([]);
  const [adminChecking, setAdminChecking] = useState("");

  console.log("IsAdminCookieNavbar: ", isAdmin);

  const onLogout = () => {
    removeCookie("isAdminCookie");
    removeCookie("emailCookie");
    removeCookie("nameCookie");
    removeCookie("currentPageCookie");
    window.location.href = "http://localhost:3000";
  };

  function getInitial(username) {
    if (username) {
      const userInitial = username.charAt(0).toUpperCase();

      return `${userInitial}`;
    } else {
      return "";
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    CheckIfIsAdmin();
  }, [userData]);

  const fetchUserData = () => {
    axios
      .get("/api/Registration")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        setUserData(response.data.Data);
        CheckIfIsAdmin();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const CheckIfIsAdmin = () => {
    if (userData.length > 0) {
      const currentUser = userData.find((user) => user.Email === userEmail);

      if (currentUser) {
        if (currentUser.IsAdmin) {
          console.log(currentUser.IsAdmin);
          setAdminChecking(true);
        } else {
          console.log(currentUser.IsAdmin);
          setAdminChecking(false);
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const initial = getInitial(username);

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#d90f8b" }}>
      {/* //"#d90f8b" #FF006E */}
      <StyledToolbar>
        <Stack direction="row" spacing={1}>
          <Link
            to={
              isAdmin === 1 || isAdmin === true || adminChecking === true
                ? "/admin-home"
                : "/homepage"
            }
          >
            <Typography
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              <img
                src={logoBig}
                alt="logo_BYH"
                style={{ width: "auto", height: "75px" }}
              />
            </Typography>
            <Typography
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <img
                src={logoSmall}
                alt="logo_BYH"
                style={{ width: "auto", height: "80px" }}
              />
            </Typography>
          </Link>
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent={"center"}
        >
          <Avatar
            sx={{
              bgcolor: "#f2efe6",
              width: 35,
              height: 35,
              fontSize: 20,
              color: "black",
              fontWeight: "bold",
            }}
            alt=""
            src=""
            onClick={(e) => setOpen(true)}
          >
            {initial}
          </Avatar>
          <IconButton
            onClick={onSidebarToggle}
            size="large"
            edge="start"
            //color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Stack>
      </StyledToolbar>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        open={open}
        onClose={(e) => setOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{ marginTop: 6 }}
      >
        <MenuItem sx={{ gap: "20px" }} onClick={onLogout}>
          Wyloguj
          <LogoutIcon />
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
