import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, X } from "lucide-react";

interface Publicacion {
  id: number;
  usuario_id: number;
  mensaje: string | null;
  foto: string | null;
  valoracion: number | null;
  comentarios: number | null;
  fecha_creacion: string;
}

const PerfilPublicacion = ({ userId }: { userId: number }) => {
  const [posts, setPosts] = useState<Publicacion[]>([]);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/perfilpublicacion/${userId}`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error al obtener publicaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  const openModal = (postId: number) => {
    setSelectedPost(postId);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  if (loading) {
    return <div>Cargando publicaciones...</div>;
  }

  return (
    <div className="bg-gray-900 text-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer"
                onClick={() => openModal(post.id)}
              >
                <div className="relative w-full pb-[100%]">
                  <img
                    src={post.foto ? `http://localhost:3000/${post.foto}` : ''}
                    alt={`Publicación ${post.id}`}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-gray-300 text-sm mb-2">{post.mensaje || 'Sin descripción'}</p>
                  <div className="flex items-center justify-between">
                    <button className="flex items-center text-red-400 hover:text-red-300 bg-transparent border-none cursor-pointer">
                      <Heart className="w-5 h-5 mr-1" />
                      {post.valoracion || 0}
                    </button>
                    <button className="flex items-center text-blue-400 hover:text-blue-300 bg-transparent border-none cursor-pointer">
                      <MessageCircle className="w-5 h-5 mr-1" />
                      {post.comentarios || 0}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center mt-4">No tienes publicaciones aún.</div>
        )}
      </div>

      {selectedPost !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto scrollbar-hide mt-14"> {/* Agregamos mt-4 aquí */}
            <div className="p-6 relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-400 hover:text-white bg-gray-700 rounded-full p-1"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={posts.find(post => post.id === selectedPost)?.foto ? `http://localhost:3000/${posts.find(post => post.id === selectedPost)?.foto}` : ''}
                alt={`Publicación ${selectedPost}`}
                className="w-full h-auto rounded-lg mb-4"
              />
              <p className="text-gray-300 text-sm mb-4">{posts.find(post => post.id === selectedPost)?.mensaje || 'Sin descripción'}</p>
              <div className="flex items-center justify-between mb-4">
                <button className="flex items-center text-red-400 hover:text-red-300 bg-transparent border-none cursor-pointer">
                  <Heart className="w-5 h-5 mr-1" />
                  {posts.find(post => post.id === selectedPost)?.valoracion || 0}
                </button>
                <button className="flex items-center text-blue-400 hover:text-blue-300 bg-transparent border-none cursor-pointer">
                  <MessageCircle className="w-5 h-5 mr-1" />
                  {posts.find(post => post.id === selectedPost)?.comentarios || 0}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfilPublicacion;