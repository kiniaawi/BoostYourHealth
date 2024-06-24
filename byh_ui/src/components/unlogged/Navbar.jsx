import styled from "@emotion/styled";
import {
  AppBar,
  Stack,
  Toolbar,
  Typography,
  Box,
  MenuItem,
  Menu,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import Flag from "react-world-flags";
import { useNavigate } from "react-router-dom";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import { Tooltip } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LanguageIcon from "@mui/icons-material/Language";
import logoBig from "../../logo/BYH_logo3.png";
import logoSmall from "../../logo/BYHlogo1.png";
import { Link } from "react-router-dom";

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

const Navbar = ({
  setLang,
  lang,
  title,
  onChangeContent,
  currentContent,
  setCurrentContent,
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#d90f8b" }}>
      <StyledToolbar>
        <Stack direction="row" spacing={1}>
          <Link to="/login" component="button">
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

        <Link to="/contact-support" component="button">
          <Tooltip
            title="W razie problemów skontaktuj się z Administracją"
            arrow
          >
            <ContactSupportIcon />
          </Tooltip>
        </Link>
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
      >
        <MenuItem sx={{ gap: "20px" }}>
          <Flag
            value="English"
            style={{ cursor: "pointer" }}
            height="16"
            code="gb"
            onClick={(e) => setLang("English")}
          />
        </MenuItem>
        <MenuItem sx={{ gap: "20px" }}>
          <Flag
            value="Polish"
            style={{ cursor: "pointer" }}
            code="pl"
            height="16"
            onClick={(e) => setLang("Polish")}
          />
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
