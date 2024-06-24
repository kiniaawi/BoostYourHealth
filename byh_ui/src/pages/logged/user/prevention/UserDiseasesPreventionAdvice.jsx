import { Box, Button, Card, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const UserDiseasesPreventionAdvice = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
    "userIdCookie",
    "nameCookie",
  ]);
  setCookie("currentPageCookie", "user-diseases-prevention-advice", {
    path: "/",
  });
  const userId = cookies.userIdCookie;
  const userName = cookies.nameCookie;
  const navigate = useNavigate();
  const [userAdviceData, setUserAdviceData] = useState([]);
  const [prevData, setPrevData] = useState([]);
  const [prevId, setPrevId] = useState(null);

  useEffect(() => {
    fetchDiseasesAdvice();
  }, []);

  useEffect(() => {
    if (prevId !== null) {
      fetchPrevention();
    }
  }, [prevId]);

  const fetchDiseasesAdvice = () => {
    axios
      .get(`/api/UserPreventionAdvice/GetUserAdvice/${userId}`)
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data);
        const data = response.data.Data;
        if (data.length > 0) {
          const latestAdvice = data[data.length - 1];
          setUserAdviceData(latestAdvice);
          setPrevId(latestAdvice.PreventionId);

          fetchPrevention();
        } else {
          setUserAdviceData(null);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchPrevention = () => {
    if (prevId !== null) {
      axios
        .get(`/api/UserPreventionAdvice/GetPrevention/${prevId}`)
        .then((response) => {
          console.log(response.data);
          console.log(response.data.Data);
          setPrevData(response.data.Data[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
    doc.save("Porada_Zapobiegania_Chorobom.pdf");
  };

  return (
    <Box flex={12} p={2} sx={{ height: "300vh" }}>
      <Button
        component={Link}
        to="/user-prevention"
        onClick={() => {
          onChangeContent("user-prevention");
          navigate("/user-prevention");
        }}
        size="small"
      >
        <ArrowBackIcon />
        Panel Chorób i ich Zapobiegania
      </Button>
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 3 }}>
        <b>Porada Zapobiegania Chorobom</b>
      </Typography>
      <Button onClick={saveAsPDF}>Zapisz jako PDF</Button>
      {userAdviceData ? (
        <Box>
          <Card sx={{ marginTop: 2 }} id="pdf-content">
            <Typography p={1}>
              <b>
                {userAdviceData.DiagnDate &&
                  format(new Date(userAdviceData.DiagnDate), "dd.MM.yyyy")}{" "}
              </b>
            </Typography>
            <Typography
              variant="h5"
              sx={{ textAlign: "center", marginTop: 3, marginBottom: 4 }}
            >
              <b>{userName}, oto Twoja Porada Zapobiegania Chorbom</b>
            </Typography>
            {userAdviceData && userAdviceData.DiseaseName && (
              <Typography
                variant="h5"
                sx={{ textAlign: "center", marginLeft: 4, marginBottom: 2 }}
              >
                <b>Zapobieganie chorobie: {userAdviceData.DiseaseName}</b>
              </Typography>
            )}
            {userAdviceData.PreventionId && prevData.HowToPrevent && (
              <Typography
                variant="h6"
                sx={{ marginLeft: 4, marginBottom: 2, marginTop: 3 }}
              >
                <b>Jak zapobiegać:</b>
              </Typography>
            )}
            {userAdviceData.PreventionId &&
              prevData.HowToPrevent &&
              [
                ...new Set(
                  prevData.HowToPrevent.split(";").map((item) => item.trim())
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
            {userAdviceData.PreventionId && prevData.Tips && (
              <Typography
                variant="h6"
                sx={{ marginLeft: 4, marginBottom: 2, marginTop: 3 }}
              >
                <b>Warto dodatkowo:</b>
              </Typography>
            )}
            {userAdviceData.PreventionId &&
              prevData.Tips &&
              [
                ...new Set(prevData.Tips.split(";").map((item) => item.trim())),
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
            {userAdviceData.PreventionId && prevData.Description && (
              <Typography
                variant="h6"
                sx={{ marginLeft: 4, marginBottom: 2, marginTop: 3 }}
              >
                <b>Uwaga:</b>
              </Typography>
            )}
            {userAdviceData.PreventionId &&
              prevData.Description &&
              [
                ...new Set(
                  prevData.Description.split(";").map((item) => item.trim())
                ),
              ].map((solution, index) => (
                <Typography
                  variant="h6"
                  sx={{ marginLeft: 4 }}
                  key={index}
                  color="red"
                >
                  <FiberManualRecordIcon />
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
          Brak Danych o Poradach Zapobiegania Chorbom.
        </Typography>
      )}
    </Box>
  );
};

export default UserDiseasesPreventionAdvice;
