// Estudiante.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import VerticalMenu from '../components/VerticalMenu';

function Profile() {
  return (
    <div style={{ display: 'flex' }}>
      <VerticalMenu />
      <Outlet />
    </div>
  );
}

export default Profile;
