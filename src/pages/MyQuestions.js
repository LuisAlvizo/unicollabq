import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Alert,
} from '@mui/material';

const AddPostForm = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estatus, setEstatus] = useState('Abierta');
  const [categoria, setCategoria] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [userPosts, setUserPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user')).idUsuario;
        const response = await axios.get(`http://localhost:3030/api/user/${userId}/posts`);
        setUserPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchUserPosts();
  }, []);

  const handleEditPost = (post) => {
    setEditingPost(post);
    setTitulo(post.Titulo);
    setDescripcion(post.Descripcion);
    setEstatus(post.Estatus);
    setCategoria(post.Categoria);
    setSuccessMessage('');
    setError(null);
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:3030/api/post/${postId}/delete`);
      setSuccessMessage('¡El post se ha eliminado correctamente!');
      setUserPosts(userPosts.filter((post) => post.idPost !== postId));
      setEditingPost(null);
      clearForm();
    } catch (error) {
      setError('Error al eliminar el post.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userId = JSON.parse(localStorage.getItem('user')).idUsuario;

      if (editingPost) {
        await axios.put(`http://localhost:3030/api/post/${editingPost.idPost}/update`, {
          Titulo: titulo,
          Descripcion: descripcion,
          Estatus: estatus,
          Categoria: categoria,
          Usuario_idUsuario: userId,
        });
        setSuccessMessage('¡El post se ha actualizado correctamente!');
        setEditingPost(null);
      } else {
        await axios.post('http://localhost:3030/api/agregarpost', {
          Titulo: titulo,
          Descripcion: descripcion,
          Estatus: estatus,
          Categoria: categoria,
          Usuario_idUsuario: userId,
        });
        setSuccessMessage('¡El post se ha agregado correctamente!');
      }

      clearForm();
    } catch (error) {
      setError('Error al enviar el formulario.');
    }
  };

  const clearForm = () => {
    setTitulo('');
    setDescripcion('');
    setEstatus('Abierta');
    setCategoria('');
    setError(null);
  };

  return (
    <Box sx={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        {editingPost ? 'Editar Post' : 'Agregar Nuevo Post'}
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}
      >
        <TextField
          label="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          multiline
          rows={4}
          fullWidth
          required
        />
        <FormControl fullWidth>
          <InputLabel id="estatus-label">Estatus</InputLabel>
          <Select
            labelId="estatus-label"
            value={estatus}
            onChange={(e) => setEstatus(e.target.value)}
          >
            <MenuItem value="Abierta">Abierta</MenuItem>
            <MenuItem value="Cerrada">Cerrada</MenuItem>
            <MenuItem value="Privada">Privada</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary" size="large">
          {editingPost ? 'Editar Post' : 'Agregar Post'}
        </Button>
      </Box>
      <Typography variant="h5" sx={{ marginTop: '2rem', marginBottom: '1rem' }}>
        Tus Posts
      </Typography>
      <Grid container spacing={2}>
        {userPosts.map((post) => (
          <Grid item xs={12} md={6} key={post.idPost}>
            <Card>
              <CardContent>
                <Typography variant="h6">{post.Titulo}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.Descripcion}
                </Typography>
                <Typography variant="body2">
                  <strong>Estatus:</strong> {post.Estatus}
                </Typography>
                <Typography variant="body2">
                  <strong>Categoría:</strong> {post.Categoria}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleEditPost(post)}
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDeletePost(post.idPost)}
                >
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AddPostForm;
