import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';
import LoginImage from '../image/usuario.png';
import RegisterDialog from '../components/RegisterDialog.js';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);

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
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setError('');
        console.log('Inicio de sesión exitoso:', data);
        // Pasar los datos del usuario al Navbar
        switch (data.user.Rol) {
          case 'Estudiante':
            navigate('/estudiante/questions');
            break;
          case 'Profesor':
            navigate('/profesor/questions');
            break;
          case 'Personal':
            navigate('/admin/questions');
            break;
          default:
            navigate('/');
            break;
        }
        setUser(data.user);

      } else {
        setError(data.message);
        console.error('Error de inicio de sesión:', data.message);
      }
    } catch (error) {
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