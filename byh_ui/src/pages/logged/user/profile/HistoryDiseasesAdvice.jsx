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
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { format } from "date-fns";

const HistoryDiseasesAdvice = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
    "nameCookie",
    "userIdCookie",
  ]);
  setCookie("currentPageCookie", "history-diseases-advices", {
    path: "/",
  });
  const username = cookies.nameCookie;
  const userId = cookies.userIdCookie;
  const navigate = useNavigate();
  const [allAdvices, setAllAdvices] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAdvice, setSelectedAdvice] = useState(null);
  const [dietsData, setDietsData] = useState([]);
  const [supplementationData, setSupplementationData] = useState([]);
  const [workoutsData, setWorkoutsData] = useState([]);

  useEffect(() => {
    fetchAllAdvices();
  }, []);

  const fetchAllAdvices = () => {
    axios
      .get(`/api/UserDiseasesAdvice/GetUserAdvice/${userId}`)
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

      if (prod.WorkoutId !== null) {
        axios
          .get(`/api/UserDiseasesAdvice/GetWorkout/${prod.WorkoutId}`)
          .then((response) => {
            console.log(response.data);
            console.log(response.data.Data);
            setWorkoutsData(response.data.Data[0]);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      if (prod.DietId !== null) {
        axios
          .get(`/api/UserDiseasesAdvice/GetDiet/${prod.DietId}`)
          .then((response) => {
            console.log(response.data);
            console.log(response.data.Data);
            setDietsData(response.data.Data[0]);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      if (prod.SupplementationId !== null) {
        axios
          .get(
            `/api/UserDiseasesAdvice/GetSupplementation/${prod.SupplementationId}`
          )
          .then((response) => {
            console.log(response.data);
            console.log(response.data.Data);
            setSupplementationData(response.data.Data[0]);
          })
          .catch((error) => {
            console.log(error);
          });
      }
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
      .put(`/api/UserDiseasesAdvice/Delete/${selectedAdvice.Id}`)
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

  const SupplAdvicesColumns = [
    {
      field: "Id",
      headerName: "ID",
      width: 50,
    },
    {
      field: "DiseaseName",
      headerName: "Nazwa Choroby",
      width: 300,
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
    <Box flex={12} p={2}>
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
                    Czy na pewno chcesz usunąć poradę dla:{" "}
                    {selectedAdvice.DiseaseName} z dnia{" "}
                    {selectedAdvice.DiagnDate}?
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
                {selectedAdvice && selectedAdvice.length !== 0 ? (
                  <>
                    {selectedAdvice && selectedAdvice.DiseaseName && (
                      <Typography
                        variant="h6"
                        sx={{ marginLeft: 4, marginBottom: 2 }}
                      >
                        {selectedAdvice.DiseaseName}:
                      </Typography>
                    )}
                    {selectedAdvice && selectedAdvice.DietId && (
                      <Typography
                        variant="h5"
                        sx={{ textAlign: "center", marginTop: 5 }}
                      >
                        <b>Dieta: {dietsData.DietName}</b>
                      </Typography>
                    )}
                    {selectedAdvice.DietId && dietsData.Dos && (
                      <Typography
                        variant="h6"
                        sx={{ marginLeft: 4, marginBottom: 2, marginTop: 3 }}
                      >
                        <b>Wprowadzić:</b>
                      </Typography>
                    )}
                    {selectedAdvice.DietId &&
                      dietsData.Dos &&
                      [
                        ...new Set(
                          dietsData.Dos.split(";").map((item) => item.trim())
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
                    {selectedAdvice.DietId && dietsData.Donts && (
                      <Typography
                        variant="h6"
                        sx={{ marginLeft: 4, marginBottom: 2, marginTop: 3 }}
                      >
                        <b>Unikać:</b>
                      </Typography>
                    )}
                    {selectedAdvice.DietId &&
                      dietsData.Donts &&
                      [
                        ...new Set(
                          dietsData.Donts.split(";").map((item) => item.trim())
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
                    {selectedAdvice && selectedAdvice.DietId && (
                      <Typography
                        variant="h6"
                        sx={{ marginLeft: 4, marginTop: 3 }}
                        color="red"
                      >
                        {dietsData.Description}
                      </Typography>
                    )}
                    {selectedAdvice.SupplementationId &&
                      supplementationData.Supplement && (
                        <Typography
                          variant="h5"
                          sx={{ textAlign: "center", marginTop: 5 }}
                        >
                          <b>Suplementacja:</b>
                        </Typography>
                      )}
                    {selectedAdvice.SupplementationId &&
                      supplementationData.Supplement &&
                      [
                        ...new Set(
                          supplementationData.Supplement.split(";").map(
                            (item) => item.trim()
                          )
                        ),
                      ].map((solution, index) => (
                        <Typography
                          variant="h6"
                          sx={{ marginLeft: 4, marginBottom: 2, marginTop: 3 }}
                          key={index}
                        >
                          <NavigateNextIcon />
                          {solution}
                        </Typography>
                      ))}
                    {selectedAdvice && selectedAdvice.SupplementationId && (
                      <Typography
                        variant="h6"
                        sx={{ marginLeft: 4, marginTop: 3 }}
                        color="red"
                      >
                        {supplementationData.Description}
                      </Typography>
                    )}
                    {selectedAdvice && selectedAdvice.WorkoutId && (
                      <Typography
                        variant="h5"
                        sx={{ textAlign: "center", marginTop: 5 }}
                      >
                        <b>Ćwiczenia: {workoutsData.WorkoutName}</b>
                      </Typography>
                    )}
                    {selectedAdvice.WorkoutId && workoutsData.Dos && (
                      <Typography
                        variant="h6"
                        sx={{ marginLeft: 4, marginBottom: 2, marginTop: 3 }}
                      >
                        Wprowadzić:
                      </Typography>
                    )}
                    {selectedAdvice.WorkoutId &&
                      workoutsData.Dos &&
                      [
                        ...new Set(
                          workoutsData.Dos.split(";").map((item) => item.trim())
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
                    {selectedAdvice.DietId && workoutsData.Donts && (
                      <Typography
                        variant="h6"
                        sx={{ marginLeft: 4, marginBottom: 2, marginTop: 3 }}
                      >
                        Unikać:
                      </Typography>
                    )}
                    {selectedAdvice.DietId &&
                      workoutsData.Donts &&
                      [
                        ...new Set(
                          workoutsData.Donts.split(";").map((item) =>
                            item.trim()
                          )
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
                    {selectedAdvice && selectedAdvice.WorkoutId && (
                      <Typography
                        variant="h6"
                        sx={{ marginLeft: 4, marginTop: 3 }}
                        color="red"
                      >
                        {workoutsData.Description}
                      </Typography>
                    )}
                  </>
                ) : (
                  <Box></Box>
                )}

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

      <Box>
        <div style={{ overflow: "auto" }}>
          {allAdvices && allAdvices.length !== 0 ? (
            <Card sx={{ marginBottom: 5 }}>
              <CardContent>
                <div>
                  <DataGrid
                    columns={SupplAdvicesColumns}
                    rows={allAdvices.map((prod, index) => ({
                      id: index,
                      Id: prod.Id,
                      DiseaseId: prod.DiseaseId,
                      DiseaseName: prod.DiseaseName,
                      DietId: prod.DietId,
                      SupplementationId: prod.SupplementationId,
                      WorkoutId: prod.WorkoutId,
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
                Nie znaleziono Porad Chorobowych w Bazie danych
              </Typography>
            </Box>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default HistoryDiseasesAdvice;
