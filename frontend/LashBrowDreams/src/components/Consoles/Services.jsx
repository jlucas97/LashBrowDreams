import { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Card,
  CardHeader,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import ServiceServices from "../../services/ServiceService";
import CategoryService from "../../services/CategoryService";

export function ServiceList() {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "",
    type: ""
  });

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    ServiceServices.getServices()
      .then((response) => {
        console.log("Lista de servicios:", response);
        const mappedServices = response.results.map((service) => ({
          id: service.id,
          name: service.Nombre,
          description: service.Descripcion || "",
          price: service.Precio,
          duration: service.Duracion,
          category: service.Categoria,
          type: service.Tipo || "",
        }));
        setServices(mappedServices);
      })
      .catch((error) => {
        console.error("Error al obtener los servicios:", error);
      });
  }, []);

  useEffect(() => {
    CategoryService.getCategories()
      .then((response) => {
        console.log("Lista de categorías:", response);
        const mappedCategories = response.results.map((category) => ({
          id: category.id,
          name: category.name
        }));
        setCategories(mappedCategories);
      })
      .catch((error) => {
        console.error("Error al obtener las categorías:", error);
      });
  }, []);

  const handleServiceChange = (event) => {
    const serviceId = event.target.value;
    setSelectedServiceId(serviceId);
    const selectedService = services.find((service) => service.id === serviceId);
    setFormData({
      ...selectedService,
      category: selectedService.Categoria,
    });
    setSelectedCategoryId(selectedService.Categoria);
  };

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategoryId(categoryId);
    setFormData((prevFormData) => ({
      ...prevFormData,
      category: categoryId,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    ServiceServices.updateService(formData)
      .then((response) => {
        console.log("test");
        setUpdateSuccess(true);
        setUpdateError("");
      })
      .catch((error) => {
        console.error(error);
        setUpdateSuccess(false);
        setUpdateError("Error al actualizar el servicio. Por favor, inténtelo de nuevo.");
      });
  };

  return (
    <Grid container spacing={3} justifyContent="center" marginTop={12}>
      <Grid item xs={12} sm={8} md={6}>
        <Card>
          <CardHeader title="Mantenimiento de Servicios" />
          <CardContent>
            {updateSuccess && (
              <Typography variant="body1" color="primary" gutterBottom>
                ¡Servicio actualizado con éxito!
              </Typography>
            )}
            {updateError && (
              <Typography variant="body1" color="error" gutterBottom>
                {updateError}
              </Typography>
            )}
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Seleccionar Servicio</InputLabel>
                <Select
                  value={selectedServiceId}
                  onChange={handleServiceChange}
                  label="Seleccionar Servicio"
                  required
                >
                  {services.length > 0 ? (
                    services.map((service) => (
                      <MenuItem key={service.id} value={service.id}>
                        {service.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No hay servicios disponibles
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              <TextField
                name="id"
                label="ID"
                fullWidth
                required
                margin="normal"
                type="text"
                value={formData.id}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                name="name"
                label="Nombre"
                fullWidth
                required
                margin="normal"
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                name="description"
                label="Descripción"
                fullWidth
                required
                margin="normal"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
              <TextField
                name="price"
                label="Precio"
                fullWidth
                required
                margin="normal"
                type="number"
                value={formData.price}
                onChange={handleChange}
                inputProps={{
                  min: "0",
                }}
              />
              <TextField
                name="duration"
                label="Duración en minutos"
                fullWidth
                required
                margin="normal"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                inputProps={{
                  min: "0",
                }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={selectedCategoryId}
                  onChange={handleCategoryChange}
                  label="Seleccionar Categoría"
                  required
                >
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No hay categorías disponibles
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              <TextField
                name="type"
                label="Tipo"
                fullWidth
                required
                margin="normal"
                value={formData.type}
                InputProps={{
                  readOnly: true,
                }}
              />
              <Box mt={3}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Crear / Actualizar servicio
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
