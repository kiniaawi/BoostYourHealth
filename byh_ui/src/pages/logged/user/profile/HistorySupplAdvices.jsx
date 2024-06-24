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
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { format } from "date-fns";

const HistorySupplAdvices = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
    "nameCookie",
    "userIdCookie",
  ]);
  const username = cookies.nameCookie;
  const userId = cookies.userIdCookie;
  setCookie("currentPageCookie", "history-supplementation-advices", {
    path: "/",
  });
  const navigate = useNavigate();
  const [allSupplAdvices, setAllSupplAdvices] = useState([]);
  const [detailsSupplAdvice, setDetailsSupplAdvice] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAdvice, setSelectedAdvice] = useState(null);

  useEffect(() => {
    fetchAllSupplAdvices();
  }, []);

  const fetchAllSupplAdvices = () => {
    axios
      .get(`/api/SupplDiagnosticQuestions/GetUserSupplAdvice/${userId}`)
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        setAllSupplAdvices(response.data.Data);
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
    }
  };

  const handleDetailsModalClose = () => {
    setSelectedAdvice(null);
    setDetailsModalOpen(false);
    setDetailsSupplAdvice(null);
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
      .put(`/api/SupplDiagnosticQuestions/Delete/${selectedAdvice.Id}`)
      .then((response) => {
        console.log(selectedAdvice);
        fetchAllSupplAdvices();
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
      field: "IssueCategory",
      headerName: "Kategoria",
      width: 100,
    },
    {
      field: "Issues",
      headerName: "Problemy",
      width: 150,
    },
    {
      field: "Solutions",
      headerName: "Rozwiązania",
      width: 150,
    },
    {
      field: "SupplDosage",
      headerName: "Dawkowanie Suplementów",
      width: 100,
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
                    Czy na pewno chcesz usunąć poradę dla kategorii:{" "}
                    {selectedAdvice.IssueCategory} z dnia{" "}
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
                {selectedAdvice && selectedAdvice.DiagnDate && (
                  <Typography p={1}>
                    <b>{selectedAdvice.DiagnDate} </b>
                  </Typography>
                )}
                <Typography
                  variant="h5"
                  sx={{ textAlign: "center", marginTop: 5, marginBottom: 4 }}
                >
                  <b>Twoja Porada Suplementacyjna:</b>
                </Typography>
                {selectedAdvice &&
                  selectedAdvice.Solutions &&
                  selectedAdvice.Solutions.split(";").map((solution, index) => (
                    <Typography
                      variant="h6"
                      sx={{ marginLeft: 4, marginBottom: 2 }}
                      key={index}
                    >
                      <NavigateNextIcon />
                      {solution}
                    </Typography>
                  ))}
                <Typography
                  variant="h5"
                  sx={{ textAlign: "center", marginTop: 5, marginBottom: 4 }}
                >
                  <b>Dzienne zapotrzebowanie suplementów:</b>
                </Typography>
                {selectedAdvice &&
                  selectedAdvice.SupplDosage &&
                  [
                    ...new Set(
                      selectedAdvice.SupplDosage.split(";").map((solution) =>
                        solution.trim()
                      )
                    ),
                  ].map((uniqueSolution, index) => (
                    <Typography
                      variant="h6"
                      sx={{ marginLeft: 4, marginBottom: 2 }}
                      key={index}
                    >
                      <NavigateNextIcon />
                      {uniqueSolution}
                    </Typography>
                  ))}
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

      <Button
        component={Link}
        to="/user-profile"
        onClick={() => {
          onChangeContent("user-profile");
          navigate("/user-profile");
        }}
        size="small"
      >
        <ArrowBackIcon />
        Twój Profil
      </Button>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", marginBottom: 3, marginTop: 2 }}
      >
        <b>Historia porad suplementacyjnych {username}</b>
      </Typography>
      <Box>
        <div style={{ overflow: "auto" }}>
          {allSupplAdvices && allSupplAdvices.length !== 0 ? (
            <Card sx={{ marginBottom: 5 }}>
              <CardContent>
                <Box>
                  <Typography
                    variant="h6"
                    textAlign={"center"}
                    marginBottom={2}
                  >
                    <b>Porady Suplementacjne</b>
                  </Typography>
                </Box>
                <div>
                  <DataGrid
                    columns={SupplAdvicesColumns}
                    rows={allSupplAdvices.map((prod, index) => ({
                      id: index,
                      Id: prod.Id,
                      UserId: prod.UserId,
                      IssuesId: prod.IssuesId,
                      SolutionsId: prod.SolutionsId,
                      IssueCategory: prod.IssueCategory,
                      Issues: prod.Issues,
                      Solutions: prod.Solutions,
                      SupplDosage: prod.SupplDosage,
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
                Nie znaleziono Porad Suplementacji w Bazie danych
              </Typography>
            </Box>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default HistorySupplAdvices;
