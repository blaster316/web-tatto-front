import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PerfilPublicacion from './PerfilPublicacion';
import CalendarioCita from './CalendarioCita'; // Importa el componente
import { ToastContainer } from 'react-toastify';
import { Grid } from 'lucide-react';

interface User {
  id: number;
  nombre: string | null;
  apellido: string | null;
  usuario: string | null;
  email: string;
  rol_id: number;
  estado_id: number;
  texto: string | null;
  foto: string | null;
}

const ProfileImage = ({ foto }: { foto: string | null }) => {
  const imageUrl = foto ? `http://localhost:3000/${foto}` : 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg';

  return (
    <div className="relative">
      <img
        src={imageUrl}
        alt="Perfil"
        className="rounded-full w-20 h-20 md:w-32 md:h-32 border-2 border-gray-700"
      />
    </div>
  );
};

const ProfileStats = () => (
  <div className="flex justify-around mt-4">
    {['Publicaciones', 'Seguidores', 'Seguidos'].map((label, index) => (
      <div key={index} className="text-center">
        <div className="font-bold">{Math.floor(Math.random() * 1000)}</div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>
    ))}
  </div>
);

export default function PerfilTatuadores() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('posts');
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [ocupadas, setOcupadas] = useState<{ fecha: string; hora: string }[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userIdNumber = parseInt(userId || '0', 10);
      if (isNaN(userIdNumber)) {
        console.error('ID inválido:', userId);
        return;
      }

      try {
        // Obtener datos del usuario
        const response = await fetch(`http://localhost:3000/user/${userIdNumber}`);
        if (!response.ok) throw new Error('Error al obtener los datos del usuario');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      }

      try {
        // Obtener citas del tatuador
        const responseCitas = await fetch(`http://localhost:3000/citas/${userIdNumber}`);
        if (!responseCitas.ok) throw new Error('Error al obtener las citas');
        const citasData = await responseCitas.json();

        // Formatear las citas
        const formattedCitas = citasData.map((cita: any) => ({
          fecha: cita.fecha, // Mantén la fecha completa en formato 'YYYY-MM-DD'
          hora: cita.hora.split('.')[0] // Obtener solo la hora
        }));

        setOcupadas(formattedCitas);
        console.log("Citas ocupadas:", formattedCitas); // Log para verificar las citas ocupadas
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <Header />
      <div className="bg-gray-900 text-white min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="flex items-center justify-between mb-8">
            <ProfileImage foto={user.foto} />
            <div className="flex-grow ml-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{user.usuario || 'Sin Información'}</h1>
              </div>
              <ProfileStats />
              <div className="mt-4 flex space-x-4">
                <button
                  className="border-2 border-white text-white px-4 py-1 text-sm transition duration-300 hover:bg-red-600 hover:border-red-600"
                  style={{ borderRadius: '0' }}
                >
                  Seguir
                </button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="font-bold">Tatuador</h2>
            <p className="text-sm text-gray-400">
              {user.nombre && user.apellido
                ? `${user.nombre} ${user.apellido}`
                : user.nombre || user.apellido
                ? user.nombre || user.apellido
                : 'Sin Información'} - {user.texto || 'Amante y apasionado de los tatuajes.'}
            </p>
          </div>

          <div className="border-t border-gray-700 mt-6">
            <div className="flex justify-around py-2">
              <button
                className={`text-sm font-semibold flex items-center ${activeTab === 'posts' ? 'text-white' : 'text-gray-400'}`}
                onClick={() => setActiveTab('posts')}
              >
                <Grid size={16} className="mr-1" /> Publicaciones
              </button>
              <button
                className={`text-sm font-semibold flex items-center ${activeTab === 'agendar' ? 'text-white' : 'text-gray-400'}`}
                onClick={() => setActiveTab('agendar')}
              >
                <Grid size={16} className="mr-1" /> Agendar
              </button>
            </div>
          </div>

          <div className="mt-4">
            {activeTab === 'posts' && (
              <PerfilPublicacion userId={user.id} />
            )}
            {activeTab === 'agendar' && (
              <div className="text-center">
                <h2 className="font-bold text-lg">Agenda tu cita aquí</h2>
                <CalendarioCita ocupadas={ocupadas} tatuadorId={user.id.toString()} />
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
      <ToastContainer />
    </>
  );
}