import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Typography, Box, CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import ReservationServices from '../../services/ReservationServices';

const ReservationsChart = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const storeId = localStorage.getItem('selectedStoreId');
  const today = dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    ReservationServices.getReservationsByStoreAndUser(
      storeId,
      null,  // Email del admin si está disponible, de lo contrario null
      null,   // Email del usuario si está disponible, de lo contrario null
      today
    )
      .then((response) => {
        console.log("JSON de las citas obtenidas:", response.results); // Imprimir el JSON para depuración

        const sortedAppointments = response.results.sort((a, b) => {
          return dayjs(a.time, 'HH:mm:ss').hour() - dayjs(b.time, 'HH:mm:ss').hour();
        });
        setAppointments(sortedAppointments);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener las citas:", error);
        setLoading(false);
      });
  }, [storeId, today]);

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ textAlign: 'center', padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Citas del Día de Hoy
      </Typography>
      <Typography variant="h6" gutterBottom>
        Total de Citas: {appointments.length}
      </Typography>
      <List>
        {appointments.map((appointment, index) => {
          const formattedTime = dayjs(appointment.time, 'HH:mm:ss').isValid()
            ? dayjs(appointment.time, 'HH:mm:ss').format('HH')
            : 'Hora inválida';
            
          return (
            <ListItem key={index}>
              <ListItemText
        
                secondary={`Cliente: ${appointment.customerId}`}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default ReservationsChart;
