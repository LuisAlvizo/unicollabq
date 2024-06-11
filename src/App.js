import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Estudiante from './pages/Estudiante';
import Profesor from './pages/Profesor';
import Admin from './pages/Admin';
import Questions from './pages/Questions';
import MyQuestions from './pages/MyQuestions';
import Profile from './pages/Profile';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />}/>
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profesor/*" element={<Profesor />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/estudiante/*" element={<Estudiante />} />
      </Routes>
    </Router>
  );
}

export default App;
