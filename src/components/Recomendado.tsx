import React from 'react';

interface RecommendedUser {
  id: string;
  username: string;
  avatarUrl: string;
}

const recommendedUsers: RecommendedUser[] = [
  { id: "1", username: "usuario1", avatarUrl: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg" },
  { id: "2", username: "usuario2", avatarUrl: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg" },
  { id: "3", username: "usuario3", avatarUrl: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg" },
  { id: "4", username: "usuario4", avatarUrl: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg" },
  { id: "5", username: "usuario5", avatarUrl: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg" },
  { id: "6", username: "usuario6", avatarUrl: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg" },
];

export default function Recomendados() {
  return (
    <section className="bg-gray-900 text-white py-8 mt-0">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-center animate-fade-in">Usuarios recomendados para ti</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {recommendedUsers.map((user) => (
            <div key={user.id} className="flex flex-col items-center space-y-2 cursor-pointer">
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-gray-600 transition-transform duration-300 hover:scale-105">
                <img 
                  src={user.avatarUrl} 
                  alt={user.username} 
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                  <span className="text-white text-lg font-semibold">Ver Perfil</span>
                </div>
              </div>
              <span className="text-xl font-semibold text-center">{user.username}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}