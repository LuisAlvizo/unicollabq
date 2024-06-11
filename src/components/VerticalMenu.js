import React from 'react';
import { Link } from 'react-router-dom';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PersonIcon from '@mui/icons-material/Person';

const VerticalMenu = () => {
  return (
    <Box sx={{ width: 250, bgcolor: '#FFFFFF', color: '#333', height: '100vh', padding: '1rem' }}>
      <List>
        <ListItem button component={Link} to="/estudiante/questions" sx={{ marginBottom: '1rem' }}>
          <ListItemIcon>
            <HomeIcon sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText primary="Inicio" sx={{ color: '#333' }} />
        </ListItem>
        <ListItem button component={Link} to="/estudiante/questions" sx={{ marginBottom: '1rem' }}>
          <ListItemIcon>
            <QuestionAnswerIcon sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText primary="Todas las publicaciones" sx={{ color: '#333' }} />
        </ListItem>
        <ListItem button component={Link} to="/estudiante/my-questions" sx={{ marginBottom: '1rem' }}>
          <ListItemIcon>
            <QuestionAnswerIcon sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText primary="Mis Publicaciones" sx={{ color: '#333' }} />
        </ListItem>
      </List>
      <List>
        <ListItem button component={Link} to="/estudiante/profile" sx={{ marginBottom: '1rem' }}>
          <ListItemIcon>
            <PersonIcon sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText primary="Mi perfil" sx={{ color: '#333' }} />
        </ListItem>
        <ListItem button onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = "/login";
        }}>
          <ListItemText primary="Cerrar sesión" sx={{ color: '#333' }} />
        </ListItem>
      </List>
    </Box>
  );
};

export default VerticalMenu;
