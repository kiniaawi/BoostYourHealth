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
import HairCreamsTable from "./HairCreamsTable";

const HairCreams = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
  ]);
  setCookie("currentPageCookie", "hair-creams", { path: "/" });
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [productTypeId, setProductTypeId] = useState("");
  const [hairTypeId, setHairTypeId] = useState("");
  const [frequency, setFrequency] = useState("");
  const [minAge, setMinAge] = useState("");
  const [pregnant, setPregnant] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [allProductTypes, setAllProductTypes] = useState([]);
  const [allHairTypes, setAllHairTypes] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchProductTypes();
    fetchHairTypes();
  }, []);

  const fetchProductTypes = () => {
    axios
      .get("/api/DealingHairProblems")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        setAllProductTypes(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchHairTypes = () => {
    axios
      .get("/api/HaircareSteps")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        setAllHairTypes(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddProduct = () => {
    const data = {
      ProductName: productName,
      ProductTypeId: productTypeId,
      HairTypeId: hairTypeId,
      Frequency: frequency,
      MinAge: minAge,
      ImageURL: imageName && imageName.length !== 0 ? imageName : "none.png",
      ForPregnant: pregnant,
    };

    axios
      .post("api/HairCreams", data)
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
      .post("/api/HairCreams/SaveFile", formData)
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
    setProductTypeId("");
    setHairTypeId("");
    setFrequency("");
    setMinAge("");
    setPregnant("");
    setImageName("");
  };

  return (
    <Box p={2} sx={{ height: "300vh" }}>
      <Button
        component={Link}
        to="/admin-haircare"
        onClick={() => {
          onChangeContent("admin-haircare");
          navigate("/admin-haircare");
        }}
        size="small"
      >
        <ArrowBackIcon />
        Panel Pielęgnacji Włosów
      </Button>
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 3 }}>
        <b>Panel Kremów do Włosów</b>
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
                value={productTypeId}
                onChange={(e) => setProductTypeId(e.target.value)}
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
              <Typography>Typ Włosów</Typography>
              <Select
                value={hairTypeId}
                onChange={(e) => setHairTypeId(e.target.value)}
                required
                sx={{ width: "25%" }}
              >
                {allHairTypes.map((item) => (
                  <MenuItem key={item.Id} value={item.Id}>
                    {item.HairType}
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
        <HairCreamsTable />
      </Box>
    </Box>
  );
};

export default HairCreams;
