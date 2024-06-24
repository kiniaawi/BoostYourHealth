import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";

const AddHairProblem = () => {
  const [hairProblem, setHairProblem] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddIssue = () => {
    const data = {
      HairProblem: hairProblem,
      ImageURL: imageName && imageName.lenght !== 0 ? imageName : "none.png",
    };

    axios
      .post("/api/HairProblems", data)
      .then((response) => {
        alert(response.data.StatusMessage);
        clearTextArea();
      })
      .catch((error) => {
        console.log(error);
      });

    setImage("");
    setImageName("");
  };

  const handleAddFile = () => {
    console.log(image);
    setImageName(image.name);
    console.log("ImageName: ", imageName);

    const formData = new FormData();
    formData.append("file", image);

    axios
      .post("/api/HairProblems/SaveFile", formData)
      .then((response) => {
        alert(response.data.StatusMessage);
      })
      .catch((error) => {
        console.log("Error uploading file:", error);
        if (error.response) {
          console.log("Response data:", error.response.data);
          console.log("Response status:", error.response.status);
          console.log("Response headers:", error.response.headers);
        } else if (error.request) {
          console.log("Request data:", error.request);
        } else {
          console.error("Error:", error.message);
        }
      });

    setImage("");
  };

  const clearTextArea = () => {
    setHairProblem("");
    setImageName("");
  };

  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h6" textAlign={"center"}>
            <b>Dodaj Problem Włosów</b>
          </Typography>
          <Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={1} margin="auto">
                <Grid item xs={12} margin={2}>
                  <TextField
                    type="text"
                    label="Problem Włosów"
                    value={hairProblem}
                    onChange={(e) => setHairProblem(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} margin={2}>
                  <input type="file" onChange={(e) => handleImageChange(e)} />
                  <Button onClick={() => handleAddFile()}>Dodaj Plik</Button>
                </Grid>
                <Grid item xs={12} margin={2}>
                  <Box textAlign={"center"}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddIssue()}
                    >
                      Dodaj
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddHairProblem;
