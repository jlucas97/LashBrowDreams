import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import StoreServices from "../../services/StoreServices";
import UserService from "../../services/UserService"; // Importa el servicio de usuario
import { useEffect, useState } from "react";

export function Home() {
  const defaultStoreId = 1;
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(
    localStorage.getItem("selectedStoreId") || defaultStoreId
  );
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    city: "",
  });
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    StoreServices.getStores()
      .then((response) => {
        console.log("Sucursales:", response);
        const mappedStores = response.data.results.map((store) => ({
          id: store.id,
          name: store.name,
          city: store.city,
        }));
        setStores(mappedStores);

        
        const initialStoreId = selectedStoreId || defaultStoreId;
        const selectedStore = mappedStores.find(
          (store) => store.id === initialStoreId
        );
        if (selectedStore) {
          setFormData({
            id: selectedStore.id,
            name: selectedStore.name,
            city: selectedStore.city,
          });
          fetchWeatherData(selectedStore.city);
          fetchAdminByStore(selectedStore.id); 
        }
      })
      .catch((error) => {
        console.error("Error al obtener las sucursales:", error);
      });
  }, [selectedStoreId]);

  const handleServiceChange = (event) => {
    const storeId = event.target.value;
    setSelectedStoreId(storeId);
    localStorage.setItem("selectedStoreId", storeId);
    const selectedStore = stores.find((store) => store.id === storeId);
    if (selectedStore) {
      setFormData({
        id: selectedStore.id,
        name: selectedStore.name,
        city: selectedStore.city,
      });
      setSelectedStoreId(selectedStore.id);
      fetchWeatherData(selectedStore.city);
      fetchAdminByStore(selectedStore.id); 
    }
  };

  const fetchWeatherData = (city) => {
    StoreServices.getWeather(city)
      .then((response) => {
        console.log("Weather data:", response.data);
        setWeatherData(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos del clima:", error);
      });
  };

  const fetchAdminByStore = (storeId) => {
    UserService.getAdminByStore(storeId)
      .then((response) => {
        if (response.results && response.results.length > 0) {
          const admin = response.results[0];
          localStorage.setItem("adminName", admin.name);
          localStorage.setItem("adminEmail", admin.email);
        }
      })
      .catch((error) => {
        console.error("Error al obtener el admin:", error);
      });
  };

  return (
    <>
      <Container sx={{ p: 2 }} maxWidth="md">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          LashBrow Dreams
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          paragraph
        >
          Agenda aquí tu cita, consigue los productos de belleza y cuidado para
          cejas y pestañas aquí en LashBrow Dreams
        </Typography>
      </Container>
      <FormControl fullWidth margin="normal">
        <InputLabel>Seleccionar Sucursal</InputLabel>
        <Select
          value={selectedStoreId}
          onChange={handleServiceChange}
          label="Seleccionar Sucursal"
          required
        >
          {stores.length > 0 ? (
            stores.map((store) => (
              <MenuItem key={store.id} value={store.id}>
                {store.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" disabled>
              No hay sucursales disponibles
            </MenuItem>
          )}
        </Select>
      </FormControl>
      <Container sx={{ mt: 2 }}>
        {weatherData ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            bgcolor="rgba(0, 0, 0, 0.8)"
            color="white"
            p={2}
            borderRadius={2}
          >
            <Typography variant="h6">Clima actual de la sucursal:</Typography>
            <Typography>
              {weatherData.name}: {weatherData.main.temp}°C,{" "}
              {weatherData.weather[0].description}
            </Typography>
            <Box
              component="img"
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
              alt={`Weather ${weatherData.weather[0].description}`}
              width={100}
              height={100}
              mt={2}
            />
          </Box>
        ) : (
          <Typography>Selecciona una sucursal para ver el clima.</Typography>
        )}
      </Container>
    </>
  );
}
