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

const UserDiseasesAdvice = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
    "userIdCookie",
    "nameCookie",
  ]);
  setCookie("currentPageCookie", "user-diseases-advice", {
    path: "/",
  });
  const userId = cookies.userIdCookie;
  const userName = cookies.nameCookie;
  const navigate = useNavigate();
  const [userAdviceData, setUserAdviceData] = useState([]);
  const [dietsData, setDietsData] = useState([]);
  const [supplementationData, setSupplementationData] = useState([]);
  const [workoutsData, setWorkoutsData] = useState([]);
  const [dietId, setDietId] = useState(null);
  const [supplId, setSupplId] = useState(null);
  const [workoutId, setWorkoutId] = useState(null);

  useEffect(() => {
    fetchDiseasesAdvice();
  }, []);

  useEffect(() => {
    if (dietId !== null) {
      fetchDiets();
    }
  }, [dietId]);

  useEffect(() => {
    if (supplId !== null) {
      fetchSupplementation();
    }
  }, [supplId]);

  useEffect(() => {
    if (workoutId !== null) {
      fetchWorkouts();
    }
  }, [workoutId]);

  const fetchDiseasesAdvice = () => {
    axios
      .get(`/api/UserDiseasesAdvice/GetUserAdvice/${userId}`)
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data);
        const data = response.data.Data;
        if (data.length > 0) {
          const latestAdvice = data[data.length - 1];
          setUserAdviceData(latestAdvice);
          setDietId(latestAdvice.DietId);
          setSupplId(latestAdvice.SupplementationId);
          setWorkoutId(latestAdvice.WorkoutId);

          fetchDiets();
          fetchSupplementation();
          fetchWorkouts();
        } else {
          setUserAdviceData(null);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchDiets = () => {
    if (dietId !== null) {
      axios
        .get(`/api/UserDiseasesAdvice/GetDiet/${dietId}`)
        .then((response) => {
          console.log(response.data);
          console.log(response.data.Data);
          setDietsData(response.data.Data[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const fetchSupplementation = () => {
    if (supplId !== null) {
      axios
        .get(`/api/UserDiseasesAdvice/GetSupplementation/${supplId}`)
        .then((response) => {
          console.log(response.data);
          console.log(response.data.Data);
          setSupplementationData(response.data.Data[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const fetchWorkouts = () => {
    if (workoutId !== null) {
      axios
        .get(`/api/UserDiseasesAdvice/GetWorkout/${workoutId}`)
        .then((response) => {
          console.log(response.data);
          console.log(response.data.Data);
          setWorkoutsData(response.data.Data[0]);
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
    doc.save("Porada_Chorobowa.pdf");
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
        <b>Porada Chorobowa</b>
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
              <b>{userName}, oto Twoja Porada Chorobowa</b>
            </Typography>
            {userAdviceData && userAdviceData.DiseaseName && (
              <Typography variant="h6" sx={{ marginLeft: 4, marginBottom: 2 }}>
                {userAdviceData.DiseaseName}:
              </Typography>
            )}
            {userAdviceData && userAdviceData.DietId && (
              <Typography
                variant="h5"
                sx={{ textAlign: "center", marginTop: 5 }}
              >
                <b>Dieta: {dietsData.DietName}</b>
              </Typography>
            )}
            {userAdviceData.DietId && dietsData.Dos && (
              <Typography
                variant="h6"
                sx={{ marginLeft: 4, marginBottom: 2, marginTop: 3 }}
              >
                <b>Wprowadzić:</b>
              </Typography>
            )}
            {userAdviceData.DietId &&
              dietsData.Dos &&
              [
                ...new Set(dietsData.Dos.split(";").map((item) => item.trim())),
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
            {userAdviceData.DietId && dietsData.Donts && (
              <Typography
                variant="h6"
                sx={{ marginLeft: 4, marginBottom: 2, marginTop: 3 }}
              >
                <b>Unikać:</b>
              </Typography>
            )}
            {userAdviceData.DietId &&
              dietsData.Donts &&
              [
                ...new Set(
                  dietsData.Donts.split(";").map((item) => item.trim())
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
            {userAdviceData && userAdviceData.DietId && (
              <Typography
                variant="h6"
                sx={{ marginLeft: 4, marginTop: 3 }}
                color="red"
              >
                {dietsData.Description}
              </Typography>
            )}
            {userAdviceData.SupplementationId &&
              supplementationData.Supplement && (
                <Typography
                  variant="h5"
                  sx={{ textAlign: "center", marginTop: 5 }}
                >
                  <b>Suplementacja:</b>
                </Typography>
              )}
            {userAdviceData.SupplementationId &&
              supplementationData.Supplement &&
              [
                ...new Set(
                  supplementationData.Supplement.split(";").map((item) =>
                    item.trim()
                  )
                ),
              ].map((solution, index) => (
                <Typography
                  variant="h6"
                  sx={{ marginLeft: 4, marginBottom: 2, marginTop: 3 }}
                  key={index}
                >
                  <NavigateNextIcon />
                  {solution}
                </Typography>
              ))}
            {userAdviceData && userAdviceData.SupplementationId && (
              <Typography
                variant="h6"
                sx={{ marginLeft: 4, marginTop: 3 }}
                color="red"
              >
                {supplementationData.Description}
              </Typography>
            )}
            {userAdviceData && userAdviceData.WorkoutId && (
              <Typography
                variant="h5"
                sx={{ textAlign: "center", marginTop: 5 }}
              >
                <b>Ćwiczenia: {workoutsData.WorkoutName}</b>
              </Typography>
            )}
            {userAdviceData.WorkoutId && workoutsData.Dos && (
              <Typography
                variant="h6"
                sx={{ marginLeft: 4, marginBottom: 2, marginTop: 3 }}
              >
                Wprowadzić:
              </Typography>
            )}
            {userAdviceData.WorkoutId &&
              workoutsData.Dos &&
              [
                ...new Set(
                  workoutsData.Dos.split(";").map((item) => item.trim())
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
            {userAdviceData.DietId && workoutsData.Donts && (
              <Typography
                variant="h6"
                sx={{ marginLeft: 4, marginBottom: 2, marginTop: 3 }}
              >
                Unikać:
              </Typography>
            )}
            {userAdviceData.DietId &&
              workoutsData.Donts &&
              [
                ...new Set(
                  workoutsData.Donts.split(";").map((item) => item.trim())
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
            {userAdviceData && userAdviceData.WorkoutId && (
              <Typography
                variant="h6"
                sx={{ marginLeft: 4, marginTop: 3 }}
                color="red"
              >
                {workoutsData.Description}
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
          Brak Danych o Poradach Chorobowych.
        </Typography>
      )}
    </Box>
  );
};

export default UserDiseasesAdvice;
