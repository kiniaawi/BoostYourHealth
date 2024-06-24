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

const DealingHairProblemsTable = ({}) => {
  const [solutionsData, setSolutionsData] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isRevertModalOpen, setRevertModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [hairProblemsData, setHairProblemsData] = useState([]);
  const [editSolution, setEditSolution] = useState({
    Id: 0,
    HairProblem: "",
    Solution: "",
    Description: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchSolutions();
    fetchHairProblems();
  }, []);

  const fetchHairProblems = () => {
    axios
      .get("/api/HairProblems")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0].HairProblem);
        setHairProblemsData(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchSolutions = () => {
    axios
      .get("/api/DealingHairProblems")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data);
        setSolutionsData(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditModalOpen = (sol) => {
    setSelectedProblem(sol);
    console.log(sol);
    setEditModalOpen(true);

    setEditSolution({
      Id: sol.Id,
      HairProblem: sol.HairProblem,
      Solution: sol.Solution,
      Description: sol.Description,
    });

    console.log(editSolution.Id);
  };

  const handleEditModalClose = () => {
    setSelectedProblem(null);
    console.log("handleEditmodalClose");
    setEditModalOpen(false);
  };

  const handleEdit = () => {
    console.log("id", editSolution.Id);
    console.log("editSolution: ", editSolution);

    const data = {
      Id: editSolution.Id,
      HairProblem: editSolution.HairProblem,
      Solution: editSolution.Solution,
      Description: editSolution.Description,
    };

    axios
      .put(`/api/DealingHairProblems/Update/${editSolution.Id}`, data)
      .then((response) => {
        fetchSolutions();
        console.log("Data has been edited", response.data);
        handleEditModalClose();
      })
      .catch((error) => {
        console.error("Error during editing issue", error);
      });
  };

  const handleRevertModalOpen = (sol) => {
    setSelectedProblem(sol);
    setRevertModalOpen(true);
  };

  const handleRevertModalClose = () => {
    setSelectedProblem(null);
    setRevertModalOpen(false);
  };

  const handleRevert = () => {
    console.log(selectedProblem);
    axios
      .put(`/api/DealingHairProblems/Revert/${selectedProblem.Id}`)
      .then((response) => {
        console.log(selectedProblem);
        fetchSolutions();
      })
      .catch((error) => {
        console.log(error);
      });

    setSelectedProblem(null);
    setRevertModalOpen(false);
  };

  const handleDeleteModalOpen = (sol) => {
    setSelectedProblem(sol);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setSelectedProblem(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = () => {
    console.log(selectedProblem);
    axios
      .put(`/api/DealingHairProblems/Delete/${selectedProblem.Id}`)
      .then((response) => {
        console.log(selectedProblem);
        fetchSolutions();
      })
      .catch((error) => {
        console.log(error);
      });

    setSelectedProblem(null);
    setDeleteModalOpen(false);
  };

  const SolutionsColumns = [
    {
      field: "Id",
      headerName: "ID",
      width: 50,
    },
    {
      field: "HairProblem",
      headerName: "Problem Włosów",
      width: 190,
    },
    {
      field: "Solution",
      headerName: "Rozwiązanie",
      width: 150,
    },
    {
      field: "Description",
      headerName: "Wyjaśnienie",
      width: 100,
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
      width: 100,
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
      headerName: "Usuń / Przywróc",
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
      {/* Edit Issue Modal */}
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
                <b>Edytuj Rozwiązanie Problemu Włosów</b>
              </Typography>
              <CardContent sx={{ maxHeight: "600px", overflow: "auto" }}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={1} margin="auto">
                    <Grid item xs={12} margin={2}>
                      <Stack
                        direction="row"
                        sx={{ justifyContent: "space-between" }}
                      >
                        <Typography sx={{ marginRight: 3 }}>
                          Problem Skórny
                        </Typography>
                        <Select
                          label="Problem Skórny"
                          value={editSolution.HairProblem}
                          onChange={(e) =>
                            setEditSolution({
                              ...editSolution,
                              HairProblem: e.target.value,
                            })
                          }
                          required
                          sx={{ width: "80%" }}
                        >
                          {hairProblemsData.map((item) => (
                            <MenuItem key={item.Id} value={item.HairProblem}>
                              {item.HairProblem}
                            </MenuItem>
                          ))}
                        </Select>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} margin={2}>
                      <Stack
                        direction="row"
                        sx={{ justifyContent: "space-between" }}
                      >
                        <Typography sx={{ marginRight: 3 }}>
                          Rozwiązanie
                        </Typography>
                        <TextField
                          type="text"
                          label="Rozwiązanie"
                          value={editSolution.Solution}
                          onChange={(e) =>
                            setEditSolution({
                              ...editSolution,
                              Solution: e.target.value,
                            })
                          }
                          required
                          sx={{ width: "80%" }}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} margin={2}>
                      <Stack
                        direction="row"
                        sx={{ justifyContent: "space-between" }}
                      >
                        <Typography sx={{ marginRight: 3 }}>
                          Rozwiązanie
                        </Typography>
                        <TextField
                          type="text"
                          label="Rozwiązanie"
                          value={editSolution.Description}
                          onChange={(e) =>
                            setEditSolution({
                              ...editSolution,
                              Description: e.target.value,
                            })
                          }
                          required
                          sx={{ width: "80%" }}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
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

      {/* Delete Issue Modal */}
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
                {selectedProblem && selectedProblem.length !== 0 ? (
                  <Typography sx={{ textAlign: "center" }}>
                    Czy na pewno chcesz usunąc Problem Włosów:{" "}
                    {selectedProblem.HairProblem}?
                  </Typography>
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    Czy na pewno chcesz usunąc Problem Włosów?
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

      {/* Revert Issue Modal */}
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
                {selectedProblem && selectedProblem.length !== 0 ? (
                  <Typography x={{ textAlign: "center" }}>
                    Czy na pewno chcesz przywrócić Problem Włosów:{" "}
                    {selectedProblem.HairProblem}?
                  </Typography>
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    Czy na pewno chcesz przywrócić Problem Włosów?
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
        {solutionsData && solutionsData.length !== 0 ? (
          <Card style={{ height: "80vh" }}>
            <CardContent>
              <Box>
                <Typography variant="h6" textAlign={"center"} marginBottom={1}>
                  <b>Rozwiązanie Problemów Skórnych - Twarz</b>
                </Typography>
              </Box>
              <div>
                <DataGrid
                  columns={SolutionsColumns}
                  rows={solutionsData.map((sol, index) => ({
                    id: index,
                    Id: sol.Id,
                    HairProblem: sol.HairProblem,
                    Solution: sol.Solution,
                    Description: sol.Description,
                    IsDeleted: sol.IsDeleted,
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
              Nie znaleziono żadnych Rozwiązań Problemów Włosów w Bazie Danych
            </Typography>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default DealingHairProblemsTable;
