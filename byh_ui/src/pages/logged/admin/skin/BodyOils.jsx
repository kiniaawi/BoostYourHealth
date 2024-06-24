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
import { useCookies } from "react-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BodyOilsTable from "./BodyOilsTable";

const BodyOils = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
  ]);
  setCookie("currentPageCookie", "body-oils", { path: "/" });
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [skinType, setSkinType] = useState("");
  const [frequency, setFrequency] = useState("");
  const [minAge, setMinAge] = useState("");
  const [pregnant, setPregnant] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [allProductTypes, setAllProductTypes] = useState([]);
  const [allSkinTypes, setAllSkinTypes] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchProductTypes();
    fetchSkinTypes();
  }, []);

  const fetchProductTypes = () => {
    axios
      .get("/api/DealingBodySkinIssues")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        setAllProductTypes(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchSkinTypes = () => {
    axios
      .get("/api/BodycareSteps")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        setAllSkinTypes(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddProduct = () => {
    const data = {
      ProductName: productName,
      ProductTypeId: productType,
      SkinTypeId: skinType,
      Frequency: frequency,
      MinAge: minAge,
      ImageURL: imageName && imageName.length !== 0 ? imageName : "none.png",
      ForPregnant: pregnant,
    };

    axios
      .post("api/BodyOils", data)
      .then((response) => {
        alert(response.data.StatusMessage);
        clearTextArea();
      })
      .catch((error) => {
        console.log(error);
      });

    setImageName("");
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddFile = () => {
    console.log(image);
    setImageName(image.name);
    console.log("ImageName: ", imageName);

    const formData = new FormData();
    formData.append("file", image);

    axios
      .post("/api/BodyOils/SaveFile", formData)
      .then((response) => {
        alert(response);
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
    setProductName("");
    setProductType("");
    setSkinType("");
    setFrequency("");
    setMinAge("");
    setPregnant("");
    setImageName("");
  };

  return (
    <Box p={2} sx={{ height: "300vh" }}>
      <Button
        component={Link}
        to="/admin-skincare"
        onClick={() => {
          onChangeContent("admin-skincare");
          navigate("/admin-skincare");
        }}
        size="small"
      >
        <ArrowBackIcon />
        Panel Pielęgnacji
      </Button>
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 3 }}>
        <b>Panel Produktów Olejowych</b>
      </Typography>
      <Card>
        <CardHeader
          title={
            <Typography variant="h6" textAlign={"center"}>
              <b>Dodaj Produkt</b>
            </Typography>
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", marginTop: 4 }}
            >
              <Typography>Nazwa Produktu</Typography>
              <TextField
                sx={{ width: "25%" }}
                type="text"
                label="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <Typography>Typ Produktu</Typography>
              <Select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                required
                sx={{ width: "25%" }}
              >
                {allProductTypes.map((item) => (
                  <MenuItem key={item.Id} value={item.Id}>
                    {item.Solution}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", marginTop: 2 }}
            >
              <Typography>Typ Skóry</Typography>
              <Select
                value={skinType}
                onChange={(e) => setSkinType(e.target.value)}
                required
                sx={{ width: "25%" }}
              >
                {allSkinTypes.map((item) => (
                  <MenuItem key={item.Id} value={item.Id}>
                    {item.SkinType}
                  </MenuItem>
                ))}
              </Select>
              <Typography>Częstotliwość</Typography>
              <TextField
                sx={{ width: "25%" }}
                type="text"
                label="Frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              />
            </Stack>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", marginTop: 2 }}
            >
              <Typography>Minimalny Wiek</Typography>
              <TextField
                sx={{ width: "25%" }}
                type="number"
                label="Minimum Age"
                value={minAge}
                onChange={(e) => setMinAge(e.target.value)}
              />
              <Typography>Czy Bezpieczny Przy Ciąży</Typography>
              <Select
                label="Is For Pregnant"
                value={pregnant}
                onChange={(e) => setPregnant(e.target.value)}
                sx={{ width: "25%", marginLeft: 3 }}
              >
                <MenuItem value="Tak">Tak</MenuItem>
                <MenuItem value="Nie">Nie</MenuItem>
              </Select>
            </Stack>
            <Stack
              direction="row"
              sx={{ justifyContent: "center", marginTop: 2 }}
            >
              <input type="file" onChange={(e) => handleImageChange(e)} />
              <Button onClick={() => handleAddFile()}>Dodaj Obraz</Button>
            </Stack>
            <Box sx={{ textAlign: "center", marginTop: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => handleAddProduct()}
              >
                Dodaj Produkt
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
      <Box>
        {" "}
        <BodyOilsTable />
      </Box>
    </Box>
  );
};

export default BodyOils;
