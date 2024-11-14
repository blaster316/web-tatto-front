import React, { useState, useEffect } from 'react';
import './Banner.css';

const images = [
  "https://tint.creativemarket.com/uoG3WqACzZECxerzstDDWM1U3eDiSbQoWAS9GenusNE/width:1160/height:772/gravity:nowe/rt:fill-down/el:1/preset:cm_watermark_retina/czM6Ly9maWxlcy5jcmVhdGl2ZW1hcmtldC5jb20vaW1hZ2VzL3NjcmVlbnNob3RzL3Byb2R1Y3RzLzQwNS80MDUzLzQwNTMyMjUvMS1vLmpwZw?1714138220",
  "https://wallpapers.com/images/hd/colorful-hd-tattoo-combination-7gt6xvme03r17pud.jpg"
];

export default function Banner() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Cambia la imagen cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {images.map((image, index) => (
        <img 
          key={index}
          src={image} 
          alt={`Banner imagen ${index + 1}`} 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative z-10 h-full flex flex-col justify-center items-start p-8 md:p-16 max-w-3xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-in-up delay-300">
          Descubre el Arte del Tatuaje
        </h1>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-300 mb-6 animate-fade-in-up delay-600">
          Expresa tu Individualidad
        </h2>
        <p className="text-base md:text-lg lg:text-xl text-gray-400 mb-8 animate-fade-in-up delay-900">
          En TattooBook, conectamos a artistas talentosos con clientes que buscan expresar su personalidad a través del arte corporal. Descubre estilos únicos, reserva sesiones y haz realidad tu visión.
        </p>
        <button className="bg-red-600 text-white px-8 py-3 text-lg font-semibold hover:bg-red-700 transition duration-300 ease-in-out animate-fade-in-up delay-1200">
          Explora Artistas
        </button>
      </div>
    </div>
  );
}