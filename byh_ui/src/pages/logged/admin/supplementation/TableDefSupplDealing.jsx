import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
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

const TableDefSupplDealing = () => {
  const [defsupplIssuesData, setDefsupplIssuesData] = useState([]);
  const [defsupplBloodTests, setDefsupplBloodTests] = useState([]);
  const [defSupplDealing, setDefSupplDealing] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isRevertModalOpen, setRevertModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editIssue, setEditIssue] = useState({
    Id: 0,
    IssueId: "",
    SupplementId: "",
    IssueCategory: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchDefSupplDealing();
    fetchDefSupplIssues();
    fetchDefSupplBloodTests();
  }, []);

  const fetchDefSupplIssues = () => {
    axios
      .get("/api/DefSupplIssues")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        setDefsupplIssuesData(response.data.Data);
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

  const fetchDefSupplDealing = () => {
    axios
      .get("/api/DefSupplDealing")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        setDefSupplDealing(response.data.Data);
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
      IssueId: prod.IssueId,
      SupplementId: prod.SupplementId,
      IssueCategory: prod.IssueCategory,
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
      IssueId: editIssue.IssueId,
      SupplementId: editIssue.SupplementId,
      IssueCategory: editIssue.IssueCategory,
    };

    axios
      .put(`/api/DefSupplDealing/UpdateDefSupplDealing/${editIssue.Id}`, data)
      .then((response) => {
        fetchDefSupplDealing();
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
      .put(`/api/DefSupplDealing/RevDefSupplDealing/${selectedIssue.Id}`)
      .then((response) => {
        console.log(selectedIssue);
        fetchDefSupplDealing();
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
      .put(`/api/DefSupplDealing/DelDefSupplDealing/${selectedIssue.Id}`)
      .then((response) => {
        console.log(selectedIssue);
        fetchDefSupplDealing();
      })
      .catch((error) => {
        console.log(error);
      });

    setSelectedIssue(null);
    setDeleteModalOpen(false);
  };

  const DefSupplIssuesColumns = [
    {
      field: "Id",
      headerName: "ID",
      width: 50,
    },
    {
      field: "IssueId",
      headerName: "ID Problemu",
      width: 100,
    },
    {
      field: "SupplementId",
      headerName: "ID Suplement",
      width: 100,
    },
    {
      field: "Issue",
      headerName: "Problem",
      width: 250,
    },
    {
      field: "IssueCategory",
      headerName: "Kategoria Problemu",
      width: 150,
    },
    {
      field: "Supplement",
      headerName: "Splement",
      width: 150,
    },
    {
      field: "IsDeleted",
      headerName: "Usunięto",
      width: 90,
    },
    {
      field: "action-edit",
      headerName: "Edytuj",
      sortable: false,
      width: 150,
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
                <b>Edytuj Poradę Suplementacji</b>
              </Typography>
              <CardContent sx={{ maxHeight: "600px", overflow: "auto" }}>
                <form onSubmit={handleSubmit}>
                  <Stack direction="row" sx={{ marginBottom: 3 }}>
                    <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                      Wprowadź Problem:{" "}
                    </Typography>
                    <Select
                      value={editIssue.IssueId}
                      onChange={(e) =>
                        setEditIssue({ ...editIssue, IssueId: e.target.value })
                      }
                      required
                      sx={{ width: "25%" }}
                    >
                      {defsupplIssuesData.map((item) => (
                        <MenuItem key={item.Id} value={item.Id}>
                          {item.Issue}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                  <Stack direction="row" sx={{ marginBottom: 3 }}>
                    <Typography sx={{ marginRight: 4, marginLeft: 4 }}>
                      Wprowadź Kategorię:{" "}
                    </Typography>
                    <Select
                      value={editIssue.IssueCategory}
                      onChange={(e) =>
                        setEditIssue({
                          ...editIssue,
                          IssueCategory: e.target.value,
                        })
                      }
                      required
                      sx={{ width: "25%" }}
                    >
                      <MenuItem key="Skóra" value="Skóra">
                        Skóra
                      </MenuItem>
                      <MenuItem key="Włosy" value="Włosy">
                        Włosy
                      </MenuItem>
                      <MenuItem key="Paznokcie" value="Paznokcie">
                        Paznokcie
                      </MenuItem>
                      <MenuItem key="Układ Pokarmowy" value="Układ Pokarmowy">
                        Układ Pokarmowy
                      </MenuItem>
                      <MenuItem key="Funkcjonowanie" value="Funkcjonowanie">
                        Funkcjonowanie
                      </MenuItem>
                    </Select>
                  </Stack>
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
                    Czy na pewno chcesz usunąć poradę dla :{" "}
                    {selectedIssue.Issue}?
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
                    Czy na pewno chcesz przywrócić poradę dla:{" "}
                    {selectedIssue.Issue}?
                  </Typography>
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    Czy na pewno chcesz przywrócić tą poradę?
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
        {defSupplDealing && defSupplDealing.length !== 0 ? (
          <Card sx={{ marginBottom: 5 }}>
            <CardContent>
              <Box>
                <Typography variant="h6" textAlign={"center"} marginBottom={2}>
                  <b>Porady Suplementacjne</b>
                </Typography>
              </Box>
              <div>
                <DataGrid
                  columns={DefSupplIssuesColumns}
                  rows={defSupplDealing.map((prod, index) => ({
                    id: index,
                    Id: prod.Id,
                    IssueId: prod.IssueId,
                    SupplementId: prod.SupplementId,
                    Issue: prod.Issue,
                    IssueCategory: prod.IssueCategory,
                    Supplement: prod.Supplement,
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
              Nie znaleziono Porad Suplementacji w Bazie danych
            </Typography>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default TableDefSupplDealing;
