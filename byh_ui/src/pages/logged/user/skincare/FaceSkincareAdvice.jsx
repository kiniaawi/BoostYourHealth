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

const FaceSkincareAdvice = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
    "userIdCookie",
    "nameCookie",
  ]);
  setCookie("currentPageCookie", "face-skincare-advice", {
    path: "/",
  });
  const userId = cookies.userIdCookie;
  const userName = cookies.nameCookie;
  const navigate = useNavigate();
  const [morningSkincareStepsData, setMorningSkincareStepsData] = useState([]);
  const [eveningSkincareStepsData, setEveningSkincareStepsData] = useState([]);

  useEffect(() => {
    fetchMorningSkincareSteps();
    fetchEveningSkincareSteps();
  }, []);

  const fetchMorningSkincareSteps = () => {
    axios
      .get(`/api/FaceSkincareAdvice/GetMorningFaceSkincareAdvice/${userId}`)
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data);
        const data = response.data.Data;
        if (data.length > 0) {
          const latestAdvice = data[data.length - 1];
          setMorningSkincareStepsData(latestAdvice);
        } else {
          setMorningSkincareStepsData(null);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchEveningSkincareSteps = () => {
    axios
      .get(`/api/FaceSkincareAdvice/GetEveningFaceSkincareAdvice/${userId}`)
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data);
        const data = response.data.Data;
        if (data.length > 0) {
          const latestAdvice = data[data.length - 1];
          setEveningSkincareStepsData(latestAdvice);
        } else {
          setEveningSkincareStepsData(null);
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
    doc.save("Porada_Pielęgnacyjna_Twarz.pdf");
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
        <b>Porada Pielęgnacyjna - Twarz</b>
      </Typography>
      <Button onClick={saveAsPDF}>Zapisz jako PDF</Button>
      {morningSkincareStepsData ? (
        <Box>
          <Card sx={{ marginTop: 5 }} id="pdf-content">
            <Typography p={1}>
              <b>
                {morningSkincareStepsData.DiagnDate &&
                  format(
                    new Date(morningSkincareStepsData.DiagnDate),
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
            {morningSkincareStepsData && morningSkincareStepsData.MainIssue && (
              <Typography variant="h6" sx={{ marginLeft: 4, marginBottom: 2 }}>
                {morningSkincareStepsData.MainIssue}:
              </Typography>
            )}
            {morningSkincareStepsData &&
              morningSkincareStepsData.MainSolution &&
              morningSkincareStepsData.MainSolution.split(",").map(
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
            {morningSkincareStepsData &&
              morningSkincareStepsData.SecondIssue && (
                <Typography
                  variant="h6"
                  sx={{ marginLeft: 4, marginBottom: 2, marginTop: 5 }}
                >
                  {morningSkincareStepsData.SecondIssue}:
                </Typography>
              )}
            {morningSkincareStepsData &&
              morningSkincareStepsData.SecondSolution &&
              morningSkincareStepsData.SecondSolution.split(",").map(
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
            {morningSkincareStepsData && (
              <Typography
                variant="h6"
                sx={{ marginLeft: 4, marginBottom: 2, marginTop: 5 }}
              >
                Poranna Rutyna Pielęgnacyjna:
              </Typography>
            )}
            {morningSkincareStepsData &&
              morningSkincareStepsData.Step1 &&
              [
                ...new Set(
                  morningSkincareStepsData.Step1.split(";").map((item) =>
                    item.trim()
                  )
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
            {morningSkincareStepsData &&
              morningSkincareStepsData.Step2 &&
              [
                ...new Set(
                  morningSkincareStepsData.Step2.split(";").map((item) =>
                    item.trim()
                  )
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
            {morningSkincareStepsData &&
              morningSkincareStepsData.Step3 &&
              [
                ...new Set(
                  morningSkincareStepsData.Step3.split(";").map((item) =>
                    item.trim()
                  )
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
            {morningSkincareStepsData &&
              morningSkincareStepsData.Step4 &&
              [
                ...new Set(
                  morningSkincareStepsData.Step4.split(";").map((item) =>
                    item.trim()
                  )
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
            {morningSkincareStepsData &&
              morningSkincareStepsData.Step5 &&
              [
                ...new Set(
                  morningSkincareStepsData.Step5.split(";").map((item) =>
                    item.trim()
                  )
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
            {morningSkincareStepsData &&
              morningSkincareStepsData.Step6 &&
              [
                ...new Set(
                  morningSkincareStepsData.Step6.split(";").map((item) =>
                    item.trim()
                  )
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
            {morningSkincareStepsData &&
              morningSkincareStepsData.Step7 &&
              [
                ...new Set(
                  morningSkincareStepsData.Step7.split(";").map((item) =>
                    item.trim()
                  )
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
            {morningSkincareStepsData &&
              morningSkincareStepsData.Step8 &&
              [
                ...new Set(
                  morningSkincareStepsData.Step8.split(";").map((item) =>
                    item.trim()
                  )
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
            {morningSkincareStepsData &&
              morningSkincareStepsData.Step9 &&
              [
                ...new Set(
                  morningSkincareStepsData.Step9.split(";").map((item) =>
                    item.trim()
                  )
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
            {morningSkincareStepsData &&
              morningSkincareStepsData.Step10 &&
              [
                ...new Set(
                  morningSkincareStepsData.Step10.split(";").map((item) =>
                    item.trim()
                  )
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
            {eveningSkincareStepsData && (
              <Typography
                variant="h6"
                sx={{ marginLeft: 4, marginBottom: 2, marginTop: 5 }}
              >
                Wieczorna Rutyna Pielęgnacyjna:
              </Typography>
            )}
            {eveningSkincareStepsData &&
              eveningSkincareStepsData.Step1 &&
              [
                ...new Set(
                  eveningSkincareStepsData.Step1.split(";").map((item) =>
                    item.trim()
                  )
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
            {eveningSkincareStepsData &&
              eveningSkincareStepsData.Step2 &&
              [
                ...new Set(
                  eveningSkincareStepsData.Step2.split(";").map((item) =>
                    item.trim()
                  )
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
            {eveningSkincareStepsData &&
              eveningSkincareStepsData.Step3 &&
              [
                ...new Set(
                  eveningSkincareStepsData.Step3.split(";").map((item) =>
                    item.trim()
                  )
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
            {eveningSkincareStepsData &&
              eveningSkincareStepsData.Step4 &&
              [
                ...new Set(
                  eveningSkincareStepsData.Step4.split(";").map((item) =>
                    item.trim()
                  )
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
            {eveningSkincareStepsData &&
              eveningSkincareStepsData.Step5 &&
              [
                ...new Set(
                  eveningSkincareStepsData.Step5.split(";").map((item) =>
                    item.trim()
                  )
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
            {eveningSkincareStepsData &&
              eveningSkincareStepsData.Step6 &&
              [
                ...new Set(
                  eveningSkincareStepsData.Step6.split(";").map((item) =>
                    item.trim()
                  )
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
            {eveningSkincareStepsData &&
              eveningSkincareStepsData.Step7 &&
              [
                ...new Set(
                  eveningSkincareStepsData.Step7.split(";").map((item) =>
                    item.trim()
                  )
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
            {eveningSkincareStepsData &&
              eveningSkincareStepsData.Step8 &&
              [
                ...new Set(
                  eveningSkincareStepsData.Step8.split(";").map((item) =>
                    item.trim()
                  )
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
            {eveningSkincareStepsData &&
              eveningSkincareStepsData.Step9 &&
              [
                ...new Set(
                  eveningSkincareStepsData.Step9.split(";").map((item) =>
                    item.trim()
                  )
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
            {eveningSkincareStepsData &&
              eveningSkincareStepsData.Step10 &&
              [
                ...new Set(
                  eveningSkincareStepsData.Step10.split(";").map((item) =>
                    item.trim()
                  )
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
            {eveningSkincareStepsData &&
              eveningSkincareStepsData.PregnantOrFeeding === "Tak" && (
                <Typography sx={{ marginLeft: 4, marginTop: 5 }} color="red">
                  Podczas okresu ciąży nie używaj żadnej postaci RETINOIDÓW!
                </Typography>
              )}
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
          Brak danych o poradach pielęgnacyjnych.
        </Typography>
      )}
    </Box>
  );
};

export default FaceSkincareAdvice;
