import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PostsWithComments from './QuestionsProf';
import MyQuestions from './MyQuestions';
import Profile from './Profile';
import VerticalMenuAdmin from '../components/VerticalMenu3';
import Users from './users';
import Graphs from './graphs';

const Profesor = () => {
  return (
    <div style={{ display: 'flex' }}>
      <VerticalMenuAdmin />
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="questions" element={<PostsWithComments />} />
          <Route path="my-questions" element={<MyQuestions />} />
          <Route path="profile" element={<Profile />} />
          <Route path="users" element={<Users />} />
          <Route path="graphs" element={<Graphs />} />
        </Routes>
      </div>
    </div>
  );
};

export default Profesor;
