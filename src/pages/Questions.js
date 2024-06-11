import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Estilos/PostsWithComments.css';

const PostsWithComments = ({ user }) => {
  const [postsWithComments, setPostsWithComments] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchCategory, setSearchCategory] = useState('');
  const userId = JSON.parse(localStorage.getItem('user')).idUsuario; // Obtener el idUsuario del localStorage

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
          const posts = data.posts;
          const totalPages = data.totalPages;

          const postsWithComments = await Promise.all(posts.map(async post => {
            const commentsResponse = await axios.get(`http://localhost:3030/api/post/${post.idPost}/comments`);
            const comments = commentsResponse.data.comments;
            return { ...post, comments };
          }));

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
        Usuario_idUsuario: userId, // Pasar el idUsuario almacenado en localStorage
        postUsuarioId, // Pasar el id del usuario que hizo el post
        revisionId: 1 // Pasar el id de la revisión
      });

      const newComment = response.data.comment;
      // Actualizar la lista de comentarios para el post actualizado
      setPostsWithComments(prevPosts => prevPosts.map(post => {
        if (post.idPost === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      }));

      // Limpiar el campo de texto
      setNewCommentText('');
    } catch (error) {
      console.error('Error al enviar comentario:', error.response.data.message);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleClearSearch = () => {
    setSearchCategory('');
  };

  return (
    <div className="post-list">
      <div className="search-bar">
        <input type="text" value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)} placeholder="Buscar por categoría" />
        {searchCategory && <button onClick={handleClearSearch}>Clear</button>}
      </div>
      <h2>POSTS</h2>
      {postsWithComments.map(post => (
        <div key={post.idPost} className="post-card">
          <div className="post-header" onClick={() => handleExpandPost(post.idPost)}>
            <h3>{post.Titulo}</h3>
            <p>{post.Descripcion}</p>
            <p>{post.comments.length} Comments</p> {/* Mostrar el número de comentarios */}
          </div>
          {expandedPostId === post.idPost && (
            <div className="post-comments">
              <ul className="comments-list">
                {post.comments.map(comment => (
                  <li key={comment.idComentario} className="comment">
                    <p>{comment.Texto}</p>
                    <p className="comment-user">By: {comment.NombreUsuario} {comment.ApellidoUsuario}</p>
                  </li>
                ))}
              </ul>
              <form onSubmit={(e) => {e.preventDefault(); handleSubmitComment(post.idPost, post.Usuario_idUsuario);}}>
                <textarea value={newCommentText} onChange={handleNewCommentChange} />
                <button type="submit">Add Comment</button>
              </form>
            </div>
          )}
        </div>
      ))}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default PostsWithComments;
