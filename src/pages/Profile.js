import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import VerticalMenu from '../components/VerticalMenu';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Stack
} from '@mui/material';
import '../Estilos/Profile.css'; // Mantén tu CSS por si necesitas detalles adicionales

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user')).idUsuario;
        const response = await axios.get(`http://localhost:3030/api/user/${userId}`);
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Función para generar iniciales del usuario en caso de no tener imagen.
  const getInitials = (name = '', lastName = '') => {
    return (name.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f7f7f7' }}>

      <Box sx={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ marginBottom: '2rem', textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Mi Perfil
          </Typography>
        </Box>

        {user ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ maxWidth: 400, width: '100%', borderRadius: '12px', boxShadow: 3 }}>
              <CardContent>
                <Stack spacing={2} alignItems="center" sx={{ marginBottom: '1rem' }}>
                  {user.FotoPerfil ? (
                    <Avatar
                      src={`http://localhost:3030${user.FotoPerfil}`} 
                      sx={{ width: 80, height: 80 }}
                    />
                  ) : (
                    <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80 }}>
                      {getInitials(user.Nombre, user.Apellido)}
                    </Avatar>
                  )}
                </Stack>

                <Stack spacing={1}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    {user.Nombre} {user.Apellido}
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                    {user.CorreoElectronico}
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', fontStyle: 'italic' }}>
                    Rol: {user.Rol}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
            <CircularProgress />
          </Box>
        )}

        <Box sx={{ marginTop: '2rem' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Profile;
