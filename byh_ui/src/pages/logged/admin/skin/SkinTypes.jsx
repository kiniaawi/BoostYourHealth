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
import SkinTypesTable from "./SkinTypesTable";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const SkinTypes = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
  ]);
  setCookie("currentPageCookie", "skin-types", { path: "/" });
  const navigate = useNavigate();
  const [skinType, setSkinType] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleAdd = () => {
    const data = {
      SkinType: skinType,
    };

    axios
      .post("api/SkinTypesTable", data)
      .then((response) => {
        alert(response.data.StatusMessage);
      })
      .catch((error) => {
        console.log(error);
      });

    setSkinType("");
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
      <Typography variant="h5" sx={{ textAlign: "center" }}>
        <b>Panel Typów Skóry</b>
      </Typography>
      <Card>
        <CardHeader
          title={
            <Typography variant="h6" textAlign={"center"}>
              <b>Dodaj Typ Skóry</b>
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
                  Wprowadź typ skóry:{" "}
                </Typography>
                <TextField
                  type="text"
                  label="Typ Skóry"
                  value={skinType}
                  onChange={(e) => setSkinType(e.target.value)}
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
        <SkinTypesTable />
      </Box>
    </Box>
  );
};

export default SkinTypes;
