import { useState, useEffect } from 'react';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Estudiante from './pages/Estudiante';
import Profesor from './pages/Profesor';
import Admin from './pages/Admin';



function App() {

  const [user, setUser] = useState(null); // Estado del usuario

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
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login setUser={setUser} />} /> {/* Pasa la función setUser al componente Login */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/estudiante" element={<Estudiante />} />
        <Route path="/profesor" element={<Profesor />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
