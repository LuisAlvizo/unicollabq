import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Divider,
  Stack,
  Chip,
  Tooltip
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CommentIcon from '@mui/icons-material/Comment';
import '../Estilos/PostsWithComments.css'; // Mantener CSS para detalles adicionales si lo deseas

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
              const comments = commentsResponse.data.comments;
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

  const handleExpandPost = postId => {
    setExpandedPostId(postId === expandedPostId ? null : postId);
  };

  const handleNewCommentChange = event => {
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
      setPostsWithComments(prevPosts => prevPosts.map(post => {
        if (post.idPost === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      }));

      setNewCommentText('');
    } catch (error) {
      console.error('Error al enviar comentario:', error.response?.data?.message || error.message);
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

  return (
    <Box sx={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', bgcolor: '#f5f5f5', borderRadius: 2 }}>
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
          <Tooltip title="Limpiar Búsqueda">
            <IconButton onClick={handleClearSearch} color="primary">
              <ClearIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {postsWithComments.map(post => (
        <Paper
          key={post.idPost}
          sx={{
            padding: '1.5rem',
            marginBottom: '2rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            '&:hover': { backgroundColor: '#ffffff' },
            borderRadius: '8px',
            boxShadow: 2
          }}
          onClick={() => handleExpandPost(post.idPost)}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {post.Titulo}
            </Typography>
            {post.Categoria && <Chip label={post.Categoria} color="primary" variant="filled" />}
          </Stack>

          <Typography variant="body1" sx={{ marginTop: '0.5rem', color: 'text.secondary' }}>
            {post.Descripcion}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ marginTop: '0.5rem' }}>
            <CommentIcon sx={{ color: 'text.secondary', fontSize: '1rem' }} />
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
              {post.comments.length} Comentarios
            </Typography>
          </Stack>

          {expandedPostId === post.idPost && (
            <Box sx={{ marginTop: '1rem' }} onClick={(e) => e.stopPropagation()}>
              <Divider sx={{ marginBottom: '1rem' }} />

              <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                {post.comments.map(comment => (
                  <li key={comment.idComentario} style={{ marginBottom: '1rem' }}>
                    <Paper
                      sx={{
                        padding: '1rem',
                        backgroundColor: '#ffffff',
                        transition: 'background-color 0.3s',
                        borderRadius: '8px',
                        boxShadow: 1,
                        '&:hover': { backgroundColor: '#f9f9f9' }
                      }}
                      elevation={1}
                    >
                      <Typography variant="body2" sx={{ marginBottom: '0.5rem', fontWeight: 500 }}>
                        {comment.Texto}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', marginBottom: '0.5rem' }}>
                        Por: {comment.NombreUsuario} {comment.ApellidoUsuario}
                      </Typography>
                      <div style={{ fontSize: '1rem', marginTop: '0.5rem' }}>
                        {[...Array(5)].map((_, index) => (
                          <span
                            key={index}
                            style={{ color: index < comment.Valoracion ? '#FFD700' : '#ccc', marginRight: '2px', fontSize: '1.2rem' }}
                          >
                            {index < comment.Valoracion ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                    </Paper>
                  </li>
                ))}
              </ul>

              <Divider sx={{ marginY: '1rem' }} />

              <form
                onSubmit={(e) => { e.preventDefault(); handleSubmitComment(post.idPost, post.Usuario_idUsuario); }}
              >
                <Stack direction="column" spacing={2}>
                  <TextField
                    multiline
                    rows={3}
                    value={newCommentText}
                    onChange={handleNewCommentChange}
                    placeholder="Escribe tu comentario..."
                    variant="outlined"
                    fullWidth
                  />
                  <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-end' }}>
                    Agregar Comentario
                  </Button>
                </Stack>
              </form>
            </Box>
          )}
        </Paper>
      ))}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
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
