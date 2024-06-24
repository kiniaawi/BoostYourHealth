import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const UserSupplementation = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
  ]);
  setCookie("currentPageCookie", "user-supplementation", { path: "/" });
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
        <b>Panel Suplementacji</b>
      </Typography>
      <Typography variant="h6" sx={{ textAlign: "center", marginTop: 10 }}>
        Wybierz kategorię suplementacji, której dotyczy Twój problem
      </Typography>
      <Box sx={{ marginTop: 5 }}>
        <Stack direction="row" justifyContent={"space-evenly"}>
          <Button
            component={Link}
            to="/skin-supplementation"
            onClick={() => {
              onChangeContent("skin-supplementation");
              navigate("/skin-supplementation");
            }}
          >
            Skóra
          </Button>
          <Button
            component={Link}
            to="/hair-nails-supplementation"
            onClick={() => {
              onChangeContent("hair-nails-supplementation");
              navigate("/hair-nails-supplementation");
            }}
          >
            Włosy i Paznokcie
          </Button>
          <Button
            component={Link}
            to="/digestive-system-supplementation"
            onClick={() => {
              onChangeContent("digestive-system-supplementation");
              navigate("/digestive-system-supplementation");
            }}
          >
            Układ Pokarmowy
          </Button>
          <Button
            component={Link}
            to="/functioning-supplementation"
            onClick={() => {
              onChangeContent("functioning-supplementation");
              navigate("/functioning-supplementation");
            }}
          >
            Funkcjonowanie
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default UserSupplementation;
