import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { format } from "date-fns";

const HistorySkincareBodyAdvice = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
    "nameCookie",
    "userIdCookie",
  ]);
  const username = cookies.nameCookie;
  const userId = cookies.userIdCookie;
  setCookie("currentPageCookie", "history-skincare-body-advices", {
    path: "/",
  });
  const navigate = useNavigate();
  const [allAdvices, setAllAdvices] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAdvice, setSelectedAdvice] = useState(null);

  useEffect(() => {
    fetchAllAdvices();
  }, []);

  const fetchAllAdvices = () => {
    axios
      .get(`/api/BodySkincareAdvice/GetAdvice/${userId}`)
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        setAllAdvices(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDetailsModalOpen = (prod) => {
    if (prod && prod.Id) {
      setSelectedAdvice(prod);
      console.log("Details for: ", prod);
      setDetailsModalOpen(true);
    }
  };

  const handleDetailsModalClose = () => {
    setSelectedAdvice(null);
    setDetailsModalOpen(false);
  };

  const handleDeleteModalOpen = (prod) => {
    setSelectedAdvice(prod);
    console.log("Delete: ", selectedAdvice);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setSelectedAdvice(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = () => {
    console.log(selectedAdvice);
    axios
      .put(`/api/BodySkincareAdvice/Delete/${selectedAdvice.Id}`)
      .then((response) => {
        console.log(selectedAdvice);
        fetchAllAdvices();
      })
      .catch((error) => {
        console.log(error);
      });

    setSelectedAdvice(null);
    setDeleteModalOpen(false);
  };

  const SkincareAdvicesColumns = [
    {
      field: "Id",
      headerName: "ID",
      width: 50,
    },
    {
      field: "UserId",
      headerName: "Id Użytkownika",
      width: 50,
    },
    {
      field: "UserGender",
      headerName: "Płeć",
      width: 90,
    },
    {
      field: "UserAge",
      headerName: "Wiek",
      width: 50,
    },
    {
      field: "PregnantOrFeeding",
      headerName: "Ciązą",
      width: 50,
    },
    {
      field: "SkinType",
      headerName: "Typ Skóry",
      width: 100,
    },
    {
      field: "MainIssue",
      headerName: "Głowny Problem",
      width: 150,
    },
    {
      field: "MainSolution",
      headerName: "Główne Rozwiązanie",
      width: 150,
    },
    {
      field: "Step1",
      headerName: "Krok 1",
      width: 100,
    },
    {
      field: "Step2",
      headerName: "Krok 2",
      width: 100,
    },
    {
      field: "Step3",
      headerName: "Krok 3",
      width: 100,
    },
    {
      field: "Step4",
      headerName: "Krok 4",
      width: 100,
    },
    {
      field: "Step5",
      headerName: "Krok 5",
      width: 100,
    },
    {
      field: "DiagnDate",
      headerName: "Data Porady",
      width: 100,
    },
    {
      field: "action-delete",
      headerName: "Usuń",
      sortable: false,
      width: 80,
      renderCell: (params) => {
        return (
          <Button
            sx={{ color: "red" }}
            size="small"
            onClick={() => {
              console.log("Clicked issue:", params.row.Id);
              handleDeleteModalOpen(params.row);
            }}
          >
            <DeleteIcon />
          </Button>
        );
      },
    },
    {
      field: "action-details",
      headerName: "Detale",
      sortable: false,
      width: 80,
      renderCell: (params) => {
        return (
          <Button
            sx={{ color: "blue" }}
            size="small"
            onClick={() => {
              console.log("Clicked issue:", params.row.Id);
              handleDetailsModalOpen(params.row);
            }}
          >
            <InfoIcon />
          </Button>
        );
      },
    },
  ];

  return (
    <Box flex={12} p={2} sx={{ height: "300vh" }}>
      {/* Delete Modal */}
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
        open={isDeleteModalOpen}
        onClose={() => handleDeleteModalClose()}
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
            <Card>
              <CardContent>
                {selectedAdvice && selectedAdvice.length !== 0 ? (
                  <Typography sx={{ textAlign: "center" }}>
                    Czy na pewno chcesz usunąć poradę dla problemu{" "}
                    {selectedAdvice.MainIssue}z dnia {selectedAdvice.DiagnDate}?
                  </Typography>
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    Czy na pewno chcesz usunąc tą poradę?
                  </Typography>
                )}

                <Box
                  sx={{
                    textAlign: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    width={"30vw"}
                    sx={{
                      textAlign: "center",
                      justifyContent: "center",
                      margin: "auto",
                    }}
                  >
                    <Stack direction="row" justifyContent={"space-between"}>
                      <Button
                        variant="contained"
                        color="success"
                        sx={{
                          marginTop: 2,
                          marginRight: 0.5,
                          textAlign: "center",
                        }}
                        onClick={handleDelete}
                      >
                        Tak
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          marginTop: 2,
                          marginLeft: 0.5,
                          textAlign: "center",
                        }}
                        onClick={handleDeleteModalClose}
                      >
                        Nie
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Box>
      </Modal>

      {/* Details Modal */}
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
        open={isDetailsModalOpen}
        onClose={() => handleDetailsModalClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          width="200vw"
          maxWidth="550vw"
          height="90vh"
          p={3}
          borderRadius={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            overflow: "auto",
          }}
          padding={3}
        >
          <Grid container spacing={2}>
            <Card>
              <CardContent>
                {selectedAdvice && selectedAdvice.DiagnDate && (
                  <Typography p={1}>
                    <b>{selectedAdvice.DiagnDate}</b>
                  </Typography>
                )}
                <Typography
                  variant="h5"
                  sx={{ textAlign: "center", marginTop: 5, marginBottom: 4 }}
                >
                  <b>Twoja Rutyna Pielęgnacyjna:</b>
                </Typography>
                {selectedAdvice && selectedAdvice.MainIssue && (
                  <Typography
                    variant="h6"
                    sx={{ marginLeft: 4, marginBottom: 2 }}
                  >
                    {selectedAdvice.MainIssue}:
                  </Typography>
                )}
                {selectedAdvice &&
                  selectedAdvice.MainSolution &&
                  selectedAdvice.MainSolution.split(",").map(
                    (solution, index) => (
                      <>
                        <Typography
                          variant="h6"
                          sx={{ marginLeft: 4, marginBottom: 2 }}
                          key={index}
                        >
                          <NavigateNextIcon />
                          {solution}
                        </Typography>
                      </>
                    )
                  )}
                {selectedAdvice && (
                  <Typography
                    variant="h6"
                    sx={{ marginLeft: 4, marginBottom: 2, marginTop: 5 }}
                  >
                    Detale Rutyny:
                  </Typography>
                )}
                {selectedAdvice &&
                  selectedAdvice.Step1 &&
                  [
                    ...new Set(
                      selectedAdvice.Step1.split(";").map((item) => item.trim())
                    ),
                  ].map((solution, index) => (
                    <Typography
                      variant="h6"
                      sx={{ marginLeft: 4, marginBottom: 2 }}
                      key={index}
                    >
                      <NavigateNextIcon />
                      {solution}
                    </Typography>
                  ))}
                {selectedAdvice &&
                  selectedAdvice.Step2 &&
                  [
                    ...new Set(
                      selectedAdvice.Step2.split(";").map((item) => item.trim())
                    ),
                  ].map((solution, index) => (
                    <Typography
                      variant="h6"
                      sx={{ marginLeft: 4, marginBottom: 2 }}
                      key={index}
                    >
                      <NavigateNextIcon />
                      {solution}
                    </Typography>
                  ))}
                {selectedAdvice &&
                  selectedAdvice.Step3 &&
                  [
                    ...new Set(
                      selectedAdvice.Step3.split(";").map((item) => item.trim())
                    ),
                  ].map((solution, index) => (
                    <Typography
                      variant="h6"
                      sx={{ marginLeft: 4, marginBottom: 2 }}
                      key={index}
                    >
                      <NavigateNextIcon />
                      {solution}
                    </Typography>
                  ))}
                {selectedAdvice &&
                  selectedAdvice.Step4 &&
                  [
                    ...new Set(
                      selectedAdvice.Step4.split(";").map((item) => item.trim())
                    ),
                  ].map((solution, index) => (
                    <Typography
                      variant="h6"
                      sx={{ marginLeft: 4, marginBottom: 2 }}
                      key={index}
                    >
                      <NavigateNextIcon />
                      {solution}
                    </Typography>
                  ))}
                {selectedAdvice &&
                  selectedAdvice.Step5 &&
                  [
                    ...new Set(
                      selectedAdvice.Step5.split(";").map((item) => item.trim())
                    ),
                  ].map((solution, index) => (
                    <Typography
                      variant="h6"
                      sx={{ marginLeft: 4, marginBottom: 2 }}
                      key={index}
                    >
                      <NavigateNextIcon />
                      {solution}
                    </Typography>
                  ))}
                <Box sx={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    sx={{
                      marginTop: 2,
                      marginLeft: 0.5,
                      textAlign: "center",
                    }}
                    onClick={handleDetailsModalClose}
                  >
                    Zamknij
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Box>
      </Modal>

      <Button
        component={Link}
        to="/user-profile"
        onClick={() => {
          onChangeContent("user-profile");
          navigate("/user-profile");
        }}
        size="small"
      >
        <ArrowBackIcon />
        Twój Profil
      </Button>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", marginBottom: 3, marginTop: 2 }}
      >
        <b>Historia porad pielęgnacyjnych ciała {username}</b>
      </Typography>
      <Box>
        <div style={{ overflow: "auto" }}>
          {allAdvices && allAdvices.length !== 0 ? (
            <Card sx={{ marginBottom: 5 }}>
              <CardContent>
                <Box>
                  <Typography
                    variant="h6"
                    textAlign={"center"}
                    marginBottom={2}
                  >
                    <b>Rutyny Pielęgnacyjne</b>
                  </Typography>
                </Box>
                <div>
                  <DataGrid
                    columns={SkincareAdvicesColumns}
                    rows={allAdvices.map((prod, index) => ({
                      id: index,
                      Id: prod.Id,
                      UserId: prod.UserId,
                      UserGender: prod.UserGender,
                      UserAge: prod.UserAge,
                      PregnantOrFeeding: prod.PregnantOrFeeding,
                      SkinType: prod.SkinType,
                      MainIssue: prod.MainIssue,
                      MainSolution: prod.MainSolution,
                      Step1: prod.Step1,
                      Step2: prod.Step2,
                      Step3: prod.Step3,
                      Step4: prod.Step4,
                      Step5: prod.Step5,
                      DiagnDate: prod.DiagnDate
                        ? format(new Date(prod.DiagnDate), "dd.MM.yyyy")
                        : "",
                      IsDeleted: prod.IsDeleted,
                    }))}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: 10 },
                      },
                    }}
                    pageSizeOptions={[10, 20, 50]}
                    slots={{ toolbar: GridToolbar }}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Box textAlign={"center"} marginTop={2}>
              <Typography>
                Nie znaleziono Porannych Porad Pielęgnacyjncy w Bazie danych
              </Typography>
            </Box>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default HistorySkincareBodyAdvice;
