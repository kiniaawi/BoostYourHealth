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
import TableDefSupplBloodTests from "./TableDefSupplBloodTests";
import TableDefSupplDealing from "./TableDefSupplDealing";

const DefSupplDealing = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
  ]);
  setCookie("currentPageCookie", "def-suppl-tests", { path: "/" });
  const navigate = useNavigate();

  const [issueId, setIssueId] = useState("");
  const [supplemetId, setSupplementId] = useState("");
  const [issueCategory, setIssueCategory] = useState("");
  const [defsupplIssuesData, setDefsupplIssuesData] = useState([]);
  const [defsupplBloodTests, setDefsupplBloodTests] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchDefSupplIssues();
    fetchDefSupplBloodTests();
  }, []);

  const fetchDefSupplIssues = () => {
    axios
      .get("/api/DefSupplIssues")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        setDefsupplIssuesData(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
      IssueId: issueId,
      SupplementId: supplemetId,
      IssueCategory: issueCategory,
    };

    axios
      .post("/api/DefSupplDealing/PostData", data)
      .then((response) => {
        alert(response.data.StatusMessage);
        clearTextArea();
      })
      .catch((error) => {
        console.log(error);
      });

    setIssueId("");
    setSupplementId("");
  };

  const clearTextArea = () => {
    setIssueId("");
    setSupplementId("");
    setIssueCategory("");
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
        <b>Panel Porad Suplementacyjnych</b>
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
                Wprowadź Problem:{" "}
              </Typography>
              <Select
                value={issueId}
                onChange={(e) => setIssueId(e.target.value)}
                required
                sx={{ width: "25%" }}
              >
                {defsupplIssuesData.map((item) => (
                  <MenuItem key={item.Id} value={item.Id}>
                    {item.Issue}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack direction="row" sx={{ marginBottom: 3 }}>
              <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                Wprowadź Kategorię:{" "}
              </Typography>
              <Select
                value={issueCategory}
                onChange={(e) => setIssueCategory(e.target.value)}
                required
                sx={{ width: "25%" }}
              >
                <MenuItem key="Skóra" value="Skóra">
                  Skóra
                </MenuItem>
                <MenuItem key="Włosy" value="Włosy">
                  Włosy
                </MenuItem>
                <MenuItem key="Paznokcie" value="Paznokcie">
                  Paznokcie
                </MenuItem>
                <MenuItem key="Układ Pokarmowy" value="Układ Pokarmowy">
                  Układ Pokarmowy
                </MenuItem>
                <MenuItem key="Funkcjonowanie" value="Funkcjonowanie">
                  Funkcjonowanie
                </MenuItem>
              </Select>
            </Stack>
            <Stack direction="row">
              <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                Wprowadź Suplement:{" "}
              </Typography>
              <Select
                value={supplemetId}
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
            <Stack
              direction="row"
              sx={{ justifyContent: "right", marginTop: 4 }}
            >
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
        <TableDefSupplDealing />
      </Box>
    </Box>
  );
};

export default DefSupplDealing;
