import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCookies } from "react-cookie";
import DealingHairProblemsTable from "./DealingHairProblemsTable";

const DealingHairProblems = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
  ]);
  setCookie("currentPageCookie", "dealing-hairproblems", { path: "/" });
  const [hairProblem, setHairProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [description, setDescription] = useState("");
  const [hairProblemsData, setHairProblemsData] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchhairProblems();
  }, []);

  const fetchhairProblems = () => {
    axios
      .get("/api/HairProblems")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0].HairProblem);
        setHairProblemsData(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAdd = () => {
    const data = {
      HairProblem: hairProblem,
      Solution: solution,
      Description: description,
    };

    axios
      .post("/api/DealingHairProblems", data)
      .then((response) => {
        alert(response.data.StatusMessage);
        clearTextArea();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const clearTextArea = () => {
    setHairProblem("");
    setSolution("");
    setDescription("");
  };

  return (
    <Box p={2} sx={{ height: "300vh" }}>
      <Button
        component={Link}
        to="/admin-haircare"
        onClick={() => {
          onChangeContent("admin-haircare");
          navigate("/admin-haircare");
        }}
        size="small"
      >
        <ArrowBackIcon />
        Panel Pielęgnacji Włosów
      </Button>
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 3 }}>
        <b>Panel Rozwiązań Rroblemów Włosów</b>
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" textAlign={"center"}>
            <b>Dodaj Rozwiązanie Problemu Włosów</b>
          </Typography>
          <Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={1} margin="auto">
                <Grid item xs={12} margin={2}>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between" }}
                  >
                    <Typography sx={{ marginRight: 3 }}>
                      Problem Włosów
                    </Typography>
                    <Select
                      label="Problem Włosów"
                      value={hairProblem}
                      onChange={(e) => setHairProblem(e.target.value)}
                      required
                      sx={{ width: "80%" }}
                    >
                      {hairProblemsData.map((item) => (
                        <MenuItem key={item.Id} value={item.HairProblem}>
                          {item.HairProblem}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                </Grid>
                <Grid item xs={12} margin={2}>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between" }}
                  >
                    <Typography sx={{ marginRight: 3 }}>Rozwiązanie</Typography>
                    <TextField
                      type="text"
                      label="Rozwiązanie"
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      required
                      sx={{ width: "80%" }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} margin={2}>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between" }}
                  >
                    <Typography sx={{ marginRight: 3 }}>Wyjaśnienie</Typography>
                    <TextField
                      type="text"
                      label="Wyjaśnienie"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      sx={{ width: "80%" }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} margin={2}>
                  <Box textAlign={"center"}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      onClick={() => handleAdd()}
                    >
                      Dodaj
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Box>
        </CardContent>
      </Card>
      <DealingHairProblemsTable />
    </Box>
  );
};

export default DealingHairProblems;
