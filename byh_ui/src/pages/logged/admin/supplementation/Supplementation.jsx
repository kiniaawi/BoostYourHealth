import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import TableDefSupplDealing from "./TableDefSupplDealing";

const Supplementation = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
  ]);
  setCookie("currentPageCookie", "admin-supplementation", { path: "/" });
  const navigate = useNavigate();
  return (
    <Box flex={12} p={2}>
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 3 }}>
        <b>Panel Suplementacji</b>
      </Typography>
      <Typography variant="h6" sx={{ textAlign: "center", marginTop: 10 }}>
        Wybierz działanie
      </Typography>
      <Box sx={{ marginTop: 5 }}>
        <Stack direction="row" justifyContent={"space-evenly"}>
          <Button
            component={Link}
            to="/def-suppl-issues"
            onClick={() => {
              onChangeContent("def-suppl-issues");
              navigate("/def-suppl-issues");
            }}
          >
            Objawy
          </Button>
          <Button
            component={Link}
            to="/def-suppl-tests"
            onClick={() => {
              onChangeContent("def-suppl-tests");
              navigate("/def-suppl-tests");
            }}
          >
            Badania do suplementacji
          </Button>
          <Button
            component={Link}
            to="/suppl-dosage"
            onClick={() => {
              onChangeContent("suppl-dosage");
              navigate("/suppl-dosage");
            }}
          >
            Dawkowanie suplementów
          </Button>
          <Button
            component={Link}
            to="/dealing-def-suppl"
            onClick={() => {
              onChangeContent("dealing-def-suppl");
              navigate("/dealing-def-suppl");
            }}
          >
            Porada suplementacyjna
          </Button>
        </Stack>
      </Box>
      <Box sx={{ marginTop: 4 }}>
        <TableDefSupplDealing />
      </Box>
    </Box>
  );
};

export default Supplementation;
