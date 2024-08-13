import React, { useState } from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import UserService from '../../services/UserService';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await UserService.login(email, password);

      if (response.status === 200) {
        // Guardar el token y rol del usuario en el localStorage
        localStorage.setItem('userToken', response.results.token);
        localStorage.setItem('userRole', response.results.role);

        toast.success('Inicio de sesión exitoso');
        // Redirigir o actualizar la interfaz según el rol
        window.location.href = '/dashboard';
      } else {
        toast.error('Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      toast.error('Error al iniciar sesión');
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Iniciar Sesión
      </Typography>
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Contraseña"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
        sx={{ mt: 2 }}
      >
        Iniciar Sesión
      </Button>
    </Container>
  );
}

export default LoginForm;
