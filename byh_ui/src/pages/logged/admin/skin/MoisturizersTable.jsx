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

const MoisturizersTable = () => {
  const [productsData, setProductsData] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isRevertModalOpen, setRevertModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [allProductTypes, setAllProductTypes] = useState([]);
  const [allSkinTypes, setAllSkinTypes] = useState([]);
  const [editProduct, setEditProduct] = useState({
    Id: 0,
    ProductName: "",
    ProductTypeId: "",
    ProductType: "",
    SkinType: "",
    DayTime: "",
    Frequency: "",
    MinAge: "",
    ImageURL: "",
    ForPregnant: "",
  });
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchProducts();
    fetchProductTypes();
    fetchSkinTypes();
  }, []);

  const fetchProducts = () => {
    axios
      .get("/api/Moisturizers")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data);
        setProductsData(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchProductTypes = () => {
    axios
      .get("/api/DealingSkinIssues")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        setAllProductTypes(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchSkinTypes = () => {
    axios
      .get("/api/SkincareSteps")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.Data[0]);
        setAllSkinTypes(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddFile = () => {
    console.log(image);
    setImageName(image.name);
    console.log("ImageName: ", imageName);

    const formData = new FormData();
    formData.append("file", image);

    axios
      .post("/api/Moisturizers/SaveFile", formData)
      .then((response) => {
        alert(response);
      })
      .catch((error) => {
        console.log("Error uploading file:", error);
        if (error.response) {
          console.log("Response data:", error.response.data);
          console.log("Response status:", error.response.status);
          console.log("Response headers:", error.response.headers);
        } else if (error.request) {
          console.log("Request data:", error.request);
        } else {
          console.error("Error:", error.message);
        }
      });

    setImage("");
  };

  const handleEditModalOpen = (prod) => {
    setSelectedProduct(prod);
    console.log(prod);
    setEditModalOpen(true);

    setEditProduct({
      Id: prod.Id,
      ProductName: prod.ProductName,
      ProductTypeId: prod.ProductTypeId,
      ProductType: prod.ProductType,
      SkinType: prod.SkinType,
      DayTime: prod.DayTime,
      Frequency: prod.Frequency,
      MinAge: prod.MinAge,
      ImageURL: prod.ImageURL,
      ForPregnant: prod.ForPregnant,
    });

    console.log(editProduct.Id);
  };

  const handleEditModalClose = () => {
    setSelectedProduct(null);
    console.log("handleEditmodalClose");
    setEditModalOpen(false);
  };

  const handleEdit = () => {
    console.log("id", editProduct.Id);
    console.log("editStep: ", editProduct);

    const data = {
      Id: editProduct.Id,
      ProductName: editProduct.ProductName,
      ProductTypeId: editProduct.ProductTypeId,
      SkinType: editProduct.SkinType,
      DayTime: editProduct.DayTime,
      Frequency: editProduct.Frequency,
      MinAge: editProduct.MinAge,
      ImageURL: imageName && imageName.lenght !== 0 ? imageName : "none.png",
      ForPregnant: editProduct.ForPregnant,
    };

    axios
      .put(`/api/Moisturizers/UpdateMoisturizer/${editProduct.Id}`, data)
      .then((response) => {
        fetchProducts();
        console.log("Step has been edited", response.data);
        handleEditModalClose();
      })
      .catch((error) => {
        console.error("Error during editing step", error);
      });
  };

  const handleRevertModalOpen = (prod) => {
    setSelectedProduct(prod);
    setRevertModalOpen(true);
  };

  const handleRevertModalClose = () => {
    setSelectedProduct(null);
    setRevertModalOpen(false);
  };

  const handleRevert = () => {
    console.log(selectedProduct);
    axios
      .put(`/api/Moisturizers/RevMoisturizer/${selectedProduct.Id}`)
      .then((response) => {
        console.log(selectedProduct);
        fetchProducts();
      })
      .catch((error) => {
        console.log(error);
      });

    fetchProducts();
    setSelectedProduct(null);
    setRevertModalOpen(false);
  };

  const handleDeleteModalOpen = (prod) => {
    setSelectedProduct(prod);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setSelectedProduct(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = () => {
    console.log(selectedProduct);
    axios
      .put(`/api/Moisturizers/DelMoisturizer/${selectedProduct.Id}`)
      .then((response) => {
        console.log(selectedProduct);
        fetchProducts();
      })
      .catch((error) => {
        console.log(error);
      });

    fetchProducts();
    setSelectedProduct(null);
    setDeleteModalOpen(false);
  };

  const ProductsColumns = [
    {
      field: "Id",
      headerName: "ID",
      width: 50,
    },
    {
      field: "ProductName",
      headerName: "Nazwa",
      width: 150,
    },
    {
      field: "ProductType",
      headerName: "Typ Produktu",
      width: 100,
    },
    {
      field: "ProductTypeId",
      headerName: " Id Typu Produktu",
      width: 50,
    },
    {
      field: "SkinType",
      headerName: "Typ Skóry",
      width: 100,
    },
    {
      field: "DayTime",
      headerName: "Pora Dnia",
      width: 80,
    },
    {
      field: "Frequency",
      headerName: "Częstotliwość",
      width: 100,
    },
    {
      field: "MinAge",
      headerName: "Min Wiek",
      width: 80,
    },
    {
      field: "ForPregnant",
      headerName: "Ciąża",
      width: 50,
    },
    {
      field: "IsDeleted",
      headerName: "Usunięto",
      width: 80,
    },
    {
      field: "action-edit",
      headerName: "Edytuj",
      sortable: false,
      width: 50,
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
      width: 80,
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
                <b>Edytuj Produkt Nawilżający</b>
              </Typography>
              <CardContent sx={{ maxHeight: "600px", overflow: "auto" }}>
                <form onSubmit={handleSubmit}>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", marginTop: 4 }}
                  >
                    <Typography>Nazwa Produktu</Typography>
                    <TextField
                      sx={{ width: "25%" }}
                      type="text"
                      label="Product Name"
                      value={editProduct.ProductName}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          ProductName: e.target.value,
                        })
                      }
                    />
                    <Typography>Typ Produktu</Typography>
                    <Select
                      value={editProduct.ProductTypeId}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          ProductTypeId: e.target.value,
                        })
                      }
                      required
                      sx={{ width: "25%" }}
                    >
                      {allProductTypes.map((item) => (
                        <MenuItem key={item.Id} value={item.Id}>
                          {item.Solution}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", marginTop: 2 }}
                  >
                    <Typography>Typ Skóry</Typography>
                    <Select
                      value={editProduct.SkinType}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          SkinType: e.target.value,
                        })
                      }
                      required
                      sx={{ width: "25%" }}
                    >
                      {allSkinTypes
                        .filter((item) => item.DayTime === "Wieczór")
                        .map((item) => (
                          <MenuItem key={item.SkinType} value={item.SkinType}>
                            {item.SkinType}
                          </MenuItem>
                        ))}
                    </Select>
                    <Typography>Pora Dnia</Typography>
                    <Select
                      label="Day Time"
                      value={editProduct.DayTime}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          DayTime: e.target.value,
                        })
                      }
                      sx={{ width: "25%" }}
                    >
                      <MenuItem value="Rano">Rano</MenuItem>
                      <MenuItem value="Wieczór">Wieczór</MenuItem>
                    </Select>
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", marginTop: 2 }}
                  >
                    <Typography>Częstotliwość</Typography>
                    <TextField
                      sx={{ width: "25%" }}
                      type="text"
                      label="Frequency"
                      value={editProduct.Frequency}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          Frequency: e.target.value,
                        })
                      }
                    />
                    <Typography>Minimalny Wiek</Typography>
                    <TextField
                      sx={{ width: "25%" }}
                      type="number"
                      label="Minimum Age"
                      value={editProduct.MinAge}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          MinAge: e.target.value,
                        })
                      }
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "center", marginTop: 2 }}
                  >
                    <Typography>Czy Bezpieczny Przy Ciąży</Typography>
                    <Select
                      label="Is For Pregnant"
                      value={editProduct.ForPregnant}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          ForPregnant: e.target.value,
                        })
                      }
                      sx={{ width: "25%", marginLeft: 3 }}
                    >
                      <MenuItem value="Tak">Tak</MenuItem>
                      <MenuItem value="Nie">Nie</MenuItem>
                    </Select>
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "center", marginTop: 2 }}
                  >
                    <input type="file" onChange={(e) => handleImageChange(e)} />
                    <Button onClick={() => handleAddFile()}>Dodaj Obraz</Button>
                  </Stack>
                  <Box sx={{ textAlign: "center", marginTop: 3 }}>
                    <Stack direction="row" justifyContent={"space-between"}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit()}
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
                {selectedProduct && selectedProduct.length !== 0 ? (
                  <Typography sx={{ textAlign: "center" }}>
                    Czy na pewno chcesz usunąc ten produkt:{" "}
                    {selectedProduct.ProductName}?
                  </Typography>
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    Czy na pewno chcesz usunąc ten produkt?
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
                {selectedProduct && selectedProduct.length !== 0 ? (
                  <Typography>
                    Czy na pewno chcesz przywrócić ten produkt:{" "}
                    {selectedProduct.ProductName}?
                  </Typography>
                ) : (
                  <Typography>
                    Czy na pewno chcesz przywrócić ten produkt?
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
        {productsData && productsData.length !== 0 ? (
          <Card>
            <CardContent>
              <Box>
                <Typography variant="h6" textAlign={"center"} marginBottom={1}>
                  <b>Tabela Nawilżania</b>
                </Typography>
              </Box>
              <div style={{ height: "80vh" }}>
                <DataGrid
                  columns={ProductsColumns}
                  rows={productsData.map((prod, index) => ({
                    id: index,
                    Id: prod.Id,
                    ProductName: prod.ProductName,
                    ProductType: prod.ProductType,
                    ProductTypeId: prod.ProductTypeId,
                    SkinType: prod.SkinType,
                    DayTime: prod.DayTime,
                    Frequency: prod.Frequency,
                    MinAge: prod.MinAge,
                    ForPregnant: prod.ForPregnant,
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
              Nie Znaleziono Produktów Nawilżających w Bazie Danych
            </Typography>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default MoisturizersTable;
