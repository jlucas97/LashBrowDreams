import React, { useEffect, useState, useCallback } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Link } from "react-router-dom";
import InvoiceService from "../../services/InvoiceService";
import StoreServices from "../../services/StoreServices"; // Importa el servicio de sucursales
import ReservationsChart from "./ReservationChart";
import ReportePastel from "./GraphicPie";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [topServices, setTopServices] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(localStorage.getItem("selectedStoreId") || "");

  const fetchStores = useCallback(() => {
    StoreServices.getStores()
      .then((response) => {
        if (response && response.data && response.data.results) {
          setStores(response.data.results); // Asegúrate de que response.data.results tenga la estructura correcta
        } else {
          toast.warn("No se encontraron sucursales");
        }
      })
      .catch((error) => {
        console.error("Error al obtener las sucursales:", error);
        toast.error("Error al cargar las sucursales");
      });
  }, []);

  useEffect(() => {
    fetchStores(); // Cargar las sucursales cuando el componente se monta
  }, [fetchStores]);

  useEffect(() => {
    // Fetch the data for appointments and top services/products
    /*
    InvoiceService.getAppointmentsByStore(selectedStore) 
      .then(response => setAppointments(response.data))
      .catch(error => console.error("Error al obtener las citas:", error));

    InvoiceService.getTopServices(selectedStore) 
      .then(response => setTopServices(response.data))
      .catch(error => console.error("Error al obtener los servicios más vendidos:", error));

    InvoiceService.getTopProducts(selectedStore) 
      .then(response => setTopProducts(response.data))
      .catch(error => console.error("Error al obtener los productos más vendidos:", error));
    */
  }, [selectedStore]);

  const handleStoreChange = (event) => {
    const newStoreId = event.target.value;
    setSelectedStore(newStoreId);
    localStorage.setItem("selectedStoreId", newStoreId);
    // Aquí puedes agregar lógica para recargar datos específicos de la sucursal seleccionada
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Dashboard Administrador
      </Typography>
      
      {/* Dropdown para cambiar de sucursal */}
      <Grid container justifyContent="center" style={{ marginBottom: "20px" }}>
        <FormControl variant="outlined" style={{ minWidth: 200 }}>
          <InputLabel>Sucursal</InputLabel>
          <Select
            value={selectedStore}
            onChange={handleStoreChange}
            label="Sucursal"
          >
            {stores.length > 0 ? (
              stores.map((store) => (
                <MenuItem key={store.id} value={store.id}>
                  {store.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No hay sucursales disponibles</MenuItem>
            )}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ textAlign: "center", padding: 2 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Catálogo
              </Typography>
            </CardContent>
            <Box sx={{ padding: 2 }}>
              <Button
                component={Link}
                to="/product"
                variant="contained"
                color="primary"
                sx={{ width: "100%" }}
              >
                Ir a Catálogo
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ textAlign: "center", padding: 2 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Mantenimiento
              </Typography>
            </CardContent>
            <Box sx={{ padding: 2 }}>
              <Button
                component={Link}
                to="/maintenance"
                variant="contained"
                color="secondary"
                sx={{ width: "100%" }}
              >
                Ir a Mantenimiento
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ textAlign: "center", padding: 2 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Gestión
              </Typography>
            </CardContent>
            <Box sx={{ padding: 2 }}>
              <Button
                component={Link}
                to="/management"
                variant="contained"
                color="success"
                sx={{ width: "100%" }}
              >
                Ir a Gestión
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Sección de Reportes */}
        <Grid item xs={12}>
          <Card sx={{ padding: 4 }}>
            <CardContent>
              <Grid item xs={12}>
                <ReservationsChart storeId={selectedStore} /> {/* Pasar storeId */}
              </Grid>
              {/* <Typography variant="h6" gutterBottom>
                Top 3 Servicios Más Vendidos
              </Typography>
              <ReportePastel data={topServices} />

              <Typography variant="h6" gutterBottom marginTop={4}>
                Top 3 Productos Más Vendidos
              </Typography>
              <ReportePastel data={topProducts} />*/}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
