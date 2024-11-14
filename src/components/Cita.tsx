import React from 'react';
import { Clock, Calendar, Palette, Shield } from 'lucide-react';

const benefits = [
  {
    icon: <Clock className="w-12 h-12 text-red-500" />,
    title: "Tiempo de Preparación",
    description: "Permite a los artistas preparar diseños personalizados y únicos para tu sesión."
  },
  {
    icon: <Calendar className="w-12 h-12 text-red-500" />,
    title: "Flexibilidad de Horarios",
    description: "Asegura la disponibilidad de tu artista preferido en la fecha que más te convenga."
  },
  {
    icon: <Palette className="w-12 h-12 text-red-500" />,
    title: "Personalización",
    description: "Da tiempo para refinar y ajustar el diseño según tus preferencias específicas."
  },
  {
    icon: <Shield className="w-12 h-12 text-red-500" />,
    title: "Preparación Mental",
    description: "Te da tiempo para prepararte mental y físicamente para tu sesión de tatuaje."
  }
];

export default function BenefitsSection() {
  return (
    <section className="bg-gray-800 text-white py-8 mt-0">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center animate-fade-in">
          Beneficios de Agendar con Anticipación
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-gray-700 p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">{benefit.title}</h3>
              <p className="text-gray-300 text-center">{benefit.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <p className="text-xl mb-6 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            No esperes más para hacer realidad tu idea de tatuaje. ¡Agenda tu cita ahora y asegura una experiencia increíble!
          </p>
        </div>
      </div>
    </section>
  );
}