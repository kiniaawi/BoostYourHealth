import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";
import "../../style.css";
import { useCookies } from "react-cookie";

const Sidebar = ({ isOpen, onChangeContent, adminChecking }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
    "isAdminCookie",
  ]);

  const isAdmin = cookies.isAdminCookie;

  return (
    <Box
      style={{ display: isOpen ? "block" : "none" }}
      flex={1}
      p={2}
      sx={{ display: { xs: "none", sm: "block" } }}
      marginTop={8}
    >
      {isAdmin === 1 ||
      isAdmin === true ||
      adminChecking === 1 ||
      adminChecking === true ? (
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/admin-home">
              <ListItemText
                primary="Strona Główna"
                primaryTypographyProps={{ className: "icon-text" }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/admin-skincare">
              <ListItemText
                primary="Pielęgnacja Skóry"
                primaryTypographyProps={{ className: "icon-text" }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/admin-haircare">
              <ListItemText
                primary="Pielęgnacja Włosów"
                primaryTypographyProps={{ className: "icon-text" }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/admin-supplementation">
              <ListItemText
                primary="Suplementacja"
                primaryTypographyProps={{ className: "icon-text" }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/admin-prevention">
              <ListItemText
                primary="Choroby i Zapobieganie"
                primaryTypographyProps={{ className: "icon-text" }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/homepage">
              <ListItemText
                primary="Strona Główna"
                primaryTypographyProps={{ className: "icon-text" }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/user-skincare">
              <ListItemText
                primary="Pielęgnacja Skóry"
                primaryTypographyProps={{ className: "icon-text" }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/user-haircare">
              <ListItemText
                primary="Pielęgnacja Włosów"
                primaryTypographyProps={{ className: "icon-text" }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/user-supplementation">
              <ListItemText
                primary="Suplementacja"
                primaryTypographyProps={{ className: "icon-text" }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/user-prevention">
              <ListItemText
                primary="Choroby I Ich Zapobieganie"
                primaryTypographyProps={{ className: "icon-text" }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/user-profile">
              <ListItemText
                primary="Twój Profil"
                primaryTypographyProps={{ className: "icon-text" }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </Box>
  );
};

export default Sidebar;
