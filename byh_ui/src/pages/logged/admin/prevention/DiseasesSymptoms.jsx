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
import TableDiseasesSymptoms from "./TableDiseasesSymptoms";

const DiseasesSymptoms = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
  ]);
  setCookie("currentPageCookie", "diseases-symptoms", { path: "/" });
  const navigate = useNavigate();
  const [diseaseId, setDiseaseId] = useState("");
  const [mainSymptom, setMainSymptom] = useState("");
  const [sideSymptoms, setSideSymptoms] = useState("");
  const [diseasesData, setDiseasesData] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchDiseasesData();
  }, []);

  const fetchDiseasesData = () => {
    axios
      .get("/api/Diseases")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        setDiseasesData(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAdd = () => {
    const data = {
      DiseaseId: diseaseId,
      MainSymptom: mainSymptom,
      SideSymptoms: sideSymptoms,
    };

    axios
      .post("/api/DiseasesSymptoms", data)
      .then((response) => {
        alert(response.data.StatusMessage);
        clearTextArea();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const clearTextArea = () => {
    setDiseaseId("");
    setMainSymptom("");
    setSideSymptoms("");
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
        <b>Panel Objawów Chorób</b>
      </Typography>
      <Card>
        <CardHeader
          title={
            <Typography variant="h6" textAlign={"center"}>
              <b>Dodaj Objawy</b>
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
              <Select
                value={diseaseId}
                onChange={(e) => setDiseaseId(e.target.value)}
                required
                sx={{ width: "25%" }}
              >
                {diseasesData.map((item) => (
                  <MenuItem key={item.Id} value={item.Id}>
                    {item.DiseaseName}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack
              direction="row"
              sx={{ marginBottom: 3, justifyContent: "center" }}
            >
              <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                Wprowadź główny objaw:{" "}
              </Typography>
              <TextField
                type="text"
                label="Główny Symptom"
                value={mainSymptom}
                onChange={(e) => setMainSymptom(e.target.value)}
                sx={{ width: "25%" }}
                required
              />
            </Stack>
            <Stack
              direction="row"
              sx={{ marginBottom: 3, justifyContent: "center" }}
            >
              <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                Wprowadź poboczne objawy:{" "}
              </Typography>
              <TextField
                type="text"
                label="Poboczne Objawy"
                value={sideSymptoms}
                onChange={(e) => setSideSymptoms(e.target.value)}
                sx={{ width: "25%" }}
                required
              />
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
        <TableDiseasesSymptoms />
      </Box>
    </Box>
  );
};

export default DiseasesSymptoms;
