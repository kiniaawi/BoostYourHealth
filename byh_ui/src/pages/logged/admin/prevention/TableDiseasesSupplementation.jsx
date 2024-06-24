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

const TableDiseasesSupplementation = () => {
  const [diseasesData, setDiseasesData] = useState([]);
  const [supplementsData, setSupplementsData] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isRevertModalOpen, setRevertModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editIssue, setEditIssue] = useState({
    Id: 0,
    DiseaseId: 0,
    Supplement: "",
    Description: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchDiseasesData();
    fetchSupplementsData();
  }, []);

  const fetchDiseasesData = () => {
    axios
      .get("/api/Diseases")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        const filteredData = response.data.Data.filter(
          (disease) => disease.Supplementation === "Tak"
        );
        console.log(filteredData);
        setDiseasesData(filteredData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchSupplementsData = () => {
    axios
      .get("/api/DiseasesSupplementation")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        setSupplementsData(response.data.Data);
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
      Supplement: prod.Supplement,
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
      Supplement: editIssue.Supplement,
      Description: editIssue.Description,
    };

    axios
      .put(`/api/DiseasesSupplementation/Update/${editIssue.Id}`, data)
      .then((response) => {
        fetchSupplementsData();
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
      .put(`/api/DiseasesSupplementation/Revert/${selectedIssue.Id}`)
      .then((response) => {
        console.log(selectedIssue);
        fetchSupplementsData();
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
      .put(`/api/DiseasesSupplementation/Delete/${selectedIssue.Id}`)
      .then((response) => {
        console.log(selectedIssue);
        fetchSupplementsData();
      })
      .catch((error) => {
        console.log(error);
      });

    setSelectedIssue(null);
    setDeleteModalOpen(false);
  };

  const SupplColumns = [
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
      field: "Supplement",
      headerName: "Suplement",
      width: 120,
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
                <b>Edytuj Suplementację</b>
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
                      Wprowadź nazwę suplementu:{" "}
                    </Typography>
                    <TextField
                      type="text"
                      label="Nazwa Diety"
                      value={editIssue.Supplement}
                      onChange={(e) =>
                        setEditIssue({
                          ...editIssue,
                          Supplement: e.target.value,
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
                    Czy na pewno chcesz usunąć suplementację dla:{" "}
                    {selectedIssue.DiseaseName}?
                  </Typography>
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    Czy na pewno chcesz usunąc tą suplementację?
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
                    Czy na pewno chcesz przywrócić suplementację dla:{" "}
                    {selectedIssue.DiseaseName}?
                  </Typography>
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    Czy na pewno chcesz przywrócić tą suplementację
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
        {supplementsData && supplementsData.length !== 0 ? (
          <Card sx={{ marginBottom: 5 }}>
            <CardContent>
              <Box>
                <Typography variant="h6" textAlign={"center"} marginBottom={2}>
                  <b>Tabela Suplementacji</b>
                </Typography>
              </Box>
              <div>
                <DataGrid
                  columns={SupplColumns}
                  rows={supplementsData.map((prod, index) => ({
                    id: index,
                    Id: prod.Id,
                    DiseaseId: prod.DiseaseId,
                    DiseaseName: prod.DiseaseName,
                    Supplement: prod.Supplement,
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
            <Typography>Nie Znaleziono suplementacji w Bazie Danych</Typography>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default TableDiseasesSupplementation;
