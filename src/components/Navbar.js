// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)({
  background: 'linear-gradient(to right, #000000, #434343)',
});

const StyledTypography = styled(Typography)({
  flexGrow: 1,
  color: '#fff',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'none',
  },
});

const StyledButton = styled(Button)({
  color: '#fff',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'none',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});

const Navbar = ({ user, setUser }) => {
  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token de autenticación
    localStorage.removeItem('user');  // Elimina los datos del usuario
    setUser(null); // Limpia el estado del usuario
  };

  return (
    <div>
      <StyledAppBar position="static">
        <Toolbar>
          <StyledTypography variant="h6" component={Link} to="/">
            UniCollabQ
          </StyledTypography>
          {user ? (
            <>
              <StyledTypography variant="body1" color="inherit">
                {user.Nombre} {user.Apellido}
              </StyledTypography>
              <StyledButton color="inherit" onClick={handleLogout} component={Link} to="/">Logout</StyledButton>
            </>
          ) : (
            <>
              <StyledButton component={Link} to="/" color="inherit">Home</StyledButton>
              <StyledButton component={Link} to="/about" color="inherit">About</StyledButton>
              <StyledButton component={Link} to="/contact" color="inherit">Contact</StyledButton>
              <StyledButton component={Link} to="/login" color="inherit">Login</StyledButton>
            </>
          )}
        </Toolbar>
      </StyledAppBar>
    </div>
  );
};

export default Navbar;
