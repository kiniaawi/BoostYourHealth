import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import axios from "axios";

const TableDiseases = () => {
  const [diseasesData, setDiseasesData] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isRevertModalOpen, setRevertModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editIssue, setEditIssue] = useState({
    Id: 0,
    DiseaseName: "",
    Diet: "",
    Supplementation: "",
    Workout: "",
    Preventable: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchDiseasesData();
  }, []);

  const fetchDiseasesData = () => {
    axios
      .get("/api/Diseases")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        setDiseasesData(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditModalOpen = (prod) => {
    setSelectedIssue(prod);
    console.log(prod);
    setEditModalOpen(true);

    setEditIssue({
      Id: prod.Id,
      DiseaseName: prod.DiseaseName,
      Diet: prod.Diet,
      Supplementation: prod.Supplementation,
      Workout: prod.Workout,
      Preventable: prod.Preventable,
    });

    console.log(editIssue.Id);
  };

  const handleEditModalClose = () => {
    setSelectedIssue(null);
    console.log("handleEditmodalClose");
    setEditModalOpen(false);
  };

  const handleEdit = () => {
    console.log("id", editIssue.Id);
    console.log("editIssue: ", editIssue);

    const data = {
      Id: editIssue.Id,
      DiseaseName: editIssue.DiseaseName,
      Diet: editIssue.Diet,
      Supplementation: editIssue.Supplementation,
      Workout: editIssue.Workout,
      Preventable: editIssue.Preventable,
    };

    axios
      .put(`/api/Diseases/UpdateDisease/${editIssue.Id}`, data)
      .then((response) => {
        fetchDiseasesData();
        console.log("Issue has been edited", response.data);
        handleEditModalClose();
      })
      .catch((error) => {
        console.error("Error during editing issue", error);
      });
  };

  const handleRevertModalOpen = (prod) => {
    setSelectedIssue(prod);
    setRevertModalOpen(true);
  };

  const handleRevertModalClose = () => {
    setSelectedIssue(null);
    setRevertModalOpen(false);
  };

  const handleRevert = () => {
    console.log(selectedIssue);
    axios
      .put(`/api/Diseases/RevDisease/${selectedIssue.Id}`)
      .then((response) => {
        console.log(selectedIssue);
        fetchDiseasesData();
      })
      .catch((error) => {
        console.log(error);
      });

    setSelectedIssue(null);
    setRevertModalOpen(false);
  };

  const handleDeleteModalOpen = (prod) => {
    setSelectedIssue(prod);
    console.log("Delete: ", selectedIssue);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setSelectedIssue(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = () => {
    console.log(selectedIssue);
    axios
      .put(`/api/Diseases/DelDisease/${selectedIssue.Id}`)
      .then((response) => {
        console.log(selectedIssue);
        fetchDiseasesData();
      })
      .catch((error) => {
        console.log(error);
      });

    setSelectedIssue(null);
    setDeleteModalOpen(false);
  };

  const DiseasesColumns = [
    {
      field: "Id",
      headerName: "ID",
      width: 50,
    },
    {
      field: "DiseaseName",
      headerName: "Nazwa Choroby",
      width: 150,
    },
    {
      field: "Diet",
      headerName: "Dieta",
      width: 120,
    },
    {
      field: "Supplementation",
      headerName: "Suplementacja",
      width: 100,
    },
    {
      field: "Workout",
      headerName: "Ćwiczenia",
      width: 100,
    },
    {
      field: "Preventable",
      headerName: "Zapobieganlność",
      width: 100,
    },
    {
      field: "IsDeleted",
      headerName: "Usunięto",
      width: 70,
    },
    {
      field: "action-edit",
      headerName: "Edytuj",
      sortable: false,
      width: 80,
      renderCell: (params) => {
        return (
          <Button
            sx={{ color: "green" }}
            size="small"
            onClick={() => handleEditModalOpen(params.row)}
          >
            <EditIcon />
          </Button>
        );
      },
    },
    {
      field: "action-delete",
      headerName: "Usuń / Przywróć",
      sortable: false,
      width: 150,
      renderCell: (params) => {
        const isDeleted = params.row.IsDeleted === 1;

        return (
          <Button
            sx={{ color: isDeleted ? "blue" : "red" }}
            size="small"
            onClick={() => {
              console.log("Clicked issue:", params.row.Id);
              if (isDeleted) {
                handleRevertModalOpen(params.row);
              } else {
                handleDeleteModalOpen(params.row);
              }
            }}
          >
            {isDeleted ? <AddIcon /> : <DeleteIcon />}
          </Button>
        );
      },
    },
  ];

  return (
    <Box flex={12} p={2}>
      {/* Edit Modal */}
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
        open={isEditModalOpen}
        onClose={() => handleEditModalClose()}
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
              <Typography variant="h5" sx={{ textAlign: "center", p: 3 }}>
                <b>Edytuj Chorobę</b>
              </Typography>
              <CardContent sx={{ maxHeight: "600px", overflow: "auto" }}>
                <form onSubmit={handleSubmit}>
                  <Stack direction="row">
                    <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                      Wprowadź Nazwę Choroby:{" "}
                    </Typography>
                    <TextField
                      type="text"
                      label="Nazwa Choroby"
                      value={editIssue.DiseaseName}
                      onChange={(e) =>
                        setEditIssue({
                          ...editIssue,
                          DiseaseName: e.target.value,
                        })
                      }
                      required
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ marginBottom: 3, justifyContent: "center" }}
                  >
                    <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                      Czy zastosować dietę:{" "}
                    </Typography>
                    <Select
                      value={editIssue.Diet}
                      onChange={(e) =>
                        setEditIssue({
                          ...editIssue,
                          Diet: e.target.value,
                        })
                      }
                      required
                      sx={{ width: "25%" }}
                    >
                      <MenuItem value="Tak">Tak</MenuItem>
                      <MenuItem value="Nie">Nie</MenuItem>
                    </Select>
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ marginBottom: 3, justifyContent: "center" }}
                  >
                    <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                      Czy zastosować suplementację:{" "}
                    </Typography>
                    <Select
                      value={editIssue.Supplementation}
                      onChange={(e) =>
                        setEditIssue({
                          ...editIssue,
                          Supplementation: e.target.value,
                        })
                      }
                      required
                      sx={{ width: "25%" }}
                    >
                      <MenuItem value="Tak">Tak</MenuItem>
                      <MenuItem value="Nie">Nie</MenuItem>
                    </Select>
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ marginBottom: 3, justifyContent: "center" }}
                  >
                    <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                      Czy zastosować ćwiczenia:{" "}
                    </Typography>
                    <Select
                      value={editIssue.Workout}
                      onChange={(e) =>
                        setEditIssue({
                          ...editIssue,
                          Workout: e.target.value,
                        })
                      }
                      required
                      sx={{ width: "25%" }}
                    >
                      <MenuItem value="Tak">Tak</MenuItem>
                      <MenuItem value="Nie">Nie</MenuItem>
                    </Select>
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ marginBottom: 3, justifyContent: "center" }}
                  >
                    <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                      Czy można zapobiegać:{" "}
                    </Typography>
                    <Select
                      value={editIssue.Preventable}
                      onChange={(e) =>
                        setEditIssue({
                          ...editIssue,
                          Preventable: e.target.value,
                        })
                      }
                      required
                      sx={{ width: "25%" }}
                    >
                      <MenuItem value="Tak">Tak</MenuItem>
                      <MenuItem value="Nie">Nie</MenuItem>
                    </Select>
                  </Stack>

                  <Grid item xs={12} sx={{ textAlign: "center", marginTop: 2 }}>
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
                            onClick={handleEdit}
                          >
                            Zapisz
                          </Button>
                          <Button
                            variant="contained"
                            sx={{
                              marginTop: 2,
                              marginLeft: 0.5,
                              textAlign: "center",
                            }}
                            onClick={handleEditModalClose}
                          >
                            Zamknij
                          </Button>
                        </Stack>
                      </Box>
                    </Box>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Box>
      </Modal>

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
                {selectedIssue && selectedIssue.length !== 0 ? (
                  <Typography sx={{ textAlign: "center" }}>
                    Czy na pewno chcesz usunąć chorobę:{" "}
                    {selectedIssue.DiseaseName}?
                  </Typography>
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    Czy na pewno chcesz usunąc tą chorobę?
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

      {/* Revert Modal */}
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
        open={isRevertModalOpen}
        onClose={() => handleRevertModalClose()}
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
                {selectedIssue && selectedIssue.length !== 0 ? (
                  <Typography sx={{ textAlign: "center" }}>
                    Czy na pewno chcesz przywrócić chorobę:{" "}
                    {selectedIssue.DiseaseName}?
                  </Typography>
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    Czy na pewno chcesz przywrócić tą chorobę?
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
                        onClick={handleRevert}
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
                        onClick={handleRevertModalClose}
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

      <div style={{ overflow: "auto" }}>
        {diseasesData && diseasesData.length !== 0 ? (
          <Card sx={{ marginBottom: 5 }}>
            <CardContent>
              <Box>
                <Typography variant="h6" textAlign={"center"} marginBottom={2}>
                  <b>Tabela Chorób</b>
                </Typography>
              </Box>
              <div>
                <DataGrid
                  columns={DiseasesColumns}
                  rows={diseasesData.map((prod, index) => ({
                    id: index,
                    Id: prod.Id,
                    DiseaseName: prod.DiseaseName,
                    Diet: prod.Diet,
                    Supplementation: prod.Supplementation,
                    Workout: prod.Workout,
                    Preventable: prod.Preventable,
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
            <Typography>Nie Znaleziono Chorób w Bazie Danych</Typography>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default TableDiseases;
