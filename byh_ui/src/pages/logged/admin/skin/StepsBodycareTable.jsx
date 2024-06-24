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

const StepsBodycareTable = () => {
  const [stepsData, setStepsData] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isRevertModalOpen, setRevertModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [editStep, setEditStep] = useState({
    Id: 0,
    SkinType: "",
    Step1: "",
    Step2: "",
    Step3: "",
    Step4: "",
    Step5: "",
  });
  const [skinTypesData, setSkinTypesData] = useState([]);
  const [selectedSkinType, setSelectedSkinType] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchSteps();
    fetchSkinTypes();
  }, []);

  const fetchSteps = () => {
    axios
      .get("/api/BodycareSteps")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data);
        setStepsData(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchSkinTypes = () => {
    axios
      .get("api/SkinTypesTable/GetOnlyTypes")
      .then((response) => {
        setSkinTypesData(response.data.Data);
        console.log("Skin Types: ", response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditModalOpen = (step) => {
    setSelectedStep(step);
    console.log(step);
    setEditModalOpen(true);

    setEditStep({
      Id: step.Id,
      SkinType: step.SkinType,
      Step1: step.Step1,
      Step2: step.Step2,
      Step3: step.Step3,
      Step4: step.Step4,
      Step5: step.Step5,
    });

    console.log(editStep.Id);
  };

  const handleEditModalClose = () => {
    setSelectedStep(null);
    console.log("handleEditmodalClose");
    setEditModalOpen(false);
  };

  const handleEdit = () => {
    console.log("id", editStep.Id);
    console.log("editStep: ", editStep);

    const data = {
      Id: editStep.Id,
      SkinType: editStep.SkinType,
      DayTime: editStep.DayTime,
      Step1: editStep.Step1,
      Step2: editStep.Step2,
      Step3: editStep.Step3,
      Step4: editStep.Step4,
      Step5: editStep.Step5,
    };

    axios
      .put(`/api/BodycareSteps/UpdateBodycareStep/${editStep.Id}`, data)
      .then((response) => {
        fetchSteps();
        console.log("Step has been edited", response.data);
        handleEditModalClose();
      })
      .catch((error) => {
        console.error("Error during editing step", error);
      });
  };

  const handleRevertModalOpen = (step) => {
    setSelectedStep(step);
    setRevertModalOpen(true);
  };

  const handleRevertModalClose = () => {
    setSelectedStep(null);
    setRevertModalOpen(false);
  };

  const handleRevert = () => {
    console.log(selectedStep);
    axios
      .put(`/api/BodycareSteps/RevBodycareStep/${selectedStep.Id}`)
      .then((response) => {
        console.log(selectedStep.Id);
        fetchSteps();
      })
      .catch((error) => {
        console.log(error);
      });

    setSelectedStep(null);
    setRevertModalOpen(false);
  };

  const handleDeleteModalOpen = (step) => {
    setSelectedStep(step);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setSelectedStep(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = () => {
    console.log(selectedStep);
    axios
      .put(`/api/BodycareSteps/DelBodycareStep/${selectedStep.Id}`)
      .then((response) => {
        console.log(selectedStep);
        fetchSteps();
      })
      .catch((error) => {
        console.log(error);
      });

    setSelectedStep(null);
    setDeleteModalOpen(false);
  };

  const StepsColumns = [
    {
      field: "Id",
      headerName: "ID",
      width: 50,
    },
    {
      field: "SkinType",
      headerName: "Typ Skóry",
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
              console.log("Deleted:", params.row.IsDeleted);
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
        style={{
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
            <Card sx={{ width: "80vw", maxWidth: "800px" }}>
              <Typography variant="h5" sx={{ textAlign: "center", p: 3 }}>
                <b>Edytuj Rutynę Pielęgnacyjną Ciała</b>
              </Typography>
              <CardContent sx={{ maxHeight: "600px", overflow: "auto" }}>
                <form onSubmit={handleSubmit}>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between" }}
                  >
                    <Typography>
                      <b>Typ Skóry</b>
                    </Typography>
                    <Select
                      label="Typ Skóry"
                      value={editStep.SkinType}
                      onChange={(e) =>
                        setEditStep({ ...editStep, SkinType: e.target.value })
                      }
                      required
                      sx={{ width: "25%" }}
                    >
                      {skinTypesData.map((skinTypeSel) => (
                        <MenuItem
                          key={skinTypeSel.Id}
                          value={skinTypeSel.SkinType}
                        >
                          {skinTypeSel.SkinType}
                        </MenuItem>
                      ))}
                    </Select>
                    <Typography>Krok 1</Typography>
                    <TextField
                      type="text"
                      label="Krok 1"
                      value={editStep.Step1}
                      onChange={(e) =>
                        setEditStep({
                          ...editStep,
                          Step1: e.target.value,
                        })
                      }
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", marginTop: 4 }}
                  >
                    <Typography>Krok 2</Typography>
                    <TextField
                      type="text"
                      label="Krok 2"
                      value={editStep.Step2}
                      onChange={(e) =>
                        setEditStep({
                          ...editStep,
                          Step2: e.target.value,
                        })
                      }
                    />
                    <Typography>Krok 3</Typography>
                    <TextField
                      type="text"
                      label="Krok 3"
                      value={editStep.Step3}
                      onChange={(e) =>
                        setEditStep({
                          ...editStep,
                          Step3: e.target.value,
                        })
                      }
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", marginTop: 2 }}
                  >
                    <Typography>Krok 4</Typography>
                    <TextField
                      type="text"
                      label="Krok 4"
                      value={editStep.Step4}
                      onChange={(e) =>
                        setEditStep({
                          ...editStep,
                          Step4: e.target.value,
                        })
                      }
                    />
                    <Typography>Krok 5</Typography>
                    <TextField
                      type="text"
                      label="Krok 5"
                      value={editStep.Step5}
                      onChange={(e) =>
                        setEditStep({
                          ...editStep,
                          Step5: e.target.value,
                        })
                      }
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
                {selectedStep && selectedStep.length !== 0 ? (
                  <Typography sx={{ textAlign: "center" }}>
                    Czy na pewno chcesz ununąć rutynę pielęgnacyjną dla typu
                    skóry: {selectedStep.SkinType}?
                  </Typography>
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    Czy na pewno chcesz unusąć tą rutynę pielęgnacyjną?
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
                {selectedStep && selectedStep.length !== 0 ? (
                  <Typography>
                    Czy na pewno chcesz przywrócić rutynę pielęgnacyjną dla typu
                    skóry: {selectedStep.SkinType}?
                  </Typography>
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    Czy na pewno chcesz przywrócić tą rutynę pielęgnacyjną?
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
        {stepsData && stepsData.length !== 0 ? (
          <Card>
            <CardContent>
              <Box>
                <Typography variant="h6" textAlign={"center"} marginBottom={1}>
                  <b>Rutyny Pielęgnacyjne</b>
                </Typography>
              </Box>
              <div style={{ height: "80vh" }}>
                <DataGrid
                  columns={StepsColumns}
                  rows={stepsData.map((step, index) => ({
                    id: index,
                    Id: step.Id,
                    SkinType: step.SkinType,
                    Step1: step.Step1,
                    Step2: step.Step2,
                    Step3: step.Step3,
                    Step4: step.Step4,
                    Step5: step.Step5,
                    IsDeleted: step.IsDeleted,
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
              Nie zneleziono żadnych Rutyn Pielęgnacyjnych w Bazie Dancyh
            </Typography>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default StepsBodycareTable;
