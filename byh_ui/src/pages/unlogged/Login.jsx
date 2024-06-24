import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCookies } from "react-cookie";
import logo from "../../logo/BYHlogo1.png";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/unlogged/Footer";
import Rightbar from "../../components/unlogged/Rightbar";
import Navbar from "../../components/unlogged/Navbar";
axios.defaults.withCredentials = true;

const Login = ({
  currentContent,
  setCurrentContent,
  onChangeContent,
  handleChangeContent,
}) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "isAdminCookie",
  ]);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = {
      Email: email,
      Password: password,
    };

    axios
      .post("/api/Registration/Login", data)
      .then((response) => {
        const dt = response.data;
        console.log("Response.data.IsAdmin", dt.LoginData.IsAdmin);
        if (dt.StatusCode === 200) {
          setName(dt.LoginData.Name);
          if (dt.LoginData.IsAdmin) {
            setIsAdmin(true);
            console.log("IsAdminTrue: ", isAdmin);
            setCookie("isAdminCookie", dt.LoginData.IsAdmin, { path: "/" });
            setCookie("nameCookie", dt.LoginData.Name, { path: "/" });
            setCookie("emailCookie", dt.LoginData.Email, { path: "/" });
            setCookie("userIdCookie", dt.LoginData.Id, { path: "/" });
            console.log("name: ", name);
            navigate("/admin-home");
          } else {
            setIsAdmin(false);
            if (dt.LoginData.IsDeleted) {
              alert(
                "Twoje konto zostało zablokowane. Skontaktuj się z administracją za pomocą formularza kontaktowego"
              );
            } else {
              if (dt.LoginData.IsActive) {
                alert(
                  "Twoje konto nie jest już aktywne. Skontaktuj się z administracją za pomocą formularza kontaktowego"
                );
              } else {
                console.log("IsAdminFalse: ", isAdmin);
                setCookie("isAdminCookie", dt.LoginData.IsAdmin, {
                  path: "/",
                });
                setCookie("nameCookie", dt.LoginData.Name, { path: "/" });
                setCookie("emailCookie", dt.LoginData.Email, { path: "/" });
                setCookie("userIdCookie", dt.LoginData.Id, { path: "/" });
                navigate("/homepage");
              }
            }
          }
        } else {
          alert(dt.StatusMessage);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log("IsAdmin: ", isAdmin);
  console.log("Name: ", name);
  console.log("Email: ", email);

  return (
    <>
      <Box bgcolor={"background.default"} color={"text.primary"}>
        <Navbar
          title="BYH"
          onChangeContent={handleChangeContent}
          setCurrentContent={setCurrentContent}
        />
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          sx={{ height: "100%", flexGrow: 1 }}
        >
          <Box flex={1} p={2}>
            <Box
              style={{
                marginTop: "auto",
                marginBottom: "0",
                paddingBottom: "100vh",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "80vh",
                }}
              >
                <Card variant="outlined" sx={{ minHeight: "500px" }}>
                  <CardContent>
                    <Box
                      justifyContent={"center"}
                      textAlign={"center"}
                      height={"20vh"}
                    >
                      <Typography>
                        <img
                          src={logo}
                          alt="logo_BYH"
                          style={{ width: "auto", height: "20vh" }}
                        />
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "20px",
                      }}
                    >
                      <Stack
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                      >
                        <form className="login">
                          <Grid container spacing={1} margin="auto">
                            <Grid item xs={12} margin={2}>
                              <TextField
                                type="text"
                                label="Email"
                                className="input-field"
                                autoComplete="off"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={12} margin={2}>
                              <TextField
                                type="password"
                                label="Hasło"
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={12} margin={2}>
                              <div className="button-container">
                                <Button
                                  type="submit"
                                  variant="contained"
                                  color="primary"
                                  fullWidth
                                  onClick={(e) => handleLogin(e)}
                                >
                                  Zaloguj
                                </Button>
                              </div>
                            </Grid>
                          </Grid>
                        </form>
                        <Typography>Nie posiadasz konta?</Typography>
                        <Link
                          component="button"
                          onClick={() => {
                            onChangeContent("registerPg");
                            navigate("/register");
                          }}
                        >
                          Zarejestruj się
                        </Link>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
          <Rightbar />
        </Stack>
        <Footer />
      </Box>
    </>
  );
};

export default Login;
