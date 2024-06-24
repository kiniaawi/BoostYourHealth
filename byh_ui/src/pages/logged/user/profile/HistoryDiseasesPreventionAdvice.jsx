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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { format } from "date-fns";

const HistoryDiseasesPreventionAdvice = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
    "nameCookie",
    "userIdCookie",
  ]);
  setCookie("currentPageCookie", "history-diseases-prevention-advices", {
    path: "/",
  });
  const userId = cookies.userIdCookie;
  const [allAdvices, setAllAdvices] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAdvice, setSelectedAdvice] = useState(null);
  const [prevData, setPrevData] = useState([]);

  useEffect(() => {
    fetchAllAdvices();
  }, []);

  const fetchAllAdvices = () => {
    axios
      .get(`/api/UserPreventionAdvice/GetUserAdvice/${userId}`)
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

      if (prod.PreventionId !== null) {
        axios
          .get(`/api/UserPreventionAdvice/GetPrevention/${prod.PreventionId}`)
          .then((response) => {
            console.log(response.data);
            console.log(response.data.Data);
            setPrevData(response.data.Data[0]);
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
      .put(`/api/UserPreventionAdvice/Delete/${selectedAdvice.Id}`)
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

  const AdvicesColumns = [
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
                        variant="h5"
                        sx={{
                          textAlign: "center",
                          marginLeft: 4,
                          marginBottom: 2,
                        }}
                      >
                        <b>
                          Zapobieganie chorobie: {selectedAdvice.DiseaseName}
                        </b>
                      </Typography>
                    )}
                    {selectedAdvice.PreventionId && prevData.HowToPrevent && (
                      <Typography
                        variant="h6"
                        sx={{ marginLeft: 4, marginBottom: 2, marginTop: 3 }}
                      >
                        <b>Jak zapobiegać:</b>
                      </Typography>
                    )}
                    {selectedAdvice.PreventionId &&
                      prevData.HowToPrevent &&
                      [
                        ...new Set(
                          prevData.HowToPrevent.split(";").map((item) =>
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
                    {selectedAdvice.PreventionId && prevData.Tips && (
                      <Typography
                        variant="h6"
                        sx={{ marginLeft: 4, marginBottom: 2, marginTop: 3 }}
                      >
                        <b>Warto dodatkowo:</b>
                      </Typography>
                    )}
                    {selectedAdvice.PreventionId &&
                      prevData.Tips &&
                      [
                        ...new Set(
                          prevData.Tips.split(";").map((item) => item.trim())
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
                    {selectedAdvice.PreventionId && prevData.Description && (
                      <Typography
                        variant="h6"
                        sx={{ marginLeft: 4, marginBottom: 2, marginTop: 3 }}
                      >
                        <b>Uwaga:</b>
                      </Typography>
                    )}
                    {selectedAdvice.PreventionId &&
                      prevData.Description &&
                      [
                        ...new Set(
                          prevData.Description.split(";").map((item) =>
                            item.trim()
                          )
                        ),
                      ].map((solution, index) => (
                        <Typography
                          variant="h6"
                          sx={{ marginLeft: 4 }}
                          key={index}
                          color="red"
                        >
                          <FiberManualRecordIcon />
                          {solution}
                        </Typography>
                      ))}
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
                    columns={AdvicesColumns}
                    rows={allAdvices.map((prod, index) => ({
                      id: index,
                      Id: prod.Id,
                      DiseaseId: prod.DiseaseId,
                      DiseaseName: prod.DiseaseName,
                      PreventionId: prod.PreventionId,
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
                Nie znaleziono Porad Zapobiegania Chorobom w Bazie danych
              </Typography>
            </Box>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default HistoryDiseasesPreventionAdvice;