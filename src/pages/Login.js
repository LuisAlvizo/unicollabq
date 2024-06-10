import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import LoginImage from '../image/usuario.png'; // Importa tu imagen de inicio de sesión
import RegisterDialog from '../components/RegisterDialog.js'; // Importa el componente del diálogo de registro

function Login() {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false); // Estado para controlar la visibilidad del diálogo de registro

  const handleOpenRegisterDialog = () => {
    setOpenRegisterDialog(true);
  };

  const handleCloseRegisterDialog = () => {
    setOpenRegisterDialog(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3030/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, contrasena })
      });
      const data = await response.json();
      if (response.ok) {
        // Inicio de sesión exitoso
        setError('');
        console.log('Inicio de sesión exitoso:', data);
        // Aquí puedes redirigir al usuario a otra página o actualizar el estado de autenticación en tu aplicación
      } else {
        // Error de inicio de sesión
        setError(data.message);
        console.error('Error de inicio de sesión:', data.message);
      }
    } catch (error) {
      // Error de red o del servidor
      setError('Error de conexión al servidor');
      console.error('Error de conexión al servidor:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Box boxShadow={3} p={4} bgcolor="background.paper" borderRadius={8}>
          <Box mb={4} textAlign="center">
            <img src={LoginImage} alt="Login" height="80" />
          </Box>
          <Typography variant="h4" align="center" gutterBottom>Iniciar Sesión</Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Correo Electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Contraseña"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              required
            />
            <Button variant="contained" color="primary" type="submit" fullWidth>Iniciar Sesión</Button>
          </form>
          <Box mt={2} textAlign="center">
            <Typography variant="body2">¿No tienes una cuenta? <a href="#" onClick={handleOpenRegisterDialog}>Crear nuevo usuario</a></Typography>
          </Box>
        </Box>
      </Box>
      <RegisterDialog open={openRegisterDialog} onClose={handleCloseRegisterDialog} />
    </Container>
  );
}

export default Login;
