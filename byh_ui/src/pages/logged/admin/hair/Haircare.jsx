import { Box, Button, Grid, Modal, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AddHairProblem from "./AddHairProblem";
import HairProblemsTable from "./HairProblemsTable";

const Haircare = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
  ]);
  setCookie("currentPageCookie", "admin-haircare", { path: "/" });
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSkinIssueClick = () => {
    setAddModalOpen(true);
  };

  const handleModalClose = () => {
    setAddModalOpen(false);
  };

  return (
    <Box flex={12} p={2} height={"200vh"}>
      <Modal
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: "50%",
        }}
        overflow={"auto"}
        open={isAddModalOpen}
        onClose={() => handleModalClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          width="200vw"
          maxWidth="550vw"
          p={3}
          borderRadius={2}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
          padding={3}
        >
          <Grid container spacing={2}>
            <AddHairProblem />
          </Grid>
        </Box>
      </Modal>
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 3 }}>
        <b>Panel Pielęgnacji Włosów</b>
      </Typography>
      <Box sx={{ textAlign: "right", marginBottom: 3 }}>
        <Button onClick={() => handleSkinIssueClick()}>
          <AddIcon />
          Dodaj Problem Włosów
        </Button>
      </Box>
      <Box>
        <Stack direction="row" justifyContent={"space-evenly"}>
          <Button
            component={Link}
            to="/hair-types"
            onClick={() => {
              onChangeContent("hair-types");
              navigate("/hair-types");
            }}
          >
            Typy Włosów
          </Button>
          <Button
            component={Link}
            to="/dealing-hairproblems"
            onClick={() => {
              onChangeContent("dealing-hairproblems");
              navigate("/dealing-hairproblems");
            }}
          >
            Rozwiązania Problemów Włosów
          </Button>
        </Stack>
        <Typography variant="h6">
          <b>Włosy</b>
        </Typography>
        <Stack direction="row" justifyContent={"space-evenly"}>
          <Button
            component={Link}
            to="/haircare-steps"
            onClick={() => {
              onChangeContent("haircare-steps");
              navigate("/haircare-steps");
            }}
          >
            Kroki Pielęgnacyjne
          </Button>
        </Stack>
        <Stack direction="row" justifyContent={"space-evenly"}>
          <Button
            component={Link}
            to="/hair-peelings"
            onClick={() => {
              onChangeContent("hair-peelings");
              navigate("/hair-peelings");
            }}
          >
            Złuszczanie
          </Button>
          <Button
            component={Link}
            to="/shampoos"
            onClick={() => {
              onChangeContent("shampoos");
              navigate("/shampoos");
            }}
          >
            Mycie
          </Button>
          <Button
            component={Link}
            to="/hair-masks"
            onClick={() => {
              onChangeContent("hair-masks");
              navigate("/hair-masks");
            }}
          >
            Maski
          </Button>
          <Button
            component={Link}
            to="/hair-conditioners"
            onClick={() => {
              onChangeContent("hair-conditioners");
              navigate("/hair-conditioners");
            }}
          >
            Odżywki
          </Button>
          <Button
            component={Link}
            to="/hair-oils"
            onClick={() => {
              onChangeContent("hair-oils");
              navigate("/hair-oils");
            }}
          >
            Oleje
          </Button>
        </Stack>
        <Stack direction="row" justifyContent={"space-evenly"}>
          <Button
            component={Link}
            to="/heat-protection"
            onClick={() => {
              onChangeContent("heat-protection");
              navigate("/heat-protection");
            }}
          >
            Termoochrona
          </Button>
          <Button
            component={Link}
            to="/hair-creams"
            onClick={() => {
              onChangeContent("hair-creams");
              navigate("/hair-creams");
            }}
          >
            Kremy
          </Button>
          <Button
            component={Link}
            to="/hair-oils-protection"
            onClick={() => {
              onChangeContent("hair-oils-protection");
              navigate("/hair-oils-protection");
            }}
          >
            Olejki Ochronne
          </Button>
          <Button
            component={Link}
            to="/hair-serums"
            onClick={() => {
              onChangeContent("hair-serums");
              navigate("/hair-serums");
            }}
          >
            Serum
          </Button>
        </Stack>
      </Box>
      <Box sx={{ marginTop: 2 }}>
        <HairProblemsTable />
      </Box>
    </Box>
  );
};

export default Haircare;
