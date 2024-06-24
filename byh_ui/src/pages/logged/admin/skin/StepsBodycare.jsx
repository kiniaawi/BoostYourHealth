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
import StepsBodycareTable from "./StepsBodycareTable";

const StepsBodycare = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
  ]);
  setCookie("currentPageCookie", "steps-bodycare", { path: "/" });
  const navigate = useNavigate();
  const [skinType, setSkinType] = useState("");
  const [step1, setStep1] = useState("");
  const [step2, setStep2] = useState("");
  const [step3, setStep3] = useState("");
  const [step4, setStep4] = useState("");
  const [step5, setStep5] = useState("");
  const [skinTypesData, setSkinTypesData] = useState([]);
  const [selectedSkinType, setSelectedSkinType] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchSkinTypes();
  }, []);

  const fetchSkinTypes = () => {
    axios
      .get("api/SkinTypesTable/GetOnlyTypes")
      .then((response) => {
        setSkinTypesData(response.data.Data);
        console.log("Skin Types: ", response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddRoutine = () => {
    const data = {
      SkinType: selectedSkinType,
      Step1: step1,
      Step2: step2,
      Step3: step3,
      Step4: step4,
      Step5: step5,
    };

    axios
      .post("/api/BodycareSteps", data)
      .then((response) => {
        alert(response.data.StatusMessage);
        clearTextArea();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const clearTextArea = () => {
    setSkinType("");
    setSelectedSkinType("");
    setStep1("");
    setStep2("");
    setStep3("");
    setStep4("");
    setStep5("");
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
        <b>Panel Kroków Pielęgnacyjnych Ciała</b>
      </Typography>
      <Card>
        <CardHeader
          title={
            <Typography variant="h6" textAlign={"center"}>
              <b>Dodaj Rutynę Pielęgnacyjną</b>
            </Typography>
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Typography>
                <b>Typ Skóry</b>
              </Typography>
              <Select
                label="Typ Skóry"
                value={selectedSkinType}
                onChange={(e) => setSelectedSkinType(e.target.value)}
                required
                sx={{ width: "20%" }}
              >
                {skinTypesData.map((skinTypeSel) => (
                  <MenuItem key={skinTypeSel.Id} value={skinTypeSel.SkinType}>
                    {skinTypeSel.SkinType}
                  </MenuItem>
                ))}
              </Select>
              <Typography>Krok 1</Typography>
              <TextField
                type="text"
                label="Krok 1"
                value={step1}
                onChange={(e) => setStep1(e.target.value)}
              />
            </Stack>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", marginTop: 4 }}
            >
              <Typography>Krok 2</Typography>
              <TextField
                type="text"
                label="Krok 2"
                value={step2}
                onChange={(e) => setStep2(e.target.value)}
              />
              <Typography>Krok 3</Typography>
              <TextField
                type="text"
                label="Krok 3"
                value={step3}
                onChange={(e) => setStep3(e.target.value)}
              />
            </Stack>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", marginTop: 4 }}
            >
              <Typography>Krok 4</Typography>
              <TextField
                type="text"
                label="Krok 4"
                value={step4}
                onChange={(e) => setStep4(e.target.value)}
              />
              <Typography>Krok 5</Typography>
              <TextField
                type="text"
                label="Krok 5"
                value={step5}
                onChange={(e) => setStep5(e.target.value)}
              />
            </Stack>
            <Box sx={{ textAlign: "center", marginTop: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => handleAddRoutine()}
              >
                Dodaj
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
      <Box>
        <StepsBodycareTable />
      </Box>
    </Box>
  );
};

export default StepsBodycare;
