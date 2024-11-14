import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeOffIcon, PenTool } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const userTypes = ['usuario', 'tatuador', 'administrador'] as const;
type UserType = typeof userTypes[number];

const roleMap: Record<UserType, number> = {
  usuario: 3,
  tatuador: 2,
  administrador: 1,
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('usuario');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/'); // Redirige a la página principal si ya está autenticado
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const rolId = roleMap[userType];

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role: rolId }),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('id_rol', data.rol_id.toString());
      localStorage.setItem('userId', data.userId.toString());

      // Mostrar mensaje de éxito
      toast.success('Bienvenido');

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
      <div className="bg-gray-800 text-white shadow-md p-8 w-96 relative z-10" style={{ fontFamily: 'Inter, sans-serif' }}>
        <h1 className="text-2xl font-bold text-center mb-4 flex items-center justify-center">
          <PenTool className="mr-2" size={24} />
          Estudio de Tatuajes
        </h1>
        <p className="text-center mb-4">Inicia sesión para continuar</p>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex justify-center space-x-4">
            {userTypes.map((type) => (
              <label key={type} className={`flex items-center cursor-pointer py-1 px-2 transition duration-200 ${userType === type ? 'bg-gray-600 text-white' : 'bg-gray-700 text-white'}`}>
                <input
                  type="radio"
                  id={type}
                  value={type}
                  checked={userType === type}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                  className="mr-2 hidden"
                />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
          </div>
          <button type="submit" className="w-full bg-gray-700 text-white py-2 border border-white hover:bg-gray-600 hover:border-transparent transition duration-200">Iniciar Sesión</button>
          {userType === 'usuario' && (
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="w-full bg-gray-700 text-white py-2 border border-white hover:bg-gray-600 hover:border-transparent transition duration-200 mt-2"
            >
              Registrarse
            </button>
          )}
          {userType === 'tatuador' && (
            <button
              type="button"
              onClick={() => navigate('/registertatuador')}
              className="w-full bg-gray-700 text-white py-2 border border-white hover:bg-gray-600 hover:border-transparent transition duration-200 mt-2"
            >
              Registrarse
            </button>
          )}
        </form>
        <div className="mt-4 text-center">
          <a href="#" className="text-blue-400 hover:underline">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>
  );
}