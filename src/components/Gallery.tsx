import React, { useState } from 'react';
import { X, PenTool } from 'lucide-react';

interface TattooImage {
  id: number;
  src: string;
  alt: string;
}

const tattooImages: TattooImage[] = [
  { id: 1, src: "https://i.pinimg.com/736x/c4/e0/60/c4e0602831e02bbf86ab335d959fbbc4.jpg", alt: "Tatuaje 1" },
  { id: 2, src: "https://onlytattoobcn.com/wp-content/uploads/2024/02/Nahuel-Caviglia1.jpg", alt: "Tatuaje 2" },
  { id: 3, src: "https://cdntattoofilter.com/tattoo/260603/l.jpg", alt: "Tatuaje 3" },
  { id: 4, src: "https://i.pinimg.com/originals/08/0f/80/080f80298fca6816b3f1773f50a003bd.jpg", alt: "Tatuaje 4" },
  { id: 5, src: "https://static.diariofemenino.com/uploads/belleza/216169-rosa.jpg", alt: "Tatuaje 5" },
  { id: 6, src: "https://i.pinimg.com/736x/ee/54/07/ee5407104a90a3d9e13a845f44e129ad.jpg", alt: "Tatuaje 6" },
  { id: 7, src: "https://requiemtattooalicante.com/wp-content/uploads/2022/10/little-goku-staffing-out-mario-photo-u1.jpeg", alt: "Tatuaje 7" },
  { id: 8, src: "https://i.pinimg.com/474x/d3/f7/ac/d3f7ac98709204635e5cafddae757424.jpg", alt: "Tatuaje 8" },
];

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<TattooImage | null>(null);

  return (
    <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-8 mt-0">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-left text-white animate-fade-in">
          Galería de Tatuajes
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tattooImages.map((image) => (
            <div 
              key={image.id} 
              className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition duration-300 hover:scale-105"
              onClick={() => setSelectedImage(image)}
            >
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-lg font-semibold opacity-0 hover:opacity-100 transition-opacity duration-300">
                  Ver Detalle
                </span>
              </div>
            </div>
          ))}
        </div>
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
            <div className="relative max-w-3xl w-full">
              <img 
                src={selectedImage.src} 
                alt={selectedImage.alt} 
                className="w-full max-h-[80vh] object-cover rounded-lg"
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors duration-300 z-10"
                aria-label="Cerrar imagen"
              >
                <X size={24} />
              </button>
              <button
                className="absolute bottom-4 right-4 bg-red-600 text-white py-2 px-4 hover:bg-red-700 transition-colors duration-300 z-10"
                onClick={() => alert("Ver Artista")}
              >
                Ver Artista
              </button>
            </div>
          </div>
        )}

        {/* Línea y botón "Explorar Tatuajes" alineados a la izquierda */}
        <div className="flex items-center mt-8">
          <button 
            className="border-2 border-white text-white py-3 px-6 mr-4 transition duration-300 hover:bg-red-600 hover:border-red-600"
            style={{ borderRadius: '0' }} // Sin bordes redondeados
            onClick={() => alert("Explorando tatuajes...")}
          >
            Explorar Tatuajes
          </button>
          <div className="flex-1 border-t border-white"></div>
          <PenTool className="text-white mx-2" />
        </div>
      </div>
    </section>
  );
}