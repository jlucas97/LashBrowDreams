import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { format } from 'date-fns';

export const ScheduleFormModal = ({ open, onClose, onSubmit }) => {
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [type, setType] = useState('horario');

  const handleSubmit = () => {
    const formattedStartTime = format(new Date(`1970-01-01T${startTime}:00`), 'HH:mm:ss');
    const formattedEndTime = format(new Date(`1970-01-01T${endTime}:00`), 'HH:mm:ss');

    onSubmit({
      dayOfWeek,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      type,
    });

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 300, bgcolor: 'background.paper', p: 4, borderRadius: 1
      }}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Día de la semana</InputLabel>
          <Select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
            <MenuItem value={1}>Lunes</MenuItem>
            <MenuItem value={2}>Martes</MenuItem>
            <MenuItem value={3}>Miércoles</MenuItem>
            <MenuItem value={4}>Jueves</MenuItem>
            <MenuItem value={5}>Viernes</MenuItem>
            <MenuItem value={6}>Sábado</MenuItem>
            <MenuItem value={7}>Domingo</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Hora de inicio"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Hora de fin"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Tipo de Bloque</InputLabel>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <MenuItem value="horario">Horario</MenuItem>
            <MenuItem value="bloqueo">Bloqueo</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
          Crear
        </Button>
      </Box>
    </Modal>
  );
};
