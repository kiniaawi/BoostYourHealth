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

const SkinSupplementation = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
    "userIdCookie",
  ]);
  setCookie("currentPageCookie", "skin-supplementation", { path: "/" });
  const navigate = useNavigate();
  const userId = cookies.userIdCookie;
  const [issueCategorySkin, setIssueCategorySkin] = useState("Skóra");
  const [userGenderSkin, setUserGenderSkin] = useState("");
  const [userAgeSkin, setUserAgeSkin] = useState("");
  const [pregnantOrFeedingSkin, setPregnantOrFeedingSkin] = useState("");
  const [issueIdSkin, setIssueIdSkin] = useState([]);
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
        setIssueCategorySkin("Skóra");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmitQuestions = () => {
    const data = {
      IssueCategory: issueCategorySkin,
      UserId: userId,
      UserGender: userGenderSkin,
      UserAge: userAgeSkin,
      PregnantOrFeeding: pregnantOrFeedingSkin,
      IssuesId: issueIdSkin.join(","),
    };

    axios
      .post("api/SupplSkinDiagnosticQuestions/PostSkinDiagnQuestions", data)
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
      IssueCategory: issueCategorySkin,
      UserId: userId,
      UserGender: userGenderSkin,
      UserAge: userAgeSkin,
      IssuesId: issueIdSkin.join(","),
    };

    axios
      .post("api/SupplSkinDiagnosticQuestions/PostSkinSupplAdvice", data)
      .then((response) => {
        alert(response.data.StatusMessage);
        clearTextArea();
        onChangeContent("skin-suppl-advice");
        navigate("/skin-suppl-advice");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const clearTextArea = () => {
    setUserGenderSkin("");
    setUserAgeSkin("");
    setPregnantOrFeedingSkin("");
    setIssueIdSkin("");
  };

  const handleIssueCheckboxChange = (issueIdToAddOrRemove) => {
    setIssueIdSkin((prevState) => {
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
        <b>Panel Suplementacji - Skóra</b>
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
                  value={userAgeSkin}
                  onChange={(e) => setUserAgeSkin(e.target.value)}
                  required
                />
              </Stack>
            </Stack>
            <Stack direction="row" sx={{ marginBottom: 3 }}>
              <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                Podaj płeć:{" "}
              </Typography>
              <Select
                value={userGenderSkin}
                onChange={(e) => setUserGenderSkin(e.target.value)}
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
            {userGenderSkin === "Kobieta" && (
              <Stack direction="row">
                <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                  Czy jesteś w ciąży bądź karmisz piersią?{" "}
                </Typography>
                <Select
                  value={pregnantOrFeedingSkin}
                  onChange={(e) => setPregnantOrFeedingSkin(e.target.value)}
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
            {userGenderSkin === "Mężczyzna" ? (
              <>
                <Stack direction="column" sx={{ marginTop: 3, marginLeft: 4 }}>
                  <Typography sx={{ marginRight: 4, marginBottom: 2 }}>
                    Wybierz swoje dolegliwości:
                  </Typography>
                  {[
                    ...new Set(
                      allSkinIssues
                        .filter((issue) => issue.IssueCategory === "Skóra")
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
                            checked={issueIdSkin.includes(issue.IssueId)}
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
            ) : userGenderSkin === "Kobieta" &&
              pregnantOrFeedingSkin === "Nie" ? (
              <>
                <Stack direction="column" sx={{ marginTop: 3, marginLeft: 4 }}>
                  <Typography sx={{ marginRight: 4, marginBottom: 2 }}>
                    Wybierz swoje dolegliwości:
                  </Typography>
                  {[
                    ...new Set(
                      allSkinIssues
                        .filter((issue) => issue.IssueCategory === "Skóra")
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
                            checked={issueIdSkin.includes(issue.IssueId)}
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
            ) : userGenderSkin === "Kobieta" &&
              pregnantOrFeedingSkin === "Tak" ? (
              <Typography sx={{ marginLeft: 4, marginTop: 4 }} color="red">
                Ze względu na ciążę lub karmienie piersią o dokładne wskazówki
                suplementacyjne należy zapytać lekarza.
              </Typography>
            ) : (
              <Box></Box>
            )}
            {userAgeSkin !== "" && userAgeSkin < 12 ? (
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

export default SkinSupplementation;
