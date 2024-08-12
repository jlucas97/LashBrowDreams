import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Grid,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import ReservationServices from '../../services/ReservationServices';
import ServiceServices from '../../services/ServiceService';
import UserService from '../../services/UserService';
import 'react-toastify/dist/ReactToastify.css';

const ReservationForm = () => {
  const { control, handleSubmit, reset } = useForm();
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedService, setSelectedService] = useState('');

  useEffect(() => {
    // Obtener la lista de servicios
    ServiceServices.getServices()
      .then((response) => {
        console.log("Servicios", response)
        setServices(response.data || response); // Ajuste según cómo llega la respuesta
      })
      .catch((error) => {
        console.error("Error al obtener los servicios:", error);
        toast.error("Error al obtener los servicios");
      });
  }, []);

  useEffect(() => {
    // Obtener la lista de clientes al cargar el componente
    UserService.getUsers()
      .then((response) => {
        setCustomers(response.results || response); // Ajuste según cómo llega la respuesta
      })
      .catch((error) => {
        console.error("Error al obtener los clientes:", error);
        toast.error("Error al obtener los clientes");
      });
  }, []);

  const onSubmit = (data) => {
    // Verifica los valores seleccionados en el formulario
    console.log('Datos seleccionados:', data);
    console.log('Cliente seleccionado:', selectedCustomer);
    console.log('Servicio seleccionado:', selectedService);
  
    // Verifica que la fecha no sea anterior a la fecha actual
    if (new Date(data.date) < new Date()) {
      toast.error("La fecha seleccionada no puede ser anterior a la actual");
      return;
    }
  
    const reservationData = {
      ...data,
      customerId: selectedCustomer, // Cliente seleccionado
      serviceId: selectedService, // Servicio seleccionado
      status: "Pendiente", // Estado predeterminado
      admin: localStorage.getItem("adminEmail"), // Asegúrate de que la clave sea la correcta
      storeId: localStorage.getItem("selectedStoreId"), // Asegúrate de que la clave sea la correcta
      date: data.date, // Fecha seleccionada en el formulario
      time: data.time, // Hora seleccionada en el formulario
    };
  
    console.log('Datos de la reserva antes de enviar:', reservationData);
  
    // Enviar la solicitud de creación de reserva
    ReservationServices.createReservation(reservationData)
      .then(() => {
        toast.success("Reserva registrada exitosamente");
        reset();
        setSelectedCustomer(''); // Reiniciar selección de cliente
        setSelectedService(''); // Reiniciar selección de servicio
      })
      .catch((error) => {
        console.error("Error al registrar la reserva:", error);
        toast.error("Error al registrar la reserva");
      });
  };
  
  
  const handleCustomerChange = (event) => {
    setSelectedCustomer(event.target.value);
  };

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8, mb: 2 }}>
      <Card>
        <CardHeader
          title="Registrar Nueva Reserva"
          subheader="Complete el formulario para registrar una nueva reserva"
        />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Seleccionar Cliente"
                  fullWidth
                  select
                  value={selectedCustomer}
                  onChange={handleCustomerChange}
                  required
                >
                  {customers.map((customer) => (
                    <MenuItem key={customer.email} value={customer.email}>
                      {customer.name} ({customer.email})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="date"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Fecha"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="time"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Hora"
                      type="time"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="storeId"
                  control={control}
                  defaultValue={localStorage.getItem("selectedStoreId") || ""}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Sucursal"
                      fullWidth
                      required
                      disabled
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Servicio"
                  fullWidth
                  select
                  value={selectedService}
                  onChange={handleServiceChange}
                  required
                >
                  {services.map((service) => (
                    <MenuItem key={service.id} value={service.id}>
                      {service.name || service.Nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Registrar Reserva
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ReservationForm;
