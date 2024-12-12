import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { useMediaQuery, useTheme } from '@mui/material';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#000', // Fondo negro
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', // Ligera sombra
});

const StyledTypography = styled(Typography)({
  flexGrow: 1,
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 'bold',
  '&:hover': {
    textDecoration: 'none',
  },
});

const Navbar = ({ user, setUser }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <IconButton
          component={Link}
          to="/"
          edge="start"
          sx={{ color: '#fff', marginRight: '1rem' }}
        >
          <HomeIcon />
        </IconButton>
        <StyledTypography variant="h6" component={Link} to="/">
          UniCollabQ
        </StyledTypography>
        {user ? (
          <>
            <IconButton
              sx={{ marginRight: isMobile ? '0.5rem' : '1rem' }}
            >
              <Avatar alt={user.Nombre} src={user.Foto || ''}>
                {!user.Foto && `${user.Nombre.charAt(0)}${user.Apellido.charAt(0)}`}
              </Avatar>
            </IconButton>
            {!isMobile && (
              <Typography variant="body1" sx={{ color: '#fff', marginRight: '1rem' }}>
                {user.Nombre} {user.Apellido}
              </Typography>
            )}
            <Button
              color="inherit"
              onClick={handleLogout}
              component={Link}
              to="/"
              startIcon={<LogoutIcon />}
              sx={{
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            component={Link}
            to="/login"
            color="inherit"
            startIcon={<LoginIcon />}
            sx={{
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
