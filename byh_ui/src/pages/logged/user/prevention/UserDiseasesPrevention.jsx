import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const UserDiseasesPrevention = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
    "userIdCookie",
  ]);
  setCookie("currentPageCookie", "user-diseases-prevention", { path: "/" });
  const navigate = useNavigate();
  const userId = cookies.userIdCookie;
  const [userGender, setUserGender] = useState("");
  const [diseaseId, setDiseaseId] = useState("");

  const [diseasesData, setDiseasesData] = useState([]);
  const [visible, setVisible] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchDiseasesData();
  }, []);

  const fetchDiseasesData = () => {
    axios
      .get("/api/Diseases")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        const filteredData = response.data.Data.filter(
          (disease) => disease.Preventable === "Tak"
        );
        console.log(filteredData);
        setDiseasesData(filteredData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmitQuestions = () => {
    const data = {
      UserId: userId,
      UserGender: userGender,
      DiseaseId: diseaseId,
    };

    axios
      .post("/api/UserPreventionAdvice", data)
      .then((response) => {
        alert(response.data.StatusMessage);
        setVisible(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSeeAdvice = () => {
    clearTextArea();
    onChangeContent("user-diseases-prevention-advice");
    navigate("/user-diseases-prevention-advice");
  };

  const clearTextArea = () => {
    setUserGender("");
    setDiseaseId("");
  };

  return (
    <Box p={2} sx={{ height: "300vh" }}>
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
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 5 }}>
        <b>Panel Zapobiegania Chorobom</b>
      </Typography>
      <Card>
        <CardHeader
          title={
            <Typography variant="h6" textAlign={"center"}>
              <b>
                Przejdź przez poniższe pytania, zaznaczając Twoje dolegliwości
              </b>
            </Typography>
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack direction="row" sx={{ marginBottom: 3 }}>
              <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                Podaj płeć:{" "}
              </Typography>
              <Select
                value={userGender}
                onChange={(e) => setUserGender(e.target.value)}
                required
                sx={{ width: "25%" }}
              >
                <MenuItem key="Kobieta" value="Kobieta">
                  Kobieta
                </MenuItem>
                <MenuItem key="Mężczyzna" value="Mężczyzna">
                  Mężczyzna
                </MenuItem>
              </Select>
            </Stack>
            <>
              <Stack direction="column" sx={{ marginTop: 3, marginLeft: 4 }}>
                <Typography sx={{ marginRight: 4, marginBottom: 2 }}>
                  Wybierz chorobę, której chcesz zapobiedz:
                </Typography>
                <Select
                  label="Głowna Dolegliwość"
                  value={diseaseId}
                  onChange={(e) => setDiseaseId(e.target.value)}
                  required
                  sx={{ width: "200px" }}
                >
                  {diseasesData.map((issue) => (
                    <MenuItem key={issue.Id} value={issue.Id}>
                      {issue.DiseaseName}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
              <Box sx={{ textAlign: "center", marginTop: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ marginRight: 4 }}
                  onClick={() => handleSubmitQuestions()}
                >
                  Zapisz Pytania
                </Button>
              </Box>
              {visible && (
                <>
                  <Typography
                    sx={{ marginLeft: 4, marginTop: 4, textAlign: "center" }}
                    color="green"
                  >
                    Twoja Porada przebiegła pomyślnie.
                  </Typography>
                  <Box sx={{ textAlign: "right", marginTop: 3 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{ marginRight: 4 }}
                      onClick={() => handleSeeAdvice()}
                    >
                      Zobacz Poradę
                    </Button>
                  </Box>
                </>
              )}
            </>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDiseasesPrevention;
