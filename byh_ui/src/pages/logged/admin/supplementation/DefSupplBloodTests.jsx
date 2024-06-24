import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TableDefSupplBloodTests from "./TableDefSupplBloodTests";

const DefSupplBloodTests = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
  ]);
  setCookie("currentPageCookie", "def-suppl-tests", { path: "/" });
  const navigate = useNavigate();
  const [supplement, setSupplement] = useState("");
  const [bloodTest, setBloodTest] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleAdd = () => {
    const data = {
      Supplement: supplement,
      BloodTest: bloodTest,
    };

    axios
      .post("/api/DefSupplBloodTests", data)
      .then((response) => {
        alert(response.data.StatusMessage);
      })
      .catch((error) => {
        console.log(error);
      });

    setSupplement("");
    setBloodTest("");
  };

  return (
    <Box p={2} sx={{ height: "300vh" }}>
      <Button
        component={Link}
        to="/admin-supplementation"
        onClick={() => {
          onChangeContent("admin-supplementation");
          navigate("/admin-supplementation");
        }}
        size="small"
      >
        <ArrowBackIcon />
        Panel Suplementacji
      </Button>
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 3 }}>
        <b>Panel Badań Do Suplementów</b>
      </Typography>
      <Card>
        <CardHeader
          title={
            <Typography variant="h6" textAlign={"center"}>
              <b>Dodaj Badania</b>
            </Typography>
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack direction="row" sx={{ marginBottom: 3 }}>
              <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                Wprowadź Suplement:{" "}
              </Typography>
              <TextField
                type="text"
                label="Suplement"
                value={supplement}
                onChange={(e) => setSupplement(e.target.value)}
                required
              />
            </Stack>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", marginTop: 4 }}
            >
              <Stack direction="row">
                <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                  Wprowadź Badanie Krwi:{" "}
                </Typography>
                <TextField
                  type="text"
                  label="Badanie Krwi"
                  value={bloodTest}
                  onChange={(e) => setBloodTest(e.target.value)}
                  required
                />
              </Stack>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
                sx={{ marginRight: 4 }}
                onClick={() => handleAdd()}
              >
                Dodaj
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
      <Box>
        <TableDefSupplBloodTests />
      </Box>
    </Box>
  );
};

export default DefSupplBloodTests;
