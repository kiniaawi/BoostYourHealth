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
import TableDiseasesPrevention from "./TableDiseasesPrevention";

const DiseasesPrevention = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
  ]);
  setCookie("currentPageCookie", "diseases-prevention", { path: "/" });
  const navigate = useNavigate();
  const [diseaseId, setDiseaseId] = useState("");
  const [howToPrevent, setHowToPrevent] = useState("");
  const [tips, setTips] = useState("");
  const [description, setDescription] = useState("");
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
        const filteredData = response.data.Data.filter(
          (disease) => disease.Preventable === "Tak"
        );
        console.log(filteredData);
        setDiseasesData(filteredData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAdd = () => {
    const data = {
      DiseaseId: diseaseId,
      HowToPrevent: howToPrevent,
      Tips: tips,
      Description: description,
    };

    axios
      .post("/api/DiseasesPrevention", data)
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
    setHowToPrevent("");
    setTips("");
    setDescription("");
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
        <b>Panel Zapobiegania Chorobom</b>
      </Typography>
      <Card>
        <CardHeader
          title={
            <Typography variant="h6" textAlign={"center"}>
              <b>Dodaj Zapobieganie Chorobie</b>
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
                Wprowadź sposób zapobiegania:{" "}
              </Typography>
              <TextField
                type="text"
                label="Sposób Zapobiegania"
                value={howToPrevent}
                onChange={(e) => setHowToPrevent(e.target.value)}
                sx={{ width: "25%" }}
                required
              />
            </Stack>
            <Stack
              direction="row"
              sx={{ marginBottom: 3, justifyContent: "center" }}
            >
              <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                Wprowadź wskazówki:{" "}
              </Typography>
              <TextField
                type="text"
                label="Wskazówki"
                value={tips}
                onChange={(e) => setTips(e.target.value)}
                sx={{ width: "25%" }}
                required
              />
            </Stack>
            <Stack
              direction="row"
              sx={{ marginBottom: 3, justifyContent: "center" }}
            >
              <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                Wprowadź opis:{" "}
              </Typography>
              <TextField
                type="text"
                label="Opis"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
        <TableDiseasesPrevention />
      </Box>
    </Box>
  );
};

export default DiseasesPrevention;
