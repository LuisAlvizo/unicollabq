import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  CircularProgress,
  Pagination
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    // Cargar lista de usuarios desde la API
    fetch('http://localhost:3030/api/users')
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        if (data.success) {
          setUsers(data.users);
        } else {
          setError('Error al cargar usuarios');
        }
      })
      .catch(error => {
        console.error('Error al cargar usuarios:', error);
        setError('Error al cargar usuarios');
        setLoading(false);
      });
  }, []);

  const handleOpenConfirmDialog = (userId) => {
    setSelectedUserId(userId);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setSelectedUserId(null);
  };

  const handleDeleteUser = () => {
    if (!selectedUserId) return;
    fetch(`http://localhost:3030/api/user/${selectedUserId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setUsers(prevUsers => prevUsers.filter(user => user.idUsuario !== selectedUserId));
        } else {
          alert('Error al eliminar usuario');
        }
        handleCloseConfirmDialog();
      })
      .catch(error => {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar usuario');
        handleCloseConfirmDialog();
      });
  };

  // Lógica de paginación
  const totalUsers = users.length;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', padding: '2rem' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
        Lista de Usuarios
      </Typography>
      {error && (
        <Alert severity="error" sx={{ marginBottom: '1rem' }}>
          {error}
        </Alert>
      )}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ padding: '1rem', borderRadius: '8px' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Apellido</strong></TableCell>
                <TableCell><strong>Correo Electrónico</strong></TableCell>
                <TableCell><strong>Rol</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentUsers.map(user => (
                <TableRow key={user.idUsuario} hover>
                  <TableCell>{user.idUsuario}</TableCell>
                  <TableCell>{user.Nombre}</TableCell>
                  <TableCell>{user.Apellido}</TableCell>
                  <TableCell>{user.CorreoElectronico}</TableCell>
                  <TableCell>{user.Rol}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Eliminar Usuario">
                      <IconButton
                        color="error"
                        onClick={() => handleOpenConfirmDialog(user.idUsuario)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {currentUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography variant="body1" color="text.secondary" align="center">
                      No hay usuarios registrados.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </Paper>
      )}

      <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog}>
        <DialogTitle>¿Estás seguro de que quieres eliminar este usuario?</DialogTitle>
        <DialogActions sx={{ padding: '1rem' }}>
          <Button onClick={handleCloseConfirmDialog} variant="outlined" color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
