import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const UserPrevention = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
  ]);
  setCookie("currentPageCookie", "user-prevention", { path: "/" });
  const navigate = useNavigate();

  return (
    <Box flex={12} p={2}>
      <Button
        component={Link}
        to="/homepage"
        onClick={() => {
          onChangeContent("homepage");
          navigate("/homepage");
        }}
        size="small"
      >
        <ArrowBackIcon />
        Strona Główna
      </Button>
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 3 }}>
        <b>Panel Chorób i ich Zapobiegania</b>
      </Typography>
      <Typography variant="h6" sx={{ textAlign: "center", marginTop: 10 }}>
        Wybierz kategorię suplementacji, której dotyczy Twój problem
      </Typography>
      <Box sx={{ marginTop: 5 }}>
        <Stack direction="row" justifyContent={"space-evenly"}>
          <Button
            component={Link}
            to="/user-diseases"
            onClick={() => {
              onChangeContent("user-diseases");
              navigate("/user-diseases");
            }}
          >
            Choroby
          </Button>
          <Button
            component={Link}
            to="/user-diseases-prevention"
            onClick={() => {
              onChangeContent("user-diseases-prevention");
              navigate("/user-diseases-prevention");
            }}
          >
            Zapogieganie
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default UserPrevention;
