import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  IconButton,
  Button,
  Typography,
  Paper,
  Divider,
  Stack,
  Tooltip,
  Avatar
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import '../Estilos/PostsWithComments.css'; // Puedes mantenerlo para ajustes menores

const PostsWithComments = ({ user }) => {
  const [postsWithComments, setPostsWithComments] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchCategory, setSearchCategory] = useState('');
  const userId = JSON.parse(localStorage.getItem('user')).idUsuario;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let url;
        if (searchCategory) {
          url = `http://localhost:3030/api/postsByCategory?categoria=${searchCategory}&page=${currentPage}&limit=20`;
        } else {
          url = `http://localhost:3030/api/posts?page=${currentPage}&limit=20`;
        }
        const response = await axios.get(url);
        const data = response.data;

        if (data.success) {
          const posts = data.posts.filter(post => post.Estatus === 'Abierta');
          const totalPages = data.totalPages;

          const postsWithComments = await Promise.all(
            posts.map(async post => {
              const commentsResponse = await axios.get(`http://localhost:3030/api/post/${post.idPost}/comments`);
              const comments = commentsResponse.data.comments.map(comment => ({ ...comment, rating: comment.Valoracion }));
              return { ...post, comments };
            })
          );

          setPostsWithComments(postsWithComments);
          setTotalPages(totalPages);
        } else {
          console.error('Error al obtener posts:', data.message);
        }
      } catch (error) {
        console.error('Error al obtener posts:', error);
      }
    };

    fetchPosts();
  }, [currentPage, searchCategory]);

  const handleExpandPost = (postId) => {
    setExpandedPostId(postId === expandedPostId ? null : postId);
  };

  const handleNewCommentChange = (event) => {
    setNewCommentText(event.target.value);
  };

  const handleSubmitComment = async (postId, postUsuarioId) => {
    try {
      const response = await axios.post(`http://localhost:3030/api/post/${postId}/comment`, {
        texto: newCommentText,
        Usuario_idUsuario: userId,
        postUsuarioId,
        revisionId: 1
      });

      const newComment = response.data.comment;
      setPostsWithComments(prevPosts =>
        prevPosts.map(post => (post.idPost === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post))
      );

      setNewCommentText('');
    } catch (error) {
      console.error('Error al enviar comentario:', error.response?.data?.message);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleClearSearch = () => {
    setSearchCategory('');
  };

  const handleRateComment = async (postId, commentId, rating) => {
    try {
      const response = await axios.post(`http://localhost:3030/api/post/${postId}/comment/${commentId}/rate`, { rating });

      if (response.data.success) {
        setPostsWithComments(prevPosts =>
          prevPosts.map(post => {
            if (post.idPost === postId) {
              const updatedComments = post.comments.map(comment =>
                comment.idComentario === commentId ? { ...comment, Valoracion: rating } : comment
              );
              return { ...post, comments: updatedComments };
            }
            return post;
          })
        );
      } else {
        console.error('Error al valorar el comentario:', response.data.message);
      }
    } catch (error) {
      console.error('Error al valorar el comentario:', error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const response = await axios.delete(`http://localhost:3030/api/post/${postId}/comment/${commentId}`);
      if (response.data.success) {
        setPostsWithComments(prevPosts =>
          prevPosts.map(post => {
            if (post.idPost === postId) {
              const updatedComments = post.comments.filter(comment => comment.idComentario !== commentId);
              return { ...post, comments: updatedComments };
            }
            return post;
          })
        );
      } else {
        console.error('Error al eliminar el comentario:', response.data.message);
      }
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await axios.delete(`http://localhost:3030/api/post/${postId}/delete`);
      if (response.data.success) {
        setPostsWithComments(prevPosts =>
          prevPosts.filter(post => post.idPost !== postId)
        );
      } else {
        console.error('Error al eliminar el post:', response.data.message);
      }
    } catch (error) {
      console.error('Error al eliminar el post:', error);
    }
  };

  // Función para generar avatar inicial según el nombre del usuario (puedes adaptarla si tienes info del autor del post)
  const getInitials = (name = '', lastName = '') => {
    return (name.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  return (
    <Box sx={{ maxWidth: 900, margin: '0 auto', padding: '2rem', bgcolor: '#f7f7f7', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
        Foro de Publicaciones
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          alignItems: 'center',
          bgcolor: '#fff',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: 1
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          label="Buscar por categoría"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          placeholder="Ej: Tecnología, Educación..."
        />
        {searchCategory && (
          <IconButton onClick={handleClearSearch} color="primary">
            <ClearIcon />
          </IconButton>
        )}
      </Box>

      {postsWithComments.map((post) => (
        <Paper
          key={post.idPost}
          sx={{
            padding: '1.5rem',
            marginBottom: '2rem',
            borderRadius: '8px',
            boxShadow: 3,
            transition: 'background-color 0.3s',
            '&:hover': { backgroundColor: '#ffffff' }
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box sx={{ flex: 1, cursor: 'pointer' }} onClick={() => handleExpandPost(post.idPost)}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {post.Titulo}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: '0.5rem', color: 'text.secondary' }}>
                {post.Descripcion}
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', marginBottom: '0.5rem', color: 'text.secondary' }}>
                {post.comments.length} Comentarios
              </Typography>
              {/* Información adicional del post (puedes personalizar si tienes datos del autor del post) */}
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                Publicado por: Usuario {post.Usuario_idUsuario} {/* Ajusta según tus datos */}
              </Typography>
            </Box>

            <Tooltip title="Eliminar Post">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePost(post.idPost);
                }}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          {expandedPostId === post.idPost && (
            <Box sx={{ marginTop: '1rem' }} onClick={(e) => e.stopPropagation()}>
              <Divider sx={{ marginBottom: '1rem' }} />
              <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0 }}>
                {post.comments.map((comment) => {
                  const initials = getInitials(comment.NombreUsuario, comment.ApellidoUsuario);
                  return (
                    <li key={comment.idComentario} style={{ marginBottom: '1rem' }}>
                      <Paper
                        sx={{
                          padding: '1rem',
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          boxShadow: 1,
                          '&:hover': { backgroundColor: '#f9f9f9' }
                        }}
                        elevation={1}
                      >
                        <Stack direction="row" alignItems="flex-start" spacing={2}>
                          <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 'bold' }}>
                            {initials}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ marginBottom: '0.5rem' }}>
                              {comment.Texto}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', marginBottom: '0.5rem' }}>
                              Por: {comment.NombreUsuario} {comment.ApellidoUsuario}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                              {[...Array(5)].map((_, index) => (
                                <span
                                  key={index}
                                  style={{
                                    cursor: 'pointer',
                                    color: index < comment.Valoracion ? '#FFD700' : '#ccc',
                                    marginRight: '2px',
                                    fontSize: '1.2rem'
                                  }}
                                  onClick={() => handleRateComment(post.idPost, comment.idComentario, index + 1)}
                                >
                                  {index < comment.Valoracion ? '★' : '☆'}
                                </span>
                              ))}
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <Tooltip title="Eliminar comentario">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteComment(post.idPost, comment.idComentario)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </Stack>
                      </Paper>
                    </li>
                  );
                })}
              </ul>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitComment(post.idPost, post.Usuario_idUsuario);
                }}
              >
                <Stack direction="column" spacing={2} sx={{ marginTop: '1rem' }}>
                  <TextField
                    multiline
                    rows={3}
                    value={newCommentText}
                    onChange={handleNewCommentChange}
                    placeholder="Escribe tu comentario..."
                    variant="outlined"
                    fullWidth
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="submit" variant="contained">
                      Agregar Comentario
                    </Button>
                  </Box>
                </Stack>
              </form>
            </Box>
          )}
        </Paper>
      ))}

      {totalPages > 1 && (
        <Box className="pagination" sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <Button onClick={handlePrevPage} disabled={currentPage === 1} variant="outlined">
            Anterior
          </Button>
          <Button onClick={handleNextPage} disabled={currentPage === totalPages} variant="outlined">
            Siguiente
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PostsWithComments;
