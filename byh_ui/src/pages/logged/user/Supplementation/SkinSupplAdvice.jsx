import { Box, Button, Card, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const SkinSupplAdvice = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
    "userIdCookie",
    "nameCookie",
  ]);
  setCookie("currentPageCookie", "skin-suppl-advice", { path: "/" });
  const userId = cookies.userIdCookie;
  const userName = cookies.nameCookie;
  const navigate = useNavigate();
  const [supplAdviceData, setSupplAdviceData] = useState([]);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = () => {
    axios
      .get(`/api/SupplSkinDiagnosticQuestions/GetSkinSupplAdvice/${userId}`)
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data);
        const data = response.data.Data;
        if (data.length > 0) {
          const latestAdvice = data[data.length - 1];
          setSupplAdviceData(latestAdvice);
        } else {
          setSupplAdviceData(null);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const saveAsPDF = async () => {
    const capture = document.getElementById("pdf-content");
    const canvas = await html2canvas(capture);
    const imgData = canvas.toDataURL("image/png");

    const doc = new jsPDF("l", "mm", "a4");
    const width = doc.internal.pageSize.getWidth();

    const imgWidth = width;
    const imgHeight = (canvas.height * width) / canvas.width;

    doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    doc.save("Porada_Suplementacyjna_Skora.pdf");
  };

  return (
    <Box flex={12} p={2} sx={{ height: "300vh" }}>
      <Button
        component={Link}
        to="/user-supplementation"
        onClick={() => {
          onChangeContent("user-supplementation");
          navigate("/user-supplementation");
        }}
        size="small"
      >
        <ArrowBackIcon />
        Panel Suplementacji
      </Button>
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 3 }}>
        <b>Porada Suplementacyjna - Skóra</b>
      </Typography>
      <Button onClick={saveAsPDF}>Zapisz jako PDF</Button>
      {supplAdviceData ? (
        <Box>
          <Card sx={{ marginTop: 5 }} id="pdf-content">
            <Typography p={1}>
              <b>
                {supplAdviceData.DiagnDate &&
                  format(
                    new Date(supplAdviceData.DiagnDate),
                    "dd.MM.yyyy"
                  )}{" "}
              </b>
            </Typography>
            <Typography
              variant="h5"
              sx={{ textAlign: "center", marginTop: 5, marginBottom: 4 }}
            >
              <b>{userName}, oto Twoja Porada Suplementacyjna:</b>
            </Typography>
            {supplAdviceData.Solutions &&
              supplAdviceData.Solutions.split(";").map((solution, index) => (
                <Typography
                  variant="h6"
                  sx={{ marginLeft: 4, marginBottom: 2 }}
                  key={index}
                >
                  <NavigateNextIcon />
                  {solution}
                </Typography>
              ))}
            <Typography
              variant="h5"
              sx={{ textAlign: "center", marginTop: 5, marginBottom: 4 }}
            >
              <b>Dzienne zapotrzebowanie suplementów:</b>
            </Typography>
            {supplAdviceData.SupplDosage &&
              [
                ...new Set(
                  supplAdviceData.SupplDosage.split(";").map((solution) =>
                    solution.trim()
                  )
                ),
              ].map((uniqueSolution, index) => (
                <Typography
                  variant="h6"
                  sx={{ marginLeft: 4, marginBottom: 2 }}
                  key={index}
                >
                  <NavigateNextIcon />
                  {uniqueSolution}
                </Typography>
              ))}
            <Typography
              variant="h6"
              sx={{
                marginTop: 5,
                marginBottom: 4,
                marginLeft: 5,
                marginRight: 5,
              }}
              color="red"
            >
              <b>
                Pamiętaj! Porada ta nie zastępuje profesjonalnej wizyty
                lekarskiej. Przed rozpoczęciem działań zalecana jest wizyta u
                specjalisty.
              </b>
            </Typography>
          </Card>
        </Box>
      ) : (
        <Typography variant="h6" sx={{ textAlign: "center", marginTop: 10 }}>
          Brak danych o poradach suplementacyjnych.
        </Typography>
      )}
    </Box>
  );
};

export default SkinSupplAdvice;
