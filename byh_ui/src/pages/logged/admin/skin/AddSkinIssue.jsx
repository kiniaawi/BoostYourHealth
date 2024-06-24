import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";

const SkinIssues = () => {
  const [skinIssue, setSkinIssue] = useState("");
  const [placement, setPlacement] = useState("");
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
      SkinIssue: skinIssue,
      Placement: placement,
      ImageURL: imageName && imageName.lenght !== 0 ? imageName : "none.png",
    };

    axios
      .post("/api/SkinIssues", data)
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
      .post("/api/SkinIssues/SaveFile", formData)
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
    setSkinIssue("");
    setPlacement("");
    setImageName("");
  };

  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h6" textAlign={"center"}>
            <b>Dodaj Problem Skórny</b>
          </Typography>
          <Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={1} margin="auto">
                <Grid item xs={12} margin={2}>
                  <TextField
                    type="text"
                    label="Problem Skórny"
                    value={skinIssue}
                    onChange={(e) => setSkinIssue(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} margin={2}>
                  <FormControl fullWidth required>
                    <InputLabel id="place-label">Umiejscowienie</InputLabel>
                    <Select
                      labelId="place-label"
                      id="place-select"
                      value={placement}
                      onChange={(e) => setPlacement(e.target.value)}
                    >
                      <MenuItem key="Twarz" value="Twarz">
                        Twarz
                      </MenuItem>
                      <MenuItem key="Plecy" value="Plecy">
                        Plecy
                      </MenuItem>
                      <MenuItem key="Ramiona" value="Ramiona">
                        Ramiona
                      </MenuItem>
                      <MenuItem key="Nogi" value="Nogi">
                        Nogi
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} margin={2}>
                  <input type="file" onChange={(e) => handleImageChange(e)} />
                  <Button onClick={() => handleAddFile()}>Dodaj Plik</Button>
                  {/* <TextField
                      type="text"
                      label="Skin Picture Src"
                      value={image}
                      onChange={(e) =>
                        setImage(
                          '"/skin_issues_pictures/' + e.target.value + '"'
                        )
                      }
                      required
                      fullWidth
                    /> */}
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

export default SkinIssues;
