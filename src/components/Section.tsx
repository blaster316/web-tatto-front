import React, { useState, useEffect, useRef } from 'react';
import { PenTool } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TattooArtist {
  id: number;
  nombre: string;
  apellido: string;
  foto_tatuador: string;
}

export default function Section() {
  const [tattooArtists, setTattooArtists] = useState<TattooArtist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<TattooArtist | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', date: '', message: '' });
  const formRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // Función para obtener tatuadores
  const fetchTattooArtists = async () => {
    try {
      const response = await fetch('http://localhost:3000/tatuadores');
      const data = await response.json();
      setTattooArtists(data);
    } catch (error) {
      console.error('Error al obtener tatuadores:', error);
    }
  };

  useEffect(() => {
    fetchTattooArtists(); // Llama a la función al cargar el componente
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Cita solicitada:', formData);
  };

  const handleArtistClick = (artist: TattooArtist) => {
    const userId = localStorage.getItem('userId'); // Obtener el userId del localStorage
    if (userId && userId === artist.id.toString()) {
      // Si el userId coincide con el id del artista, redirige a /perfiltatuador
      navigate('/perfiltatuador');
    } else {
      // De lo contrario, redirige al perfil del tatuador
      navigate(`/perfiltatuadores/${artist.id}`);
    }
  };

  const handleShowForm = (artist: TattooArtist) => {
    if (selectedArtist?.id === artist.id) {
      setSelectedArtist(null); // Ocultar formulario si el artista ya está seleccionado
    } else {
      setSelectedArtist(artist); // Mostrar formulario para el artista seleccionado
      formRef.current?.scrollIntoView({ behavior: 'smooth' }); // Desplazar a la sección del formulario
    }
  };

  // Función para estilizar el nombre y apellido del tatuador
  const capitalizeWords = (str: string | null): string => {
    if (!str) return '';
    return str.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  return (
    <section className="bg-gray-900 text-white py-8 mt-0">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-right animate-fade-in">Agenda tu Sesión de Tatuaje</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tattooArtists.map((artist) => (
            <div
              key={artist.id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 cursor-pointer relative"
              onClick={() => handleArtistClick(artist)} // Redirige al perfil al hacer clic en la imagen
            >
              <img
                src={artist.foto_tatuador ? `http://localhost:3000/${artist.foto_tatuador}` : 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg'}
                alt={artist.nombre}
                className="w-full h-48 object-cover mb-4 rounded animate-fade-in"
              />
              <h3 className="text-xl font-semibold mb-2">
                {capitalizeWords(artist.nombre)} {capitalizeWords(artist.apellido)}
              </h3>
              Tatuador
              {/* Botón "Ver más" que muestra el formulario */}
              <button
                className="absolute bottom-4 right-4 border-2 border-white text-white px-3 py-1 text-sm transition duration-300 hover:bg-red-600 hover:border-red-600"
                style={{ borderRadius: '0' }} // Sin bordes redondeados
                onClick={(e) => {
                  e.stopPropagation(); // Evita que el clic en el botón redirija al perfil
                  handleShowForm(artist); // Muestra el formulario
                }}
              >
                Ver más
              </button>
            </div>
          ))}
        </div>

        {/* Contenedor para la línea y el botón a la derecha */}
        <div className="flex items-center mt-8 justify-end">
          <div className="flex-1 border-t border-white"></div>
          <PenTool className="text-white mx-2" />
          <button
            className="border-2 border-white text-white py-3 px-6 ml-4 transition duration-300 hover:bg-red-600 hover:border-red-600"
            style={{ borderRadius: '0' }} // Sin bordes redondeados
            onClick={() => console.log("Explorando tatuadores...")}
          >
            Explorar Tatuadores
          </button>
        </div>

        {/* Sección del formulario, ahora referenciada */}
        {selectedArtist && (
          <div ref={formRef} className="mt-12 bg-gray-800 p-8 rounded-lg shadow-xl animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-4">Agendar con {selectedArtist.nombre} {selectedArtist.apellido}</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block mb-1">Nombre completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="date" className="block mb-1">Fecha preferida</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-1">Mensaje (describe tu idea de tatuaje)</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-700 rounded"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 transition duration-300 animate-pulse"
              >
                Solicitar Cita
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}