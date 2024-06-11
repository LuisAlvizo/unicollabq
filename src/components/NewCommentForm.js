import React, { useState } from 'react';
import axios from 'axios';

const NewCommentForm = ({ postId, loggedInUser }) => {
    const [commentText, setCommentText] = useState('');
    const [error, setError] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!loggedInUser || !loggedInUser.idUsuario) {
        setError('Debes iniciar sesión para agregar un comentario.');
        return;
      }
      try {
        const response = await axios.post(`http://localhost:3030/api/post/${postId}/comment`, {
          Texto: commentText,
          Usuario_idUsuario: loggedInUser.idUsuario
        });
        console.log('Comentario agregado:', response.data);
        // Limpiar el formulario y realizar otras acciones después de agregar el comentario
        setCommentText('');
        setError('');
      } catch (error) {
        console.error('Error al agregar comentario:', error);
        setError('Error al agregar el comentario. Por favor, inténtalo de nuevo más tarde.');
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Escribe tu comentario..."
          required
        />
        <button type="submit">Agregar Comentario</button>
      </form>
    );
  };
  
export default NewCommentForm;
