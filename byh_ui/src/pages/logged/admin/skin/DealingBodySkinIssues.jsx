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
import DealingBodySkinIssuesTable from "./DealingBodySkinIssuesTable";

const DealingBodySkinIssues = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
  ]);
  setCookie("currentPageCookie", "dealing-body-skinissues", { path: "/" });
  const [skinIssue, setSkinIssue] = useState("");
  const [solution, setSolution] = useState("");
  const [description, setDescription] = useState("");
  const [skinIssuesData, setSkinIssuesData] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchSkinIssues();
  }, []);

  const fetchSkinIssues = () => {
    axios
      .get("/api/SkinIssues")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0].SkinIssue);
        const skinIssuesArray = response.data.Data.filter(
          (item) => item.Placement !== "Twarz"
        ).map((item) => item.SkinIssue);
        console.log(skinIssuesArray);
        setSkinIssuesData(skinIssuesArray);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAdd = () => {
    const data = {
      SkinIssue: skinIssue,
      Solution: solution,
      Description: description,
    };

    axios
      .post("/api/DealingBodySkinIssues", data)
      .then((response) => {
        alert(response.data.StatusMessage);
        clearTextArea();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const clearTextArea = () => {
    setSkinIssue("");
    setSolution("");
    setDescription("");
  };

  return (
    <Box p={2} sx={{ height: "300vh" }}>
      <Button
        component={Link}
        to="/admin-skincare"
        onClick={() => {
          onChangeContent("admin-skincare");
          navigate("/admin-skincare");
        }}
        size="small"
      >
        <ArrowBackIcon />
        Panel Pielęgnacji
      </Button>
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 3 }}>
        <b>Panel Rozwiązań Rroblemów Skórnych - Ciało</b>
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" textAlign={"center"}>
            <b>Dodaj Rozwiązanie Problemu Skórnego</b>
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
                      Problem Skórny
                    </Typography>
                    <Select
                      label="Problem Skórny"
                      value={skinIssue}
                      onChange={(e) => setSkinIssue(e.target.value)}
                      required
                      sx={{ width: "80%" }}
                    >
                      {skinIssuesData.map((skinTypeSel) => (
                        <MenuItem key={skinTypeSel.Id} value={skinTypeSel}>
                          {skinTypeSel}
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
      <DealingBodySkinIssuesTable />
    </Box>
  );
};

export default DealingBodySkinIssues;
