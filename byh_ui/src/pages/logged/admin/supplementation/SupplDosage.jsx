import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TableSupplDosage from "./TableSupplDosage";

const SupplDosage = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
  ]);
  setCookie("currentPageCookie", "suppl-dosage", { path: "/" });
  const navigate = useNavigate();
  const [supplementId, setSupplementId] = useState("");
  const [FkgTeen, setFkgTeen] = useState("");
  const [MkgTeen, setMkgTeen] = useState("");
  const [FkgAdult, setFkgAdult] = useState("");
  const [MkgAdult, setMkgAdult] = useState("");
  const [defsupplBloodTests, setDefsupplBloodTests] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchDefSupplBloodTests();
  }, []);

  const fetchDefSupplBloodTests = () => {
    axios
      .get("/api/DefSupplBloodTests")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        setDefsupplBloodTests(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAdd = () => {
    const data = {
      SupplementId: supplementId,
      FkgTeen: FkgTeen,
      MkgTeen: MkgTeen,
      FkgAdult: FkgAdult,
      MkgAdult: MkgAdult,
    };

    axios
      .post("/api/SupplDosage", data)
      .then((response) => {
        alert(response.data.StatusMessage);
        clearTextArea();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const clearTextArea = () => {
    setSupplementId("");
    setFkgTeen("");
    setMkgTeen("");
    setFkgAdult("");
    setMkgAdult("");
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
        <b>Panel Dawkowania Suplementów</b>
      </Typography>
      <Card>
        <CardHeader
          title={
            <Typography variant="h6" textAlign={"center"}>
              <b>Dodaj Dawkowanie</b>
            </Typography>
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack direction="row" sx={{ marginBottom: 3 }}>
              <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                Wprowadź Suplement:{" "}
              </Typography>
              <Select
                value={supplementId}
                onChange={(e) => setSupplementId(e.target.value)}
                required
                sx={{ width: "25%" }}
              >
                {defsupplBloodTests.map((item) => (
                  <MenuItem key={item.Id} value={item.Id}>
                    {item.Supplement}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Typography
              variant="h6"
              sx={{ textAlign: "center", marginBottom: 3 }}
            >
              <b>Dawkowanie</b>
            </Typography>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", marginTop: 4 }}
            >
              <Stack direction="row">
                <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                  Kobieta do 19 lat:{" "}
                </Typography>
                <TextField
                  type="text"
                  label="Dawka"
                  value={FkgTeen}
                  onChange={(e) => setFkgTeen(e.target.value)}
                  required
                />
              </Stack>
              <Stack direction="row">
                <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                  Mężczyzna do 19 lat:{" "}
                </Typography>
                <TextField
                  type="text"
                  label="Dawka"
                  value={MkgTeen}
                  onChange={(e) => setMkgTeen(e.target.value)}
                  required
                />
              </Stack>
            </Stack>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", marginTop: 4 }}
            >
              <Stack direction="row">
                <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                  Kobieta powyżej 19 lat:{" "}
                </Typography>
                <TextField
                  type="text"
                  label="Dawka"
                  value={FkgAdult}
                  onChange={(e) => setFkgAdult(e.target.value)}
                  required
                />
              </Stack>
              <Stack direction="row">
                <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                  Mężczyzna powyżej 19 lat:{" "}
                </Typography>
                <TextField
                  type="text"
                  label="Dawka"
                  value={MkgAdult}
                  onChange={(e) => setMkgAdult(e.target.value)}
                  required
                />
              </Stack>
            </Stack>
            <Box sx={{ textAlign: "center", marginTop: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ marginRight: 4 }}
                onClick={() => handleAdd()}
              >
                Dodaj
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
      <Box>
        <TableSupplDosage />
      </Box>
    </Box>
  );
};

export default SupplDosage;
