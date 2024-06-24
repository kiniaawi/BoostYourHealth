import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const UserProfile = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
    "nameCookie",
  ]);
  const username = cookies.nameCookie;
  setCookie("currentPageCookie", "user-profile", { path: "/" });
  const navigate = useNavigate();

  return (
    <Box flex={12} p={2}>
      <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 3 }}>
        <b>Profil {username}</b>
      </Typography>
      <Typography variant="h6" sx={{ textAlign: "center", marginTop: 10 }}>
        Poniższe panele zawierają historię porad:
      </Typography>
      <Box sx={{ marginTop: 5 }}>
        <Stack direction="row" justifyContent={"space-evenly"}>
          <Button
            component={Link}
            to="/history-skincare-face-advices"
            onClick={() => {
              onChangeContent("history-skincare-face-advices");
              navigate("/history-skincare-face-advices");
            }}
          >
            Pielęgnacja Skóry - Twarz
          </Button>
          <Button
            component={Link}
            to="/history-skincare-body-advices"
            onClick={() => {
              onChangeContent("history-skincare-body-advices");
              navigate("/history-skincare-body-advices");
            }}
          >
            Pielęgnacja Skóry - Ciało
          </Button>
          <Button
            component={Link}
            to="/history-haircare-advice"
            onClick={() => {
              onChangeContent("history-haircare-advice");
              navigate("/history-haircare-advice");
            }}
          >
            Pielęgnacja Włosów
          </Button>
        </Stack>
        <Stack direction="row" justifyContent={"space-evenly"}>
          <Button
            component={Link}
            to="/history-supplementation-advices"
            onClick={() => {
              onChangeContent("history-supplementation-advices");
              navigate("/history-supplementation-advices");
            }}
          >
            Suplementacja
          </Button>
          <Button
            component={Link}
            to="/history-diseases"
            onClick={() => {
              onChangeContent("history-diseases");
              navigate("/history-diseases");
            }}
          >
            Choroby i Ich Zapobieganie
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};
export default UserProfile;
