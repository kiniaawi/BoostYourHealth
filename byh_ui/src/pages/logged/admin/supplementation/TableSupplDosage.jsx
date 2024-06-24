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

const TableSupplDosage = () => {
  const [supplDosageData, setSupplDosageData] = useState([]);
  const [defsupplBloodTests, setDefsupplBloodTests] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isRevertModalOpen, setRevertModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editIssue, setEditIssue] = useState({
    Id: 0,
    SupplementId: 0,
    FkgTeen: "",
    MkgTeen: "",
    FkgAdult: "",
    MkgAdult: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchSupplDosage();
    fetchDefSupplBloodTests();
  }, []);

  const fetchSupplDosage = () => {
    axios
      .get("/api/SupplDosage")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        setSupplDosageData(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchDefSupplBloodTests = () => {
    axios
      .get("/api/DefSupplBloodTests")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        setDefsupplBloodTests(response.data.Data);
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
      SupplementId: prod.SupplementId,
      FkgTeen: prod.FkgTeen,
      MkgTeen: prod.MkgTeen,
      FkgAdult: prod.FkgAdult,
      MkgAdult: prod.MkgAdult,
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
      SupplementId: editIssue.SupplementId,
      FkgTeen: editIssue.FkgTeen,
      MkgTeen: editIssue.MkgTeen,
      FkgAdult: editIssue.FkgAdult,
      MkgAdult: editIssue.MkgAdult,
    };

    axios
      .put(`/api/SupplDosage/UpdateSupplDosage/${editIssue.Id}`, data)
      .then((response) => {
        fetchSupplDosage();
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
      .put(`/api/SupplDosage/RevSupplDosage/${selectedIssue.Id}`)
      .then((response) => {
        console.log(selectedIssue);
        fetchSupplDosage();
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
      .put(`/api/SupplDosage/DelSupplDosage/${selectedIssue.Id}`)
      .then((response) => {
        console.log(selectedIssue);
        fetchSupplDosage();
      })
      .catch((error) => {
        console.log(error);
      });

    setSelectedIssue(null);
    setDeleteModalOpen(false);
  };

  const SupplDosageColumns = [
    {
      field: "Id",
      headerName: "ID",
      width: 50,
    },
    {
      field: "SupplementId",
      headerName: "ID Suplement",
      width: 50,
    },
    {
      field: "Supplement",
      headerName: "Suplement",
      width: 120,
    },
    {
      field: "FkgTeen",
      headerName: "Kobieta do 18 lat",
      width: 100,
    },
    {
      field: "MkgTeen",
      headerName: "Mężczyzna do 18 lat",
      width: 100,
    },
    {
      field: "FkgAdult",
      headerName: "Kobieta po 18 lat",
      width: 100,
    },
    {
      field: "MkgAdult",
      headerName: "Mężczyzna po 18 lat",
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
                <b>Edytuj Dawkowanie Suplementu</b>
              </Typography>
              <CardContent sx={{ maxHeight: "600px", overflow: "auto" }}>
                <form onSubmit={handleSubmit}>
                  <Stack direction="row">
                    <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                      Wprowadź Suplement:{" "}
                    </Typography>
                    <Select
                      value={editIssue.SupplementId}
                      onChange={(e) =>
                        setEditIssue({
                          ...editIssue,
                          SupplementId: e.target.value,
                        })
                      }
                      required
                      sx={{ width: "25%" }}
                    >
                      {defsupplBloodTests.map((item) => (
                        <MenuItem key={item.Id} value={item.Id}>
                          {item.Supplement}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                  <Typography
                    variant="h6"
                    sx={{ textAlign: "center", marginBottom: 3 }}
                  >
                    <b>Dawkowanie / kg Masy Ciała</b>
                  </Typography>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", marginTop: 4 }}
                  >
                    <Stack direction="row">
                      <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                        Kobieta do 18 lat:{" "}
                      </Typography>
                      <TextField
                        type="text"
                        label="mg/kg"
                        value={editIssue.FkgTeen}
                        onChange={(e) =>
                          setEditIssue({
                            ...editIssue,
                            FkgTeen: e.target.value,
                          })
                        }
                        required
                      />
                    </Stack>
                    <Stack direction="row">
                      <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                        Mężczyzna do 18 lat:{" "}
                      </Typography>
                      <TextField
                        type="text"
                        label="mg/kg"
                        value={editIssue.MkgTeen}
                        onChange={(e) =>
                          setEditIssue({
                            ...editIssue,
                            MkgTeen: e.target.value,
                          })
                        }
                        required
                      />
                    </Stack>
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", marginTop: 4 }}
                  >
                    <Stack direction="row">
                      <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                        Kobieta powyżej 18 lat:{" "}
                      </Typography>
                      <TextField
                        type="text"
                        label="mg/kg"
                        value={editIssue.FkgAdult}
                        onChange={(e) =>
                          setEditIssue({
                            ...editIssue,
                            FkgAdult: e.target.value,
                          })
                        }
                        required
                      />
                    </Stack>
                    <Stack direction="row">
                      <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                        Mężczyzna powyżej 18 lat:{" "}
                      </Typography>
                      <TextField
                        type="text"
                        label="mg/kg"
                        value={editIssue.MkgAdult}
                        onChange={(e) =>
                          setEditIssue({
                            ...editIssue,
                            MkgAdult: e.target.value,
                          })
                        }
                        required
                      />
                    </Stack>
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
                    Czy na pewno chcesz usunąć dawkowanie dla :{" "}
                    {selectedIssue.Supplement}?
                  </Typography>
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    Czy na pewno chcesz usunąc dawkowanie?
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
                    Czy na pewno chcesz przywrócić dawkowanie dla:{" "}
                    {selectedIssue.Supplement}?
                  </Typography>
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    Czy na pewno chcesz przywrócić to dawkowanie?
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
        {supplDosageData && supplDosageData.length !== 0 ? (
          <Card sx={{ marginBottom: 5 }}>
            <CardContent>
              <Box>
                <Typography variant="h6" textAlign={"center"} marginBottom={2}>
                  <b>Dawkowanie Suplementów</b>
                </Typography>
              </Box>
              <div>
                <DataGrid
                  columns={SupplDosageColumns}
                  rows={supplDosageData.map((prod, index) => ({
                    id: index,
                    Id: prod.Id,
                    SupplementId: prod.SupplementId,
                    Supplement: prod.Supplement,
                    FkgTeen: prod.FkgTeen,
                    MkgTeen: prod.MkgTeen,
                    FkgAdult: prod.FkgAdult,
                    MkgAdult: prod.MkgAdult,
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
              Nie Znaleziono Dawkowań Suplementacji w Bazie Danych
            </Typography>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default TableSupplDosage;
