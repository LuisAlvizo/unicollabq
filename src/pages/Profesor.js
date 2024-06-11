import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PostsWithComments from './QuestionsProf';
import MyQuestions from './MyQuestions';
import Profile from './Profile';
import VerticalMenuProf from '../components/VerticalMenu2';

const Profesor = () => {
  return (
    <div style={{ display: 'flex' }}>
      <VerticalMenuProf />
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="questions" element={<PostsWithComments />} />
          <Route path="my-questions" element={<MyQuestions />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default Profesor;
