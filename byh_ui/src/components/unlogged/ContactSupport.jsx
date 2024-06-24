import React from "react";
import { Box, Card, CardContent, Stack } from "@mui/material";
import Footer from "../../components/unlogged/Footer";
import Navbar from "../../components/unlogged/Navbar";
import ContactForm from "../logged/ContactForm";

const ContactSupport = ({
  currentContent,
  setCurrentContent,
  onChangeContent,
}) => {
  return (
    <>
      <Box
        bgcolor={"background.default"}
        color={"text.primary"}
        sx={{ backgroundColor: "#f2efe6" }}
      >
        <Navbar title="BYH" />
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
                <Card variant="outlined">
                  <CardContent>
                    <ContactForm />
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        </Stack>
        <Footer />
      </Box>
    </>
  );
};

export default ContactSupport;
