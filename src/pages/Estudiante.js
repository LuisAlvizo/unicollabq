import React from 'react';
import { Route, Routes } from 'react-router-dom';
import VerticalMenu from '../components/VerticalMenu';
import Questions from './Questions';
import MyQuestions from './MyQuestions';
import Profile from './Profile';

const Estudiante = () => {
  return (
    <div style={{ display: 'flex' }}>
      <VerticalMenu />
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="questions" element={<Questions />} />
          <Route path="my-questions" element={<MyQuestions />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default Estudiante;
