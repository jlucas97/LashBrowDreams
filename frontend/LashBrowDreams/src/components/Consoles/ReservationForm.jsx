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
  FormControlLabel,
  Checkbox,
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
    ServiceServices.getServices()
      .then((response) => {
        setServices(response.data || response);
      })
      .catch(() => {
        toast.error("Error al obtener los servicios");
      });
  }, []);

  useEffect(() => {
    UserService.getUsers()
      .then((response) => {
        setCustomers(response.results || response);
      })
      .catch(() => {
        toast.error("Error al obtener los clientes");
      });
  }, []);

  const onSubmit = (data) => {
    if (new Date(data.date) < new Date()) {
      toast.error("La fecha seleccionada no puede ser anterior a la actual");
      return;
    }

    const reservationData = {
      ...data,
      customerId: selectedCustomer,
      serviceId: selectedService,
      status: "Pendiente",
      admin: localStorage.getItem("adminEmail"),
      storeId: localStorage.getItem("selectedStoreId"),
      date: data.date,
      time: data.time,
    };

    ReservationServices.createReservation(reservationData)
      .then(() => {
        toast.success("Reserva registrada exitosamente");
        reset();
        setSelectedCustomer('');
        setSelectedService('');
      })
      .catch(() => {
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
                      {service.name || service.Nombre} - Duración {service.Duracion} minutos - ₡{service.Precio} 
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox name="promotions" />}
                  label="¿Te gustaría que te enviemos promociones?"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox name="beautyProducts" />}
                  label="¿Te interesaría algún producto para el cuidado y belleza?"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox name="survey" />}
                  label="¿Podemos enviarte una encuesta al terminar tu cita?"
                />
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
