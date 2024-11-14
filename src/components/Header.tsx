import React, { useState, useEffect } from 'react';
import { Menu, Search, Home, Info, Contact, LogIn, LogOut, PenTool, UserRound, UserPen, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [openOptionsIndex, setOpenOptionsIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('id_rol');
    navigate('/login');
  };

  const isLoggedIn = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('id_rol');

  const menuItems = [
    { name: 'Inicio', icon: <Home className="w-4 h-4 mr-2" />, path: '/' },
    { 
      name: 'Opciones', 
      icon: <Menu className="w-4 h-4 mr-2" />, 
      path: '#', 
      options: [
        { name: 'Artistas', path: '/artists', icon: <Info className="w-4 h-4 mr-2" /> },
        { name: 'Galería', path: '/gallery', icon: <Contact className="w-4 h-4 mr-2" /> },
        { name: 'Sobre Nosotros', path: '/', icon: <Info className="w-4 h-4 mr-2" /> },
        ...(userRole === '1' ? [{ name: 'Administrador', path: '/admin', icon: <UserCog className="w-4 h-4 mr-2 text-blue-600" /> }] : []),
        ...(userRole === '2' ? [{ name: 'Tatuador', path: '/perfiltatuador', icon: <UserPen className="w-4 h-4 mr-2 text-blue-600" /> }] : []),
        ...(userRole === '3' ? [{ name: 'Usuario', path: '/perfil', icon: <UserRound className="w-4 h-4 mr-2 text-blue-600" /> }] : []),
      ]
    },
  ];

  return (
    <nav className={`sticky top-0 transition-colors duration-300 shadow-md ${isScrolled ? 'bg-gray-800 bg-opacity-90 text-white' : 'bg-white bg-opacity-90 text-gray-800'} z-50`}>
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center">
          <PenTool className="w-6 h-6 mr-2" />
          <span className="text-2xl font-bold">TattooBook</span>
          <button onClick={toggleMenu} className={`md:hidden text-gray-800`}>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-8 pr-2 py-2 border rounded-none ${isScrolled ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-200 text-gray-800 placeholder-gray-500'} transition duration-300`}
          />
          <Search className={`w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 ${isScrolled ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {menuItems.map((item, index) => (
            <div key={index} className="relative">
              {/* Cambiado aquí para que solo 'Inicio' use navigate */}
              <span
                className={`flex items-center cursor-pointer px-2 py-1 rounded-md ${isScrolled ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-200 text-gray-800'}`}
                onClick={() => {
                  if (item.name === 'Inicio') {
                    navigate(item.path);
                  } else {
                    setOpenOptionsIndex(openOptionsIndex === index ? null : index);
                  }
                }}
              >
                {item.icon}
                {item.name}
              </span>
              {item.options && openOptionsIndex === index && (
                <div className={`absolute left-0 mt-1 ${isScrolled ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-md z-30 flex flex-col min-w-[200px]`}>
                  {item.options.map((option, optionIndex) => (
                    <span
                      key={optionIndex}
                      className={`flex items-center ${isScrolled ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-200 text-gray-800'} px-4 py-2 whitespace-nowrap cursor-pointer`}
                      onClick={() => {
                        setOpenOptionsIndex(null);
                        navigate(option.path);
                      }}
                    >
                      {option.icon}
                      {option.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {!isLoggedIn ? (
            <button onClick={() => navigate('/login')} className="bg-red-600 text-white px-4 py-2 rounded-none hover:bg-red-700 flex items-center">
              <LogIn className="w-4 h-4 mr-2" /> Iniciar Sesión
            </button>
          ) : (
            <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-none hover:bg-red-700 flex items-center">
              <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
            </button>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="mt-4 md:hidden">
          <div className="flex flex-col space-y-2 items-center">
            {menuItems.map((item, index) => (
              <div key={index} className="relative">
                <span
                  className={`flex items-center ${isScrolled ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} hover:text-gray-800 px-2 py-1 rounded-md transition-colors duration-200`}
                  onClick={() => {
                    if (item.name === 'Inicio') {
                      navigate(item.path);
                    } else {
                      setOpenOptionsIndex(openOptionsIndex === index ? null : index);
                    }
                  }}
                >
                  {item.icon}
                  {item.name}
                </span>
                {item.options && openOptionsIndex === index && (
                  <div className={`absolute left-0 mt-1 ${isScrolled ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-md z-30 flex flex-col min-w-[200px]`}>
                    {item.options.map((option, optionIndex) => (
                      <span
                        key={optionIndex}
                        className={`flex items-center ${isScrolled ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-200 text-gray-800'} px-4 py-2 whitespace-nowrap cursor-pointer`}
                        onClick={() => {
                          setOpenOptionsIndex(null);
                          navigate(option.path);
                        }}
                      >
                        {option.icon}
                        {option.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {!isLoggedIn ? (
              <button onClick={() => navigate('/login')} className="bg-red-600 text-white px-4 py-2 rounded-none hover:bg-red-700 flex items-center">
                <LogIn className="w-4 h-4 mr-2" /> Iniciar Sesión
              </button>
            ) : (
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-none hover:bg-red-700 flex items-center">
                <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;