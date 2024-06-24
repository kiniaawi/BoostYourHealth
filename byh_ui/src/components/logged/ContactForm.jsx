import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { Box, Button, Card, Stack, TextField, Typography } from "@mui/material";
import logoSmall from "../../logo/BYHlogo1.png";

const ContactForm = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_xo0hv4d",
        "template_8hncef7",
        form.current,
        "2rT-BAlulExfu8MFR"
      )
      .then(
        (result) => {
          console.log(result.text);
          console.log("message sent");
          e.target.reset();
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <Card sx={{ textAlign: "center", p: 6 }}>
      <Stack>
        <Typography>
          <img
            src={logoSmall}
            alt="logo_BYH"
            style={{ width: "auto", height: "15vh" }}
          />
        </Typography>
        <Typography variant="h5" sx={{ marginBottom: 4 }}>
          <b>Jeżeli masz pytania, skontaktuj się z nami!</b>
        </Typography>
      </Stack>
      <form ref={form} onSubmit={sendEmail}>
        <Stack sx={{ width: "35vw", marginLeft: "auto", marginRight: "auto" }}>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", marginBottom: 2 }}
          >
            <Typography variant="h6" sx={{ marginBottom: 1, marginRight: 2 }}>
              Imię
            </Typography>
            <TextField type="text" name="user_name" />
          </Stack>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", marginBottom: 2 }}
          >
            <Typography
              variant="h6"
              sx={{ marginBottom: 1, marginTop: 2, marginRight: 2 }}
            >
              Email
            </Typography>
            <TextField type="email" name="user_email" />
          </Stack>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", marginBottom: 2 }}
          >
            <Typography
              variant="h6"
              sx={{ marginBottom: 1, marginTop: 2, marginRight: 2 }}
            >
              Wiadomość
            </Typography>
            <TextField name="message" multiline rows={4} />
          </Stack>
        </Stack>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 3 }}
        >
          Wyślij
        </Button>
      </form>
    </Card>
  );
};

export default ContactForm;
