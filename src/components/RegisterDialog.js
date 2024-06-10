import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function RegisterDialog({ open, onClose, onRegister }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [carreraId, setCarreraId] = useState('');
  const [rol, setRol] = useState('');
  const [foto, setFoto] = useState(null); // Cambio aquí
  const [error, setError] = useState('');

  const carreras = [
    { id: 1, nombre: 'Ingeniería en Sistemas' },
    { id: 2, nombre: 'Medicina' },
    { id: 3, nombre: 'Derecho' },
    // Agrega el resto de las carreras aquí
    // Asegúrate de incluir el ID y el nombre de cada carrera
  ];

  const roles = [
    'Estudiante',
    'Profesor',
    'Administrativo',
    // Agrega otros roles si es necesario
  ];

  const handleRegister = async () => {
    try {
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('apellido', apellido);
      formData.append('email', email);
      formData.append('contrasena', contrasena);
      formData.append('rol', rol);
      formData.append('idCurso', carreraId);
      if (foto) formData.append('foto', foto);

      const response = await fetch('http://localhost:3030/api/register', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        setError('');
        console.log('Registro exitoso:', data);
        onClose();
        // Aquí puedes hacer cualquier acción adicional después del registro exitoso
      } else {
        setError(data.message);
        console.error('Error de registro:', data.message);
      }
    } catch (error) {
      setError('Error de conexión al servidor');
      console.error('Error de conexión al servidor:', error);
    }
  };

  const handleFileChange = (e) => {
    setFoto(e.target.files[0]);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Registro de Usuario</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
          required
        />
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
        <FormControl variant="outlined" fullWidth margin="normal" required>
          <InputLabel id="select-carrera-label">Carrera</InputLabel>
          <Select
            labelId="select-carrera-label"
            id="select-carrera"
            value={carreraId}
            onChange={(e) => setCarreraId(e.target.value)}
            label="Carrera"
          >
            {carreras.map((carrera) => (
              <MenuItem key={carrera.id} value={carrera.id}>{carrera.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" fullWidth margin="normal" required>
          <InputLabel id="select-rol-label">Rol</InputLabel>
          <Select
            labelId="select-rol-label"
            id="select-rol"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            label="Rol"
          >
            {roles.map((rol) => (
              <MenuItem key={rol} value={rol}>{rol}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          component="label"
          fullWidth
          margin="normal"
        >
          Subir Foto
          <input
            type="file"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        {foto && <Alert severity="info">Archivo seleccionado: {foto.name}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleRegister} color="primary">
          Registrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RegisterDialog;
