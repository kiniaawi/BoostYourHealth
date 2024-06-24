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
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const UserBodySkincare = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
    "userIdCookie",
  ]);
  setCookie("currentPageCookie", "user-body-skincare", { path: "/" });
  const navigate = useNavigate();
  const userId = cookies.userIdCookie;
  const [userGender, setUserGender] = useState("");
  const [userAge, setUserAge] = useState("");
  const [pregnantOrFeeding, setPregnantOrFeeding] = useState("");
  const [skinType, setSkinType] = useState("");
  const [mainIssueId, setMainIssueId] = useState("");

  const [allSkinIssues, setAllSkinIssues] = useState([]);
  const [allSkinTypes, setAllSkinTypes] = useState([]);
  const [visible, setVisible] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchBodySkinIssues();
    fetchSkinTypes();
  }, []);

  const fetchSkinTypes = () => {
    axios
      .get("/api/SkinTypesTable")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data);
        setAllSkinTypes(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchBodySkinIssues = () => {
    axios
      .get("/api/SkinIssues/GetBodySkinIssues")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data);
        setAllSkinIssues(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmitQuestions = () => {
    const data = {
      UserId: userId,
      UserGender: userGender,
      UserAge: userAge,
      PregnantOrFeeding: pregnantOrFeeding,
      SkinType: skinType,
      MainIssueId: mainIssueId,
    };

    axios
      .post("/api/BodySkincareAdvice", data)
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
    onChangeContent("body-skincare-advice");
    navigate("/body-skincare-advice");
  };

  const clearTextArea = () => {
    setUserGender("");
    setUserAge("");
    setPregnantOrFeeding("");
    setMainIssueId("");
    setSkinType("");
  };

  return (
    <Box p={2} sx={{ height: "300vh" }}>
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
        Panel Pielęgnacji
      </Button>
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 5 }}>
        <b>Panel Pielęgnacji - Ciało</b>
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
            <Stack direction="row" sx={{ marginBottom: 3, marginTop: 4 }}>
              <Stack direction="row">
                <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                  Podaj Twój typ skóry
                </Typography>
                <Select
                  label="Typ Skóry"
                  value={skinType}
                  onChange={(e) => setSkinType(e.target.value)}
                  required
                  sx={{ width: "200px" }}
                >
                  {allSkinTypes.map((type, index) => (
                    <MenuItem key={index} value={type.SkinType}>
                      {type.SkinType}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Stack>
            <Stack direction="row" sx={{ marginBottom: 3, marginTop: 4 }}>
              <Stack direction="row">
                <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                  Podaj wiek
                </Typography>
                <TextField
                  type="number"
                  label="Wiek"
                  value={userAge}
                  onChange={(e) => setUserAge(e.target.value)}
                  required
                />
              </Stack>
            </Stack>
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
            {userGender === "Kobieta" && (
              <Stack direction="row">
                <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                  Czy jesteś w ciąży bądź karmisz piersią?{" "}
                </Typography>
                <Select
                  value={pregnantOrFeeding}
                  onChange={(e) => setPregnantOrFeeding(e.target.value)}
                  required
                  sx={{ width: "25%" }}
                >
                  <MenuItem key="Tak" value="Tak">
                    Tak
                  </MenuItem>
                  <MenuItem key="Nie" value="Nie">
                    Nie
                  </MenuItem>
                </Select>
              </Stack>
            )}
            <>
              <Stack direction="column" sx={{ marginTop: 3, marginLeft: 4 }}>
                <Typography sx={{ marginRight: 4, marginBottom: 2 }}>
                  Wybierz swoją główną dolegliwość:
                </Typography>
                <Select
                  label="Głowna Dolegliwość"
                  value={mainIssueId}
                  onChange={(e) => setMainIssueId(e.target.value)}
                  required
                  sx={{ width: "200px" }}
                >
                  {allSkinIssues.map((issue) => (
                    <MenuItem key={issue.Id} value={issue.Id}>
                      {issue.SkinIssue}
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
            {userAge !== "" && userAge < 12 ? (
              <Typography sx={{ marginLeft: 4, marginTop: 4 }} color="red">
                Ze względu na wiek poniżej 12 roku życia nie jest wskazana
                zaawansowana pielęgnacja skóry.
              </Typography>
            ) : (
              <Box></Box>
            )}
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserBodySkincare;
