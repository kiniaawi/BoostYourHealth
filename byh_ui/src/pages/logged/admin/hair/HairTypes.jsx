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
import HairTypesTable from "./HairTypesTable";

const HairTypes = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
  ]);
  setCookie("currentPageCookie", "hair-types", { path: "/" });
  const navigate = useNavigate();
  const [hairType, setHairType] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleAdd = () => {
    const data = {
      HairType: hairType,
    };

    axios
      .post("api/HairTypesTable", data)
      .then((response) => {
        alert(response.data.StatusMessage);
      })
      .catch((error) => {
        console.log(error);
      });

    setHairType("");
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
      <Typography variant="h5" sx={{ textAlign: "center" }}>
        <b>Panel Typów Włosów</b>
      </Typography>
      <Card>
        <CardHeader
          title={
            <Typography variant="h6" textAlign={"center"}>
              <b>Dodaj Typ Włosów</b>
            </Typography>
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", marginTop: 4 }}
            >
              <Stack direction="row">
                <Typography sx={{ marginRight: 4 }}>
                  Wprowadź typ włosów:{" "}
                </Typography>
                <TextField
                  type="text"
                  label="Typ Włosów"
                  value={hairType}
                  onChange={(e) => setHairType(e.target.value)}
                />
              </Stack>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleAdd()}
              >
                Dodaj
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
      <Box>
        <HairTypesTable />
      </Box>
    </Box>
  );
};

export default HairTypes;
