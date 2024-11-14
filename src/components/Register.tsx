import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeOffIcon, PenTool } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [rut, setRut] = useState('');
  const [dv, setDv] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/'); // Redirige a la página principal si ya está autenticado
    }
  }, [navigate]);

  const isPasswordValid = (password: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isPasswordValid(password)) {
      toast.error('La contraseña debe tener al menos 8 caracteres, incluyendo letras y números.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    try {
      // Registro del usuario
      const registerResponse = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          rut, 
          dv, 
          nombre, 
          apellido, 
          usuario, 
          email, 
          password,
        }),
      });

      if (!registerResponse.ok) {
        throw new Error('Error al registrar el usuario');
      }

      const registerData = await registerResponse.json();

      // Iniciar sesión automáticamente
      const loginResponse = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role: 3, // Siempre rol 3
        }),
      });

      if (!loginResponse.ok) {
        throw new Error('Error al iniciar sesión');
      }

      const loginData = await loginResponse.json();
      // Almacenar el token y rol en el localStorage
      localStorage.setItem('token', loginData.token);
      localStorage.setItem('id_rol', loginData.rol_id);

      // Mostrar mensaje de éxito
      toast.success('Usuario registrado correctamente.');

      // Redirigir después de un breve retraso
      setTimeout(() => {
        navigate('/');
      }, 2000); // 2000 milisegundos = 2 segundos

    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ocurrió un error inesperado');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      <img
        src="https://media.istockphoto.com/id/1184219605/es/foto/tattoo-artist-haciendo-un-tatuaje-en-un-hombro.jpg?s=612x612&w=0&k=20&c=Cts0guJ8Z-6Hz1KnrfmOM1u4GiohAffkRFT2m56_OM8="
        alt="Fondo"
        className="absolute inset-0 object-cover w-full h-full opacity-80"
        style={{ objectFit: 'cover' }}
      />
      <div className="absolute inset-0 bg-black opacity-40" />
      <ToastContainer />
      <div className="bg-gray-800 text-white shadow-md p-10 w-140 relative z-10" style={{ fontFamily: 'Inter, sans-serif' }}>
        <h1 className="text-2xl font-bold text-center mb-4 flex items-center justify-center">
          <PenTool className="mr-2" size={24} />
          Estudio de Tatuajes
        </h1>
        <p className="text-center mb-4">Regístrate para continuar</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <label htmlFor="rut" className="block mb-1">RUT</label>
              <input
                id="rut"
                type="text"
                required
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                placeholder="Introduce tu RUT"
              />
            </div>
            <div className="w-24">
              <label htmlFor="dv" className="block mb-1">DV</label>
              <input
                id="dv"
                type="text"
                required
                maxLength={1}
                value={dv}
                onChange={(e) => setDv(e.target.value)}
                className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                placeholder="DV"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label htmlFor="nombre" className="block mb-1">Nombre</label>
              <input
                id="nombre"
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                placeholder="Introduce tu nombre"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="apellido" className="block mb-1">Apellido</label>
              <input
                id="apellido"
                type="text"
                required
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                placeholder="Introduce tu apellido"
              />
            </div>
          </div>
          <div>
            <label htmlFor="usuario" className="block mb-1">Usuario</label>
            <input
              id="usuario"
              type="text"
              required
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
              placeholder="Introduce tu nombre de usuario"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1">Correo electrónico</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
              placeholder="Introduce tu correo"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">Contraseña</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                placeholder="Introduce tu contraseña"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon size={20} color="#fff" /> : <EyeIcon size={20} color="#fff" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block mb-1">Confirmar Contraseña</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                placeholder="Confirma tu contraseña"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOffIcon size={20} color="#fff" /> : <EyeIcon size={20} color="#fff" />}
              </button>
            </div>
          </div>
          <button type="submit" className="w-full bg-gray-700 text-white py-2 border border-white hover:bg-gray-600 hover:border-transparent transition duration-200">Registrarse</button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full bg-gray-700 text-white py-2 border border-white hover:bg-gray-600 hover:border-transparent transition duration-200 mt-2"
          >
            Volver a Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}