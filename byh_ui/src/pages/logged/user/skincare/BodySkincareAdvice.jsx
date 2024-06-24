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

const BodySkincareAdvice = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
    "userIdCookie",
    "nameCookie",
  ]);
  setCookie("currentPageCookie", "body-skincare-advice", {
    path: "/",
  });
  const userId = cookies.userIdCookie;
  const userName = cookies.nameCookie;
  const navigate = useNavigate();
  const [skincareAdviceData, setSkincareAdviceData] = useState([]);

  useEffect(() => {
    fetchBodySkincareSteps();
  }, []);

  const fetchBodySkincareSteps = () => {
    axios
      .get(`/api/BodySkincareAdvice/GetAdvice/${userId}`)
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data);
        const data = response.data.Data;
        if (data.length > 0) {
          const latestAdvice = data[data.length - 1];
          setSkincareAdviceData(latestAdvice);
        } else {
          setSkincareAdviceData(null);
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

    const doc = new jsPDF("p", "mm", "a4");
    const width = doc.internal.pageSize.getWidth();

    const imgWidth = width;
    const imgHeight = (canvas.height * width) / canvas.width;

    doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    doc.save("Porada_Pielęgnacyjna_Ciało.pdf");
  };

  return (
    <Box flex={12} p={2} sx={{ height: "300vh" }}>
      <Button
        component={Link}
        to="/user-skincare"
        onClick={() => {
          onChangeContent("user-skincare");
          navigate("/user-skincare");
        }}
        size="small"
      >
        <ArrowBackIcon />
        Panel Pielęgnacji Skóry
      </Button>
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 3 }}>
        <b>Porada Pielęgnacyjna - Ciało</b>
      </Typography>
      <Button onClick={saveAsPDF}>Zapisz jako PDF</Button>
      {skincareAdviceData ? (
        <Box>
          <Card sx={{ marginTop: 5 }} id="pdf-content">
            <Typography p={1}>
              <b>
                {skincareAdviceData.DiagnDate &&
                  format(
                    new Date(skincareAdviceData.DiagnDate),
                    "dd.MM.yyyy"
                  )}{" "}
              </b>
            </Typography>
            <Typography
              variant="h5"
              sx={{ textAlign: "center", marginTop: 3, marginBottom: 4 }}
            >
              <b>{userName}, oto Twoja Rutyna Pielęgnacyjna:</b>
            </Typography>
            {skincareAdviceData && skincareAdviceData.MainIssue && (
              <Typography variant="h6" sx={{ marginLeft: 4, marginBottom: 2 }}>
                {skincareAdviceData.MainIssue}:
              </Typography>
            )}
            {skincareAdviceData &&
              skincareAdviceData.MainSolution &&
              skincareAdviceData.MainSolution.split(",").map(
                (solution, index) => (
                  <>
                    <Typography
                      variant="h6"
                      sx={{ marginLeft: 4, marginBottom: 2 }}
                      key={index}
                    >
                      <NavigateNextIcon />
                      {solution}
                    </Typography>
                  </>
                )
              )}
            {skincareAdviceData && (
              <Typography
                variant="h6"
                sx={{ marginLeft: 4, marginBottom: 2, marginTop: 5 }}
              >
                Rutyna Pielęgnacyjna:
              </Typography>
            )}
            {skincareAdviceData &&
              skincareAdviceData.Step1 &&
              [
                ...new Set(
                  skincareAdviceData.Step1.split(";").map((item) => item.trim())
                ),
              ].map((solution, index) => (
                <Typography
                  variant="h6"
                  sx={{ marginLeft: 4, marginBottom: 2 }}
                  key={index}
                >
                  <NavigateNextIcon />
                  {solution}
                </Typography>
              ))}
            {skincareAdviceData &&
              skincareAdviceData.Step2 &&
              [
                ...new Set(
                  skincareAdviceData.Step2.split(";").map((item) => item.trim())
                ),
              ].map((solution, index) => (
                <Typography
                  variant="h6"
                  sx={{ marginLeft: 4, marginBottom: 2 }}
                  key={index}
                >
                  <NavigateNextIcon />
                  {solution}
                </Typography>
              ))}
            {skincareAdviceData &&
              skincareAdviceData.Step3 &&
              [
                ...new Set(
                  skincareAdviceData.Step3.split(";").map((item) => item.trim())
                ),
              ].map((solution, index) => (
                <Typography
                  variant="h6"
                  sx={{ marginLeft: 4, marginBottom: 2 }}
                  key={index}
                >
                  <NavigateNextIcon />
                  {solution}
                </Typography>
              ))}
            {skincareAdviceData &&
              skincareAdviceData.Step4 &&
              [
                ...new Set(
                  skincareAdviceData.Step4.split(";").map((item) => item.trim())
                ),
              ].map((solution, index) => (
                <Typography
                  variant="h6"
                  sx={{ marginLeft: 4, marginBottom: 2 }}
                  key={index}
                >
                  <NavigateNextIcon />
                  {solution}
                </Typography>
              ))}
            {skincareAdviceData &&
              skincareAdviceData.Step5 &&
              [
                ...new Set(
                  skincareAdviceData.Step5.split(";").map((item) => item.trim())
                ),
              ].map((solution, index) => (
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
          Brak Danych o Poradach Pielęgnacyjnych.
        </Typography>
      )}
    </Box>
  );
};

export default BodySkincareAdvice;
