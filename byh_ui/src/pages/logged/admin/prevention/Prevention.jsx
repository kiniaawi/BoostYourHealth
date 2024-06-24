import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import TableDiseases from "./TableDiseases";
import TableDiseasesPrevention from "./TableDiseasesPrevention";

const Prevention = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
  ]);
  setCookie("currentPageCookie", "admin-prevention", { path: "/" });
  const navigate = useNavigate();
  return (
    <Box flex={12} p={2}>
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 3 }}>
        <b>Panel Chorób i Zapobiegania</b>
      </Typography>
      <Typography variant="h6" sx={{ textAlign: "center", marginTop: 10 }}>
        Wybierz działanie
      </Typography>
      <Box sx={{ marginTop: 5 }}>
        <Stack direction="row" justifyContent={"space-evenly"}>
          <Button
            component={Link}
            to="/diseases"
            onClick={() => {
              onChangeContent("diseases");
              navigate("/diseases");
            }}
          >
            Choroby
          </Button>
          <Button
            component={Link}
            to="/diseases-symptoms"
            onClick={() => {
              onChangeContent("diseases-symptoms");
              navigate("/diseases-symptoms");
            }}
          >
            Symptomy
          </Button>
          <Button
            component={Link}
            to="/diseases-prevention"
            onClick={() => {
              onChangeContent("diseases-prevention");
              navigate("/diseases-prevention");
            }}
          >
            Zapobieganie
          </Button>
        </Stack>
        <Stack direction="row" justifyContent={"space-evenly"}>
          <Button
            component={Link}
            to="/diets"
            onClick={() => {
              onChangeContent("diets");
              navigate("/diets");
            }}
          >
            Diety
          </Button>
          <Button
            component={Link}
            to="/workouts"
            onClick={() => {
              onChangeContent("workouts");
              navigate("/workouts");
            }}
          >
            Ćwiczenia
          </Button>
          <Button
            component={Link}
            to="/diseases-supplementation"
            onClick={() => {
              onChangeContent("diseases-supplementation");
              navigate("/diseases-supplementation");
            }}
          >
            Suplementacja
          </Button>
        </Stack>
      </Box>
      <Box sx={{ marginTop: 4 }}>
        <TableDiseases />
        <TableDiseasesPrevention />
      </Box>
    </Box>
  );
};

export default Prevention;
