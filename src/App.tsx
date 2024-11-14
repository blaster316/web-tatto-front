import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import RegisterTatuadorPage from './components/RegisterTatuador';
import Home from './components/Home';
import Perfil from './components/Perfil';
import PerfilTatuador from './components/PerfilTatuador';
import PerfilPublicacion from './components/PerfilPublicacion';
import PerfilTatuadores from './components/PerfilTatuadores';
import Mensaje from './components/Mensaje';

const App: React.FC = () => {
  const userId = 0; // Cambia esto según cómo manejes la autenticación

  return (
    <Router>
      <Routes>
        {/* Ruta principal que muestra la página de inicio */}
        <Route path="/" element={<Home />} />

        {/* Ruta para el inicio de sesión */}
        <Route path="/login" element={<LoginPage />} />

        {/* Ruta para el registro de usuarios */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Ruta para el registro de tatuadores */}
        <Route path="/registertatuador" element={<RegisterTatuadorPage />} />

        {/* Ruta para el perfil del usuario */}
        <Route path="/perfil" element={<Perfil />} />

        {/* Ruta para el perfil del tatuador */}
        <Route path="/perfiltatuador" element={<PerfilTatuador />} />

        {/* Ruta para el perfil de los tatuadores*/}
        <Route path="/perfiltatuadores/:userId" element={<PerfilTatuadores />} />

        <Route path="/perfilpublicacion" element={<PerfilPublicacion userId={userId} />} />

        <Route path="/mensaje" element={<Mensaje />} />
      </Routes>
    </Router>
  );
};

export default App;