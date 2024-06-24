import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
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

const FunctioningSupplementation = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
    "userIdCookie",
  ]);
  setCookie("currentPageCookie", "functioning-supplementation", { path: "/" });
  const navigate = useNavigate();
  const userId = cookies.userIdCookie;
  const [issueCategory, setIssueCategory] = useState("Funkcjonowanie");
  const [userGender, setUserGender] = useState("");
  const [userAge, setUserAge] = useState("");
  const [pregnantOrFeeding, setPregnantOrFeeding] = useState("");
  const [issueId, setIssueId] = useState([]);
  const [allSkinIssues, setAllSkinIssues] = useState([]);
  const [visible, setVisible] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = () => {
    axios
      .get("/api/DefSupplDealing")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data);
        setAllSkinIssues(response.data.Data);
        setIssueCategory("Funkcjonowanie");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmitQuestions = () => {
    const data = {
      IssueCategory: issueCategory,
      UserId: userId,
      UserGender: userGender,
      UserAge: userAge,
      PregnantOrFeeding: pregnantOrFeeding,
      IssuesId: issueId.join(","),
    };

    axios
      .post("api/SupplFuncDiagnosticQuestions/PostFuncDiagnQuestions", data)
      .then((response) => {
        alert(response.data.StatusMessage);
        setVisible(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSeeAdvice = () => {
    const data = {
      IssueCategory: issueCategory,
      UserId: userId,
      UserGender: userGender,
      UserAge: userAge,
      IssuesId: issueId.join(","),
    };

    axios
      .post("api/SupplFuncDiagnosticQuestions/PostFuncSupplAdvice", data)
      .then((response) => {
        alert(response.data.StatusMessage);
        clearTextArea();
        onChangeContent("functioning-suppl-advice");
        navigate("/functioning-suppl-advice");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const clearTextArea = () => {
    setUserGender("");
    setUserAge("");
    setPregnantOrFeeding("");
    setIssueId("");
  };

  const handleIssueCheckboxChange = (issueIdToAddOrRemove) => {
    setIssueId((prevState) => {
      if (prevState.includes(issueIdToAddOrRemove)) {
        return prevState.filter((id) => id !== issueIdToAddOrRemove);
      } else {
        return [...prevState, issueIdToAddOrRemove];
      }
    });
  };
  return (
    <Box p={2} sx={{ height: "300vh" }}>
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
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 5 }}>
        <b>Panel Suplementacji - Funkcjonowanie</b>
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
            {userGender === "Mężczyzna" ? (
              <>
                <Stack direction="column" sx={{ marginTop: 3, marginLeft: 4 }}>
                  <Typography sx={{ marginRight: 4, marginBottom: 2 }}>
                    Wybierz swoje dolegliwości:
                  </Typography>
                  {[
                    ...new Set(
                      allSkinIssues
                        .filter(
                          (issue) => issue.IssueCategory === "Funkcjonowanie"
                        )
                        .map((issue) => issue.IssueId)
                    ),
                  ].map((uniqueIssueId) => {
                    const issue = allSkinIssues.find(
                      (issue) => issue.IssueId === uniqueIssueId
                    );
                    return (
                      <FormControlLabel
                        key={issue.IssueId}
                        control={
                          <Checkbox
                            checked={issueId.includes(issue.IssueId)}
                            onChange={() =>
                              handleIssueCheckboxChange(issue.IssueId)
                            }
                          />
                        }
                        label={issue.Issue}
                        sx={{ marginLeft: 4 }}
                      />
                    );
                  })}
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
            ) : userGender === "Kobieta" && pregnantOrFeeding === "Nie" ? (
              <>
                <Stack direction="column" sx={{ marginTop: 3, marginLeft: 4 }}>
                  <Typography sx={{ marginRight: 4, marginBottom: 2 }}>
                    Wybierz swoje dolegliwości:
                  </Typography>
                  {[
                    ...new Set(
                      allSkinIssues
                        .filter(
                          (issue) => issue.IssueCategory === "Funkcjonowanie"
                        )
                        .map((issue) => issue.IssueId)
                    ),
                  ].map((uniqueIssueId) => {
                    const issue = allSkinIssues.find(
                      (issue) => issue.IssueId === uniqueIssueId
                    );
                    return (
                      <FormControlLabel
                        key={issue.IssueId}
                        control={
                          <Checkbox
                            checked={issueId.includes(issue.IssueId)}
                            onChange={() =>
                              handleIssueCheckboxChange(issue.IssueId)
                            }
                          />
                        }
                        label={issue.Issue}
                        sx={{ marginLeft: 4 }}
                      />
                    );
                  })}
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
            ) : userGender === "Kobieta" && pregnantOrFeeding === "Tak" ? (
              <Typography sx={{ marginLeft: 4, marginTop: 4 }} color="red">
                Ze względu na ciążę lub karmienie piersią o dokładne wskazówki
                suplementacyjne należy zapytać lekarza.
              </Typography>
            ) : (
              <Box></Box>
            )}
            {userAge !== "" && userAge < 12 ? (
              <Typography sx={{ marginLeft: 4, marginTop: 4 }} color="red">
                Ze względu na wiek poniżej 12 roku życia po poradę
                suplementacyjną należy udać się do lekarza.
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

export default FunctioningSupplementation;
