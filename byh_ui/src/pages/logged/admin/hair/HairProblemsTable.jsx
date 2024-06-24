import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Modal,
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

const HairProblemsTable = ({}) => {
  const [problemsData, setProblemsData] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isRevertModalOpen, setRevertModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [editProblem, setEditProblem] = useState({
    Id: 0,
    HairProblem: "",
    ImageURL: "",
  });
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const fetchProblems = () => {
    axios
      .get("/api/HairProblems")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data);
        setProblemsData(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddFile = () => {
    console.log(image);
    setImageName(image.name);
    console.log("ImageName: ", imageName);

    const formData = new FormData();
    formData.append("file", image);

    axios
      .post("/api/HairProblems/SaveFile", formData)
      .then((response) => {
        //fetchProblems();
        alert(response.data.StatusMessage);
      })
      .catch((error) => {
        console.log("Error uploading file:", error);
        if (error.response) {
          // Błąd odpowiedzi z serwera
          console.log("Response data:", error.response.data);
          console.log("Response status:", error.response.status);
          console.log("Response headers:", error.response.headers);
        } else if (error.request) {
          // Błąd żądania
          console.log("Request data:", error.request);
        } else {
          // Inny błąd
          console.error("Error:", error.message);
        }
      });

    setImage("");
  };

  const handleEditModalOpen = (issue) => {
    setSelectedProblem(issue);
    console.log(issue);
    setEditModalOpen(true);

    setEditProblem({
      Id: issue.Id,
      HairProblem: issue.HairProblem,
      ImageURL: issue.ImageURL,
    });

    console.log(editProblem.Id);
  };

  const handleEditModalClose = () => {
    setSelectedProblem(null);
    console.log("handleEditmodalClose");
    setEditModalOpen(false);
    setImageName("");
    setImage("");
  };

  const handleEdit = () => {
    console.log("id", editProblem.Id);
    console.log("editProblem: ", editProblem);

    if (imageName === undefined) {
      setImageName("none.png");
    }

    const data = {
      Id: editProblem.Id,
      HairProblem: editProblem.HairProblem,
      ImageURL: imageName,
    };

    axios
      .put(`/api/HairProblems/UpdateHairProblem/${editProblem.Id}`, data)
      .then((response) => {
        fetchProblems();
        console.log("Issue has been edited", response.data);
        handleEditModalClose();
      })
      .catch((error) => {
        console.error("Error during editing issue", error);
      });

    setImageName("");
  };

  const handleRevertModalOpen = (issue) => {
    setSelectedProblem(issue);
    setRevertModalOpen(true);
  };

  const handleRevertModalClose = () => {
    setSelectedProblem(null);
    setRevertModalOpen(false);
  };

  const handleRevert = () => {
    console.log(selectedProblem);
    axios
      .put(`/api/HairProblems/RevHairProblem/${selectedProblem.Id}`)
      .then((response) => {
        console.log(selectedProblem);
        fetchProblems();
      })
      .catch((error) => {
        console.log(error);
      });

    fetchProblems();
    setSelectedProblem(null);
    setRevertModalOpen(false);
  };

  const handleDeleteModalOpen = (issue) => {
    setSelectedProblem(issue);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setSelectedProblem(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = () => {
    console.log(selectedProblem);
    axios
      .put(`/api/HairProblems/DelHairProblem/${selectedProblem.Id}`)
      .then((response) => {
        console.log(selectedProblem);
        fetchProblems();
      })
      .catch((error) => {
        console.log(error);
      });

    fetchProblems();
    setSelectedProblem(null);
    setDeleteModalOpen(false);
  };

  const ProblemsColumns = [
    {
      field: "Id",
      headerName: "ID",
      width: 50,
    },
    {
      field: "HairProblem",
      headerName: "Problem Włosów",
      width: 200,
    },
    {
      field: "ImageURL",
      headerName: "Obraz",
      width: 150,
      renderCell: (params) => {
        console.log(params.row.ImageURL);
        return (
          <img
            src={`https://localhost:44313/Photos/HairProblems/${params.row.ImageURL}`}
            alt="Issue"
            style={{ width: "auto", height: 100 }}
          />
        );
      },
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
                <b>Edytuj Problem Włosów</b>
              </Typography>
              <CardContent sx={{ maxHeight: "600px", overflow: "auto" }}>
                <form onSubmit={handleSubmit}>
                  <TextField
                    sx={{ marginBottom: 2 }}
                    name="issue"
                    label="Problem Włosów"
                    fullWidth
                    value={editProblem.HairProblem}
                    onChange={(e) =>
                      setEditProblem({
                        ...editProblem,
                        HairProblem: e.target.value,
                      })
                    }
                  />
                  <Grid item xs={12} margin={2}>
                    <input type="file" onChange={(e) => handleImageChange(e)} />
                    <Button onClick={() => handleAddFile()}>Dodaj plik</Button>
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
                  <Typography sx={{ textAlign: "center" }}>
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
        {problemsData && problemsData.length !== 0 ? (
          <Card style={{ height: "80vh" }}>
            <CardContent>
              <Box>
                <Typography variant="h6" textAlign={"center"} marginBottom={1}>
                  <b>Problemy Włosów</b>
                </Typography>
              </Box>
              <div>
                <DataGrid
                  columns={ProblemsColumns}
                  rows={problemsData.map((issue, index) => ({
                    id: index,
                    Id: issue.Id,
                    HairProblem: issue.HairProblem,
                    ImageURL: issue.ImageURL,
                    IsDeleted: issue.IsDeleted,
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
              Nie znaleziono żadnych Problemów Włosów w Bazie Danych
            </Typography>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default HairProblemsTable;
