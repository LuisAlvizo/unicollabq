import React, { useEffect, useState } from 'react';
import '../Estilos/Users.css'; 

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Lógica para cargar la lista de usuarios desde la API
    fetch('http://localhost:3030/api/users')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setUsers(data.users);
        } else {
          setError('Error al cargar usuarios');
        }
      })
      .catch(error => {
        console.error('Error al cargar usuarios:', error);
        setError('Error al cargar usuarios');
      });
  }, []);

  const handleDeleteUser = userId => {
    // Lógica para eliminar un usuario
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      fetch(`http://localhost:3030/api/user/${userId}`, {
        method: 'DELETE'
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setUsers(prevUsers => prevUsers.filter(user => user.idUsuario !== userId));
            alert('Usuario eliminado correctamente');
          } else {
            alert('Error al eliminar usuario');
          }
        })
        .catch(error => console.error('Error al eliminar usuario:', error));
    }
  };

  return (
    <div className="users-container">
      <h2>Lista de Usuarios</h2>
      {error && <p className="error-message">{error}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo Electrónico</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.idUsuario}>
              <td>{user.idUsuario}</td>
              <td>{user.Nombre}</td>
              <td>{user.Apellido}</td>
              <td>{user.CorreoElectronico}</td>
              <td>{user.Rol}</td>
              <td>
                <button className="btn-delete" onClick={() => handleDeleteUser(user.idUsuario)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
