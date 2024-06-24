import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

const AdminHome = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
    "isAdminCookie",
  ]);

  setCookie("currentPageCookie", "admin-home", { path: "/" });
  const adminCheck = cookies.isAdminCookie;
  console.log("AdminCheck: ", adminCheck);
  const [users, setUsers] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState({});
  const [editUser, setEditUser] = useState({
    Id: 0,
    Name: "",
    Email: "",
    IsActive: "",
    IsDeleted: "",
    IsAdmin: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("/api/User")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data);
        setUsers(response.data.Data);
        console.log(response.data.Data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditModalOpen = (user) => {
    setSelectedUser(user);
    console.log("UserEditData: ", user);
    setEditModalOpen(true);
  };

  const handleChangeIsActive = () => {
    console.log(selectedUser);
    axios
      .put("/api/User/SetActive/" + selectedUser.Id)
      .then((response) => {
        console.log(response.data);
        console.log(response.data.length);
        fetchUsers();
        alert(response.data.StatusMessage);
      })
      .catch((error) => {
        console.log(error);
      });

    setSelectedUser(null);
    setEditModalOpen(false);
  };

  const handleChangeIsAdmin = () => {
    console.log(selectedUser);
    axios
      .put("/api/User/SetAdmin/" + selectedUser.Id)
      .then((response) => {
        console.log(response.data);
        console.log(response.data.length);
        fetchUsers();
        alert(response.data.StatusMessage);
      })
      .catch((error) => {
        console.log(error);
      });

    setSelectedUser(null);
    setEditModalOpen(false);
  };

  const handleEditModalClose = () => {
    setSelectedUser(null);
    console.log("handleEditmodalClose");
    setEditModalOpen(false);
  };

  const handleDeleteModalOpen = (userId) => {
    console.log("UserID: ", userId);
    setSelectedUser(userId);
    setDeleteModalOpen(true);

    axios
      .get("/api/User/GetUser/" + userId)
      .then((response) => {
        console.log(response.data.Data[0]);
        setSelectedUserData(response.data.Data[0]);
        //alert(response.data.StatusMessage);
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(selectedUserData);
  };

  const handleDeleteModalClose = () => {
    setSelectedUser(null);
    setSelectedUserData({});
    setDeleteModalOpen(false);
  };

  const handleDelete = () => {
    console.log(selectedUser);
    axios
      .put("/api/User/SetDelete/" + selectedUser)
      .then((response) => {
        console.log(response.data);
        console.log(response.data.length);
        fetchUsers();
        alert(response.data.StatusMessage);
      })
      .catch((error) => {
        console.log(error);
      });

    setSelectedUser(null);
    setSelectedUserData({});
    setDeleteModalOpen(false);
  };

  const UsersColumns = [
    {
      field: "Id",
      headerName: "ID",
      width: 50,
      hideable: true,
    },
    {
      field: "Name",
      headerName: "Imię",
      width: 100,
    },
    {
      field: "Email",
      headerName: "Email",
      width: 150,
    },
    {
      field: "CreatedAt",
      headerName: "Data utworzenia",
      width: 100,
    },
    {
      field: "DeletedAt",
      headerName: "Data usunięcia",
      width: 100,
    },
    {
      field: "IsActive",
      headerName: "Aktywny",
      width: 75,
    },
    {
      field: "IsDeleted",
      headerName: "Usunięty",
      width: 75,
    },
    {
      field: "IsAdmin",
      headerName: "Admin",
      width: 75,
    },
    {
      field: "action-edit",
      headerName: "Edytuj",
      sortable: false,
      width: 75,
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
      headerName: "Usuń",
      sortable: false,
      width: 75,
      renderCell: (params) => {
        return (
          <Button
            sx={{ color: "red" }}
            size="small"
            onClick={() => {
              console.log("Clicked contact:", params.row.Id);
              handleDeleteModalOpen(params.row.Id);
            }}
          >
            <DeleteIcon />
          </Button>
        );
      },
    },
  ];

  return (
    <Box flex={12} p={2}>
      <Modal
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "auto",
          marginRight: "auto",
          width: "50%",
        }}
        overflow={"auto"}
        open={isEditModalOpen}
        onClose={() => handleEditModalClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          width="50%"
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
            <Card sx={{ p: 3 }}>
              <Stack>
                <Box textAlign={"right"}>
                  <Button
                    color="primary"
                    sx={{ marginTop: 2 }}
                    onClick={() => handleEditModalClose()}
                  >
                    <DisabledByDefaultIcon />
                  </Button>
                </Box>
                <Typography
                  variant="h5"
                  sx={{ textAlign: "center", marginBottom: 2 }}
                >
                  <b>Edituj Właściwości Użytkownika</b>
                </Typography>
              </Stack>
              <CardContent sx={{ maxHeight: "600px", overflow: "auto" }}>
                {selectedUser !== null && (
                  <div>
                    <Box sx={{ marginBottom: 2, marginLeft: 3 }}>
                      <Typography>
                        <b>ID: </b>
                        {selectedUser.Id}
                      </Typography>
                      <Typography>
                        <b>Imię: </b>
                        {selectedUser.Name}
                      </Typography>
                      <Typography>
                        <b>Email: </b>
                        {selectedUser.Email}
                      </Typography>
                      <Typography>
                        <b>Data utworzenia: </b>
                        {selectedUser.CreatedAt}
                      </Typography>
                      <Typography>
                        <b>Data usunięcia: </b>
                        {selectedUser.DeletedAt}
                      </Typography>
                      <Typography>
                        <b>Aktywny: </b>
                        {selectedUser.IsActive}
                      </Typography>
                      <Typography>
                        <b>Usunięty: </b>
                        {selectedUser.IsDeleted}
                      </Typography>
                      <Typography>
                        <b>Admin: </b>
                        {selectedUser.IsAdmin}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      textAlign={"center"}
                      sx={{ marginTop: 5 }}
                    >
                      <b>Zmień właściwość:</b>
                    </Typography>
                    <Stack direction="row" justifyContent={"space-evenly"}>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ margin: 2 }}
                        onClick={() => handleChangeIsActive()}
                      >
                        Aktywny
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ margin: 2 }}
                        onClick={() => handleChangeIsAdmin()}
                      >
                        Admin
                      </Button>
                    </Stack>
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Box>
      </Modal>

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
              <Typography
                variant="h5"
                sx={{ textAlign: "center", p: 1, marginTop: 1 }}
              >
                <b>Potwierdzenie</b>
              </Typography>
              <CardContent>
                {selectedUserData.IsDeleted === 0 ? (
                  <Typography variant="h6" textAlign={"center"}>
                    Czy na pewno chcesz ununąć Użytkownika{" "}
                    <b>{selectedUserData.Name}</b> - email:{" "}
                    <b>{selectedUserData.Email}</b>?
                  </Typography>
                ) : (
                  <Typography variant="h6" textAlign={"center"}>
                    Czy na pewno chcesz przywrócić Użytkownika{" "}
                    <b>{selectedUserData.Name}</b> back - email:{" "}
                    <b>{selectedUserData.Email}</b>?
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

      <Box textAlign={"center"}>
        <Typography variant="h5">
          {" "}
          <b>Witaj Admin!</b>{" "}
        </Typography>
      </Box>
      <Stack>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/admin-skincare">
              <ListItemText>Pielęgnacja Skóry</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/admin-haircare">
              <ListItemText>Pielęgnacja Włosów</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/admin-supplementation">
              <ListItemText>Suplementacja</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/admin-prevention">
              <ListItemText>Choroby i Zapobieganie</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Stack>
      {users && users.length !== 0 ? (
        <Card sx={{ marginTop: 2 }}>
          <CardContent>
            <Box>
              <Typography variant="h6" textAlign={"center"} marginBottom={1}>
                <b>Użytkownicy</b>
              </Typography>
            </Box>
            <div>
              <DataGrid
                columns={UsersColumns}
                rows={users.map((user, index) => ({
                  id: index,
                  Id: user.Id,
                  Name: user.Name,
                  Email: user.Email,
                  CreatedAt: user.CreatedAt,
                  DeletedAt: user.DeletedAt === null ? "nigdy" : user.DeletedAt,
                  IsActive: user.IsActive,
                  IsDeleted: user.IsDeleted,
                  IsAdmin: user.IsAdmin,
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
          <Typography>Nie znaleziono użytkowników w bazie danych</Typography>
        </Box>
      )}
    </Box>
  );
};

export default AdminHome;
