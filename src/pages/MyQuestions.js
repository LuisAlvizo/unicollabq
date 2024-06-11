import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Estilos/AddPostForm.css';

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
      setUserPosts(userPosts.filter(post => post.idPost !== postId)); 
      setEditingPost(null); 
      clearForm(); 
    } catch (error) {
      setError(error.response.data.message);
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
          Usuario_idUsuario: userId
        });
        setSuccessMessage('¡El post se ha actualizado correctamente!');
        setEditingPost(null); 
        clearForm(); 
      } else { 
        const response = await axios.post('http://localhost:3030/api/agregarpost', {
          Titulo: titulo,
          Descripcion: descripcion,
          Estatus: estatus,
          Categoria: categoria,
          Usuario_idUsuario: userId
        });
        setSuccessMessage('¡El post se ha agregado correctamente!');
      }

      clearForm();
    } catch (error) {
      setError(error.response.data.message);
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
    <div className="add-post-form-container">
      <h2>{editingPost ? 'Editar Post' : 'Agregar Nuevo Post'}</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="add-post-form">
        <div className="form-group">
          <label>Título:</label>
          <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Descripción:</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Estatus:</label>
          <select value={estatus} onChange={(e) => setEstatus(e.target.value)}>
            <option value="Abierta">Abierta</option>
            <option value="Cerrada">Cerrada</option>
            <option value="Privada">Privada</option>
          </select>
        </div>
        <div className="form-group">
          <label>Categoría:</label>
          <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} />
        </div>
        <button type="submit" className="submit-button">{editingPost ? 'Editar Post' : 'Agregar Post'}</button>
      </form>
      <div className="user-posts">
        <h2>Tus Posts</h2>
        {userPosts.map(post => (
          <div key={post.idPost} className="post-card">
            <h3>{post.Titulo}</h3>
            <p>{post.Descripcion}</p>
            <p><strong>Estatus:</strong> {post.Estatus}</p>
            <p><strong>Categoría:</strong> {post.Categoria}</p>
            <div className="button-group">
            <button className="action-button edit-button" onClick={() => handleEditPost(post)}>Editar</button>
            <button className="action-button delete-button" onClick={() => handleDeletePost(post.idPost)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddPostForm;
