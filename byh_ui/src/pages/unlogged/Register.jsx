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
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import logo from "../../logo/BYHlogo1.png";
import Rightbar from "../../components/unlogged/Rightbar";
import Footer from "../../components/unlogged/Footer";
import Navbar from "../../components/unlogged/Navbar";

const Register = ({
  currentContent,
  setCurrentContent,
  onChangeContent,
  handleChangeContent,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRep, setPasswordRep] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (password === passwordRep) {
      const data = {
        Name: name,
        Email: email,
        Password: password,
      };

      axios
        .post("/api/Registration/Registration", data)
        .then((response) => {
          const dt = response.data;
          if (dt.StatusCode === 200) {
            clearTextArea();
            alert(dt.StatusMessage);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("Nieprawidłowo powtórzone hasło");
    }
  };

  const handleVerify = (value) => {
    console.log("Captcha value: ", value);
    setIsVerified(true);
  };

  const clearTextArea = () => {
    setName("");
    setEmail("");
    setPassword("");
    setPasswordRep("");
  };

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
                <Card variant="outlined" sx={{ maxWidth: "500px" }}>
                  <CardContent>
                    <Box
                      justifyContent={"center"}
                      textAlign={"center"}
                      height={"15vh"}
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
                        <form>
                          <Grid container spacing={2} margin="auto">
                            <Grid item xs={9} margin="auto">
                              <TextField
                                name="email"
                                label="Email"
                                value={email}
                                fullWidth
                                required
                                onChange={(e) => setEmail(e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={9} margin="auto">
                              <TextField
                                name="name"
                                label="Imię"
                                value={name}
                                fullWidth
                                required
                                onChange={(e) => setName(e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={9} margin="auto" marginTop={"20px"}>
                              <TextField
                                type="password"
                                label="Hasło"
                                value={password}
                                fullWidth
                                required
                                name="password"
                                inputProps={{
                                  pattern:
                                    "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]+$",
                                  title:
                                    "Password must contain at least one capital letter, one number, and one special character (@, $, !, %, *, ?, #)",
                                }}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={9} margin="auto">
                              <TextField
                                type="password"
                                label="Powtórz hasło"
                                value={passwordRep}
                                fullWidth
                                required
                                name="password_again"
                                onChange={(e) => setPasswordRep(e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={9} margin="auto">
                              <ReCAPTCHA
                                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                                onChange={handleVerify}
                              />
                              {/* <FormControlLabel
                                required
                                control={<Checkbox />}
                                label="Nie jestem robotem"
                                onChange={handleVerify}
                              /> */}
                            </Grid>
                            <Grid item xs={9} margin="auto" marginTop={"20px"}>
                              <Box display="flex" justifyContent={"center"}>
                                <Button
                                  type="submit"
                                  variant="contained"
                                  color="primary"
                                  fullWidth
                                  onClick={(e) => handleRegister(e)}
                                  disabled={!isVerified}
                                >
                                  Zarejestruj
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </form>
                        <Typography>
                          Masz już konto?{" "}
                          <Link
                            component="button"
                            onClick={() => {
                              onChangeContent("loginPg");
                              navigate("/login");
                            }}
                          >
                            Zaloguj się
                          </Link>
                        </Typography>
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

export default Register;
