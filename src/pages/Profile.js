import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import VerticalMenu from '../components/VerticalMenu';
import axios from 'axios';
import '../Estilos/Profile.css'; // Importa los estilos CSS

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user')).idUsuario;
        const response = await axios.get(`http://localhost:3030/api/user/${userId}`);
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-content">
        {user && (
          <div className="user-info">
            <h2>PERFIL:</h2>
            <p><strong>Name:</strong> {user.Nombre} {user.Apellido}</p>
            <p><strong>Email:</strong> {user.CorreoElectronico}</p>
            <p><strong>Rol:</strong> {user.Rol}</p>
            {/* Add more user information fields here */}
          </div>
        )}
      </div>
      <Outlet />
    </div>
  );
}

export default Profile;
