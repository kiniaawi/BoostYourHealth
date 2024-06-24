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
import TableDiseases from "./TableDiseases";

const Diseases = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
  ]);
  setCookie("currentPageCookie", "diseases", { path: "/" });
  const navigate = useNavigate();
  const [diseaseName, setDiseaseName] = useState("");
  const [diet, setDiet] = useState("");
  const [supplementation, setSupplementation] = useState("");
  const [workout, setWorkout] = useState("");
  const [preventable, setPreventable] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleAdd = () => {
    const data = {
      DiseaseName: diseaseName,
      Diet: diet,
      Supplementation: supplementation,
      Workout: workout,
      Preventable: preventable,
    };

    axios
      .post("/api/Diseases", data)
      .then((response) => {
        alert(response.data.StatusMessage);
        clearTextArea();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const clearTextArea = () => {
    setDiseaseName("");
    setDiet("");
    setSupplementation("");
    setWorkout("");
    setPreventable("");
  };

  return (
    <Box p={2} sx={{ height: "300vh" }}>
      <Button
        component={Link}
        to="/admin-prevention"
        onClick={() => {
          onChangeContent("admin-prevention");
          navigate("/admin-prevention");
        }}
        size="small"
      >
        <ArrowBackIcon />
        Panel Chorób i Zapobiegania
      </Button>
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 3 }}>
        <b>Panel Chorób</b>
      </Typography>
      <Card>
        <CardHeader
          title={
            <Typography variant="h6" textAlign={"center"}>
              <b>Dodaj Chorobę</b>
            </Typography>
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack
              direction="row"
              sx={{ marginBottom: 3, justifyContent: "center" }}
            >
              <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                Wprowadź Nazwę Choroby:{" "}
              </Typography>
              <TextField
                type="text"
                label="Nazwa Choroby"
                value={diseaseName}
                onChange={(e) => setDiseaseName(e.target.value)}
                required
              />
            </Stack>
            <Stack
              direction="row"
              sx={{ marginBottom: 3, justifyContent: "center" }}
            >
              <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                Czy zastosować dietę:{" "}
              </Typography>
              <Select
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                required
                sx={{ width: "25%" }}
              >
                <MenuItem value="Tak">Tak</MenuItem>
                <MenuItem value="Nie">Nie</MenuItem>
              </Select>
            </Stack>
            <Stack
              direction="row"
              sx={{ marginBottom: 3, justifyContent: "center" }}
            >
              <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                Czy zastosować suplementację:{" "}
              </Typography>
              <Select
                value={supplementation}
                onChange={(e) => setSupplementation(e.target.value)}
                required
                sx={{ width: "25%" }}
              >
                <MenuItem value="Tak">Tak</MenuItem>
                <MenuItem value="Nie">Nie</MenuItem>
              </Select>
            </Stack>
            <Stack
              direction="row"
              sx={{ marginBottom: 3, justifyContent: "center" }}
            >
              <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                Czy zastosować ćwiczenia:{" "}
              </Typography>
              <Select
                value={workout}
                onChange={(e) => setWorkout(e.target.value)}
                required
                sx={{ width: "25%" }}
              >
                <MenuItem value="Tak">Tak</MenuItem>
                <MenuItem value="Nie">Nie</MenuItem>
              </Select>
            </Stack>
            <Stack
              direction="row"
              sx={{ marginBottom: 3, justifyContent: "center" }}
            >
              <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                Czy można zapobiegać:{" "}
              </Typography>
              <Select
                value={preventable}
                onChange={(e) => setPreventable(e.target.value)}
                required
                sx={{ width: "25%" }}
              >
                <MenuItem value="Tak">Tak</MenuItem>
                <MenuItem value="Nie">Nie</MenuItem>
              </Select>
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
        <TableDiseases />
      </Box>
    </Box>
  );
};

export default Diseases;
