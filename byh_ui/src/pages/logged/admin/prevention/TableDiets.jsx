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

const TableDiets = () => {
  const [diseasesData, setDiseasesData] = useState([]);
  const [dietsData, setDietsData] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isRevertModalOpen, setRevertModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editIssue, setEditIssue] = useState({
    Id: 0,
    DiseaseId: 0,
    DietName: "",
    Dos: "",
    Donts: "",
    Description: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchDiseasesData();
    fetchDietssData();
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

  const fetchDietssData = () => {
    axios
      .get("/api/Diets")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        setDietsData(response.data.Data);
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
      DiseaseId: prod.DiseaseId,
      DietName: prod.DietName,
      Dos: prod.Dos,
      Donts: prod.Donts,
      Description: prod.Description,
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
      DiseaseId: editIssue.DiseaseId,
      DietName: editIssue.DietName,
      Dos: editIssue.Dos,
      Donts: editIssue.Donts,
      Description: editIssue.Description,
    };

    axios
      .put(`/api/Diets/UpdateDiet/${editIssue.Id}`, data)
      .then((response) => {
        fetchDietssData();
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
      .put(`/api/Diets/RevDiet/${selectedIssue.Id}`)
      .then((response) => {
        console.log(selectedIssue);
        fetchDietssData();
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
      .put(`/api/Diets/DelDiet/${selectedIssue.Id}`)
      .then((response) => {
        console.log(selectedIssue);
        fetchDietssData();
      })
      .catch((error) => {
        console.log(error);
      });

    setSelectedIssue(null);
    setDeleteModalOpen(false);
  };

  const DietsColumns = [
    {
      field: "Id",
      headerName: "ID",
      width: 50,
    },
    {
      field: "DiseaseId",
      headerName: "ID Choroby",
      width: 50,
    },
    {
      field: "DiseaseName",
      headerName: "Nazwa Choroby",
      width: 150,
    },
    {
      field: "DietName",
      headerName: "Nazwa Diety",
      width: 120,
    },
    {
      field: "Dos",
      headerName: "Wprowadzić",
      width: 100,
    },
    {
      field: "Donts",
      headerName: "Unikać",
      width: 100,
    },
    {
      field: "Description",
      headerName: "Opis",
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
                <b>Edytuj Dietę</b>
              </Typography>
              <CardContent sx={{ maxHeight: "600px", overflow: "auto" }}>
                <form onSubmit={handleSubmit}>
                  <Stack
                    direction="row"
                    sx={{ marginBottom: 3, justifyContent: "center" }}
                  >
                    <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                      Wprowadź Nazwę Choroby:{" "}
                    </Typography>
                    <Select
                      value={editIssue.DiseaseId}
                      onChange={(e) =>
                        setEditIssue({
                          ...editIssue,
                          DiseaseId: e.target.value,
                        })
                      }
                      required
                      sx={{ width: "25%" }}
                    >
                      {diseasesData.map((item) => (
                        <MenuItem key={item.Id} value={item.Id}>
                          {item.DiseaseName}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ marginBottom: 3, justifyContent: "center" }}
                  >
                    <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                      Wprowadź nazwę diety:{" "}
                    </Typography>
                    <TextField
                      type="text"
                      label="Nazwa Diety"
                      value={editIssue.DietName}
                      onChange={(e) =>
                        setEditIssue({
                          ...editIssue,
                          DietName: e.target.value,
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
                      Co należy wprowadzić:{" "}
                    </Typography>
                    <TextField
                      type="text"
                      label="Wprowadzić"
                      value={editIssue.Dos}
                      onChange={(e) =>
                        setEditIssue({
                          ...editIssue,
                          Dos: e.target.value,
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
                      Czego należy unikać:{" "}
                    </Typography>
                    <TextField
                      type="text"
                      label="Unikać"
                      value={editIssue.Donts}
                      onChange={(e) =>
                        setEditIssue({
                          ...editIssue,
                          Donts: e.target.value,
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
                      Opis:{" "}
                    </Typography>
                    <TextField
                      type="text"
                      label="Opis"
                      value={editIssue.Description}
                      onChange={(e) =>
                        setEditIssue({
                          ...editIssue,
                          Description: e.target.value,
                        })
                      }
                      required
                    />
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
                    Czy na pewno chcesz usunąć dietę: {selectedIssue.DietName}?
                  </Typography>
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    Czy na pewno chcesz usunąc tą dietę?
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
                    Czy na pewno chcesz przywrócić dietę:{" "}
                    {selectedIssue.DietName}?
                  </Typography>
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    Czy na pewno chcesz przywrócić tą dietę?
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
        {dietsData && dietsData.length !== 0 ? (
          <Card sx={{ marginBottom: 5 }}>
            <CardContent>
              <Box>
                <Typography variant="h6" textAlign={"center"} marginBottom={2}>
                  <b>Tabela Diet</b>
                </Typography>
              </Box>
              <div>
                <DataGrid
                  columns={DietsColumns}
                  rows={dietsData.map((prod, index) => ({
                    id: index,
                    Id: prod.Id,
                    DiseaseId: prod.DiseaseId,
                    DiseaseName: prod.DiseaseName,
                    DietName: prod.DietName,
                    Dos: prod.Dos,
                    Donts: prod.Donts,
                    Description: prod.Description,
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

export default TableDiets;
