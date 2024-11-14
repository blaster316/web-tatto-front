import React, { useState, useEffect } from 'react';
import { Image, Settings, Grid, Film, Bookmark, X, Upload } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import PerfilPublicacion from './PerfilPublicacion';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const ProfileImage = ({ foto, onImageChange }: { foto: string | null; onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  const imageUrl = foto ? `http://localhost:3000/${foto}` : 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg';

  return (
    <div className="relative">
      <img
        src={imageUrl}
        alt="Perfil"
        className="rounded-full w-20 h-20 md:w-32 md:h-32 border-2 border-gray-700"
      />
      <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-white text-gray-800 rounded-full p-2 cursor-pointer">
        <Image size={16} />
      </label>
      <input
        id="profile-image"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImageChange}
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

export default function PerfilTatuador() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [publicationImage, setPublicationImage] = useState<File | null>(null);
  const [publicationMessage, setPublicationMessage] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]); // Nuevo estado para las publicaciones
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const idRol = localStorage.getItem('id_rol');

    if (!token || !userId || idRol !== '2') {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/user/${userId}`);
        if (!response.ok) throw new Error('Error al obtener los datos del usuario');
        const data = await response.json();
        setUser(data);
        setEditedUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/user/${userId}/posts`);
        if (!response.ok) throw new Error('Error al obtener las publicaciones del usuario');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
    fetchUserPosts();
  }, [navigate]);

  const handleEditProfile = () => setIsEditModalOpen(true);
  const handleCloseModal = () => setIsEditModalOpen(false);
  const handleUploadModalToggle = () => setIsUploadModalOpen(prev => !prev);
  const handleSettingsToggle = () => setIsSettingsOpen(prev => !prev);
  const handleCloseSettings = () => setIsSettingsOpen(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('foto', file);

      try {
        const response = await fetch(`http://localhost:3000/user/${user?.id}/photo`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error || 'Error al actualizar la foto de perfil');
        }

        const updatedPhotoResponse = await response.json();
        setUser(prev => (prev ? { ...prev, foto: updatedPhotoResponse.foto } : null));
        toast.success('Foto de perfil actualizada con éxito');
      } catch (error) {
        console.error('Error al actualizar la foto de perfil:', error);
        toast.error('Error al actualizar la foto de perfil');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editedUser) {
      try {
        const updatedData = {
          ...editedUser,
          nombre: editedUser.nombre?.trim() || null,
          apellido: editedUser.apellido?.trim() || null,
          texto: editedUser.texto?.trim() || null,
        };

        const response = await fetch(`http://localhost:3000/user/${updatedData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error || 'Error al actualizar el perfil');
        }

        const updatedUserResponse = await response.json();
        setUser(prev => (prev ? { ...prev, ...updatedUserResponse } : null));
        toast.success('Perfil actualizado con éxito');
        setIsEditModalOpen(false);
      } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        toast.error('Error al actualizar el perfil');
      }
    }
  };

  const handleSubmitPublication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (publicationImage) {
      const formData = new FormData();
      formData.append('imagen', publicationImage);
      formData.append('texto', publicationMessage);

      try {
        const response = await fetch(`http://localhost:3000/user/${user?.id}/publicacion`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error || 'Error al subir la publicación');
        }

        toast.success('Publicación subida con éxito');
        setPublicationImage(null);
        setPublicationMessage('');
        handleUploadModalToggle();
        // Refrescar las publicaciones después de subir una
        const newResponse = await fetch(`http://localhost:3000/user/${user?.id}/posts`);
        const newPosts = await newResponse.json();
        setPosts(newPosts);
      } catch (error) {
        console.error('Error al subir la publicación:', error);
        toast.error('Error al subir la publicación');
      }
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <Header />
      <div className="bg-gray-900 text-white min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="flex items-center justify-between mb-8">
            <ProfileImage foto={user.foto} onImageChange={handleImageChange} />
            <div className="flex-grow ml-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{user.usuario || 'Sin Información'}</h1>
                <div className="relative">
                  <Settings
                    className="text-gray-400 cursor-pointer hover:text-white"
                    onClick={handleSettingsToggle}
                  />
                  {isSettingsOpen && (
                    <div className="absolute right-0 mt-2 bg-gray-800 rounded-lg shadow-lg z-10">
                      <button
                        className="block px-4 py-2 text-sm text-white hover:bg-red-600 w-full text-left"
                        onClick={handleUploadModalToggle}
                      >
                        Subir Publicación
                      </button>
                      <button
                        className="block px-4 py-2 text-sm text-white hover:bg-red-600 w-full text-left"
                        onClick={() => { /* manejar ver citas */ handleCloseSettings(); }}
                      >
                        Ver Citas
                      </button>
                      <button
                        className="block px-4 py-2 text-sm text-white hover:bg-red-600 w-full text-left"
                        onClick={() => { /* manejar guardados */ handleCloseSettings(); }}
                      >
                        Guardados
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <ProfileStats />
              <div className="mt-4 flex space-x-4">
                <button
                  className="border-2 border-white text-white px-4 py-1 text-sm transition duration-300 hover:bg-red-600 hover:border-red-600"
                  style={{ borderRadius: '0' }}
                  onClick={handleEditProfile}
                >
                  Editar perfil
                </button>
                <button className="border-2 border-white text-white px-4 py-1 text-sm transition duration-300 hover:bg-red-600 hover:border-red-600" style={{ borderRadius: '0' }}>
                  Compartir perfil
                </button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="font-bold">Sobre mí</h2>
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
                className={`text-sm font-semibold flex items-center ${activeTab === 'reels' ? 'text-white' : 'text-gray-400'}`}
                onClick={() => setActiveTab('reels')}
              >
                <Film size={16} className="mr-1" /> Reels
              </button>
              <button
                className={`text-sm font-semibold flex items-center ${activeTab === 'saved' ? 'text-white' : 'text-gray-400'}`}
                onClick={() => setActiveTab('saved')}
              >
                <Bookmark size={16} className="mr-1" /> Guardados
              </button>
            </div>
          </div>

          <div className="mt-4">
            {activeTab === 'posts' ? (
              <PerfilPublicacion userId={user?.id} /> // Mostrar las publicaciones aquí
            ) : activeTab === 'reels' ? (
              <div className="bg-gray-800 p-4 rounded-lg">
                <p>Contenido de Reels aquí.</p> {/* Solo texto para Reels */}
              </div>
            ) : (
              <div className="bg-gray-800 p-4 rounded-lg">
                <p>Contenido Guardados aquí.</p> {/* Solo texto para Guardados */}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>

      {isEditModalOpen && editedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Editar Perfil</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmitProfile}>
              <div className="mb-4">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-400">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={editedUser.nombre || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-400">Apellido</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={editedUser.apellido || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="usuario" className="block text-sm font-medium text-gray-400">Usuario</label>
                <input
                  type="text"
                  id="usuario"
                  name="usuario"
                  value={editedUser.usuario || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="texto" className="block text-sm font-medium text-gray-400">Descripción</label>
                <textarea
                  id="texto"
                  name="texto"
                  value={editedUser.texto || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  rows={3}
                />
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Subir Publicación</h2>
              <button onClick={handleUploadModalToggle} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmitPublication}>
              <div className="mb-4">
                <label htmlFor="publicationMessage" className="block text-sm font-medium text-gray-400">Mensaje de Publicación</label>
                <textarea
                  id="publicationMessage"
                  value={publicationMessage}
                  onChange={(e) => setPublicationMessage(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  rows={3}
                />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="publicationImage" className="block text-sm font-medium text-gray-400 mr-2">Imagen de Publicación</label>
                <label htmlFor="publicationImage" className="cursor-pointer">
                  <Upload size={20} className="text-gray-400 hover:text-white" />
                </label>
                <input
                  type="file"
                  id="publicationImage"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setPublicationImage(file);
                  }}
                  className="hidden"
                />
              </div>
              {publicationImage && (
                <p className="text-gray-400 text-sm mt-1">{publicationImage.name}</p>
              )}
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
                >
                  Subir Publicación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
}