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
    { id: 4, nombre: 'Biología' },
    { id: 5, nombre: 'Arquitectura' },
    { id: 6, nombre: 'Administración de Empresas' },
    { id: 7, nombre: 'Literatura' },
    { id: 8, nombre: 'Psicología' },
    { id: 9, nombre: 'Física' },
    { id: 10, nombre: 'Química' },
    { id: 11, nombre: 'Matemáticas' },
    { id: 12, nombre: 'Historia' },
    { id: 13, nombre: 'Ingeniería Civil' },
    { id: 14, nombre: 'Educación' },
    { id: 15, nombre: 'Contabilidad' },
    { id: 16, nombre: 'Sociología' },
    { id: 17, nombre: 'Geografía' },
    { id: 18, nombre: 'Filosofía' },
    { id: 19, nombre: 'Informática' },
    { id: 20, nombre: 'Arte' },
    { id: 21, nombre: 'Economía' },
    { id: 22, nombre: 'Ingeniería Eléctrica' },
    { id: 23, nombre: 'Nutrición' },
    { id: 24, nombre: 'Enfermería' },
    { id: 25, nombre: 'Turismo' },
    { id: 26, nombre: 'Diseño Gráfico' },
    { id: 27, nombre: 'Relaciones Internacionales' },
    { id: 28, nombre: 'Cine' },
    { id: 29, nombre: 'Música' },
    { id: 30, nombre: 'Arqueología' },
    { id: 31, nombre: 'Ingeniería Industrial' },
    { id: 32, nombre: 'Odontología' },
    { id: 33, nombre: 'Bioquímica' },
    { id: 34, nombre: 'Veterinaria' },
    { id: 35, nombre: 'Diseño de Modas' },
    { id: 36, nombre: 'Pedagogía' },
    { id: 37, nombre: 'Ciencias Políticas' },
    { id: 38, nombre: 'Ingeniería Mecánica' },
    { id: 39, nombre: 'Antropología' },
    { id: 40, nombre: 'Artes Escénicas' },
    { id: 41, nombre: 'Gastronomía' },
    { id: 42, nombre: 'Biomedicina' },
    { id: 43, nombre: 'Ingeniería Aeroespacial' },
    { id: 44, nombre: 'Estadística' },
    { id: 45, nombre: 'Danza' },
    { id: 46, nombre: 'Geología' },
    { id: 47, nombre: 'Ciencias del Deporte' },
    { id: 48, nombre: 'Teatro' },
    { id: 49, nombre: 'Ingeniería Ambiental' },
    { id: 50, nombre: 'Teología' },
    { id: 51, nombre: 'Astrofísica' },
    { id: 52, nombre: 'Farmacia' },
    { id: 53, nombre: 'Periodismo' },
    { id: 54, nombre: 'Bioinformática' },
    { id: 55, nombre: 'Arquitectura Paisajista' },
    { id: 56, nombre: 'Ingeniería Química' },
    { id: 57, nombre: 'Fotografía' },
    { id: 58, nombre: 'Biotecnología' },
    { id: 59, nombre: 'Lingüística' }
  ];

  const roles = [
    'Estudiante',
    'Profesor',
    'Personal',
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
