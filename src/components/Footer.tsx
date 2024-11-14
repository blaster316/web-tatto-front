import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">TattooBook</h2>
            <p className="mb-4">Descubre el arte del tatuaje con los mejores artistas.</p>
            <div className="flex space-x-4">
              <button
                aria-label="Facebook"
                className="text-blue-600 hover:text-white hover:bg-blue-600 transition-colors duration-300 p-2 rounded"
              >
                <Facebook className="h-5 w-5" />
              </button>
              <button
                aria-label="Instagram"
                className="text-pink-600 hover:text-white hover:bg-gradient-to-br from-pink-600 to-orange-600 transition-colors duration-300 p-2 rounded"
              >
                <Instagram className="h-5 w-5" />
              </button>
              <button
                aria-label="Twitter"
                className="text-sky-500 hover:text-white hover:bg-sky-500 transition-colors duration-300 p-2 rounded"
              >
                <Twitter className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              {['Inicio', 'Artistas', 'Galería', 'Sobre nosotros'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2">
              {['Diseño personalizado', 'Consultas', 'Aftercare', 'Gift cards'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span>info@tattoobook.com</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>+34 123 456 789</span>
              </li>
              <li className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Calle Principal, 123, Ciudad</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {currentYear} TattooBook. Todos los derechos reservados.</p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="text-sm hover:text-white mr-4">Política de privacidad</a>
            <a href="#" className="text-sm hover:text-white">Términos de servicio</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;