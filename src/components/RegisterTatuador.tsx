import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeOffIcon, PenTool } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

// Definir el tipo de Comuna
interface Comuna {
    id: string; // o number, dependiendo de tu implementación
    nombre: string;
}

export default function RegisterTatuadorPage() {
    const navigate = useNavigate();
    const [rut, setRut] = useState('');
    const [dv, setDv] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [usuario, setUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [comunaId, setComunaId] = useState<string | null>(null);
    const [direccionUrl, setDireccionUrl] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [comunas, setComunas] = useState<Comuna[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/'); // Redirige a la página principal si ya está autenticado
        }
    }, [navigate]);

    useEffect(() => {
        const fetchComunas = async () => {
            try {
                const response = await fetch('http://localhost:3000/comunas');
                const data = await response.json();
                setComunas(data);
            } catch (error) {
                console.error('Error al obtener comunas:', error);
                toast.error('No se pudieron cargar las comunas.');
            }
        };

        fetchComunas();
    }, []);

    const isEmailValid = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email) && email.length >= 6;
    };

    const isPasswordValid = (password: string): boolean => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(password);
    };

    const isTelefonoValid = (telefono: string): boolean => {
        const regex = /^\d{6,11}$/; // Solo números, mínimo 6 y máximo 11 caracteres
        return regex.test(telefono);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Validaciones
        if (!/^\d{1,10}$/.test(rut)) {
            toast.error('El RUT debe ser solo números y tener hasta 10 dígitos.');
            return;
        }

        if (!/^[0-9K]$/i.test(dv) || (dv.toUpperCase() !== dv && dv.toUpperCase() !== 'K')) {
            toast.error('El DV debe ser un número o la letra K (mayúscula).');
            return;
        }

        if (!usuario || usuario.length < 6 || /\s/.test(usuario)) {
            toast.error('El usuario debe tener al menos 6 caracteres y no contener espacios.');
            return;
        }

        if (!/^\S{3,}$/.test(nombre)) {
            toast.error('El nombre debe tener al menos 3 caracteres y no contener espacios.');
            return;
        }

        if (apellido && !/^\S{3,}$/.test(apellido)) {
            toast.error('El apellido debe tener al menos 3 caracteres si se proporciona.');
            return;
        }

        if (!isEmailValid(email)) {
            toast.error('El correo debe tener al menos 6 caracteres, contener un "@" y no tener espacios.');
            return;
        }

        if (telefono && !isTelefonoValid(telefono)) {
            toast.error('El teléfono debe ser numérico y tener entre 6 y 11 caracteres.');
            return;
        }

        if (!isPasswordValid(password)) {
            toast.error('La contraseña debe tener al menos 8 caracteres, incluyendo letras y números.');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden.');
            return;
        }

        try {
            const registerResponse = await fetch('http://localhost:3000/registertatuador', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rut,
                    dv: dv.toUpperCase(),
                    nombre: nombre.toUpperCase(),
                    apellido: apellido ? apellido.toUpperCase() : null,
                    usuario,
                    email,
                    password,
                    telefono: telefono || null,
                    direccion: direccion ? direccion.toUpperCase() : null,
                    comuna_id: comunaId, // Enviando el comunaId aquí
                    direccionUrl: direccionUrl || null,
                }),
            });

            if (!registerResponse.ok) {
                throw new Error('Error al registrar el usuario');
            }

            const registerData = await registerResponse.json();

            const loginResponse = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    role: 2,
                }),
            });

            if (!loginResponse.ok) {
                throw new Error('Error al iniciar sesión');
            }

            const loginData = await loginResponse.json();
            localStorage.setItem('token', loginData.token);
            localStorage.setItem('id_rol', loginData.rol_id);

            toast.success('Usuario registrado correctamente.');

            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Ocurrió un error inesperado');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen relative">
            <img
                src="https://media.istockphoto.com/id/1184219605/es/foto/tattoo-artist-haciendo-un-tatuaje-en-un-hombro.jpg?s=612x612&w=0&k=20&c=Cts0guJ8Z-6Hz1KnrfmOM1u4GiohAffkRFT2m56_OM8="
                alt="Fondo"
                className="absolute inset-0 object-cover w-full h-full opacity-80"
                style={{ objectFit: 'cover' }}
            />
            <div className="absolute inset-0 bg-black opacity-40" />
            <ToastContainer />
            <div className="bg-gray-800 text-white shadow-md p-10 w-3/4 md:w-1/3 relative z-10" style={{ fontFamily: 'Inter, sans-serif' }}>
                <h1 className="text-2xl font-bold text-center mb-4 flex items-center justify-center">
                    <PenTool className="mr-2" size={24} />
                    Estudio de Tatuajes
                </h1>
                <p className="text-center mb-4">Regístrate para continuar</p>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* RUT y DV en el mismo contenedor */}
                    <div className="flex items-center">
                        <div className="flex-1">
                            <label htmlFor="rut" className="block mb-1">RUT</label>
                            <input
                                id="rut"
                                type="text"
                                required
                                maxLength={10} // Limitar a 10 caracteres
                                value={rut}
                                onChange={(e) => {
                                    const newValue = e.target.value.replace(/[^0-9]/g, ''); // Solo números
                                    setRut(newValue);
                                }}
                                className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                                placeholder="Introduce tu RUT"
                            />
                        </div>
                        <span className="text-white mx-2 flex items-center" style={{ marginTop: '25px' }}>-</span>
                        <div className="flex-none w-16">
                            <label htmlFor="dv" className="block mb-1">DV</label>
                            <input
                                id="dv"
                                type="text"
                                required
                                maxLength={1} // Limitar a 1 carácter
                                value={dv}
                                onChange={(e) => {
                                    const newValue = e.target.value.toUpperCase().replace(/[^0-9K]/g, ''); // Solo números o 'K'
                                    setDv(newValue);
                                }}
                                className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                                placeholder="DV"
                            />
                        </div>
                    </div>

                    {/* Nombre */}
                    <div>
                        <label htmlFor="nombre" className="block mb-1">Nombre</label>
                        <input
                            id="nombre"
                            type="text"
                            required
                            value={nombre}
                            onChange={(e) => {
                                const newValue = e.target.value.toUpperCase().replace(/\s/g, ''); // Asegura mayúsculas y quita espacios
                                setNombre(newValue);
                            }}
                            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                            placeholder="Introduce tu nombre"
                        />
                    </div>

                    {/* Apellido */}
                    <div>
                        <label htmlFor="apellido" className="block mb-1">Apellido (opcional)</label>
                        <input
                            id="apellido"
                            type="text"
                            value={apellido}
                            onChange={(e) => {
                                const newValue = e.target.value ? e.target.value.toUpperCase().replace(/\s/g, '') : '';
                                setApellido(newValue);
                            }}
                            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                            placeholder="Introduce tu apellido"
                        />
                    </div>

                    {/* Usuario */}
                    <div>
                        <label htmlFor="usuario" className="block mb-1">Usuario</label>
                        <input
                            id="usuario"
                            type="text"
                            required
                            maxLength={20} // Limitar a 20 caracteres
                            value={usuario}
                            onChange={(e) => {
                                const newValue = e.target.value.replace(/\s/g, ''); // No permitir espacios
                                setUsuario(newValue);
                            }}
                            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                            placeholder="Introduce tu usuario"
                        />
                    </div>

                    {/* Correo */}
                    <div className="col-span-2">
                        <label htmlFor="email" className="block mb-1">Correo electrónico</label>
                        <input
                            id="email"
                            type="email"
                            required
                            maxLength={50} // Limitar a 50 caracteres
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                            placeholder="Introduce tu correo"
                        />
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label htmlFor="telefono" className="block mb-1">Teléfono (opcional)</label>
                        <input
                            id="telefono"
                            type="text"
                            maxLength={11} // Limitar a 11 caracteres
                            value={telefono}
                            onChange={(e) => {
                                const newValue = e.target.value.replace(/[^0-9]/g, ''); // Solo números
                                setTelefono(newValue);
                            }}
                            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                            placeholder="Introduce tu teléfono"
                        />
                    </div>

                    {/* Dirección */}
                    <div>
                        <label htmlFor="direccion" className="block mb-1">Dirección (opcional)</label>
                        <input
                            id="direccion"
                            type="text"
                            value={direccion}
                            onChange={(e) => {
                                const newValue = e.target.value.toUpperCase(); // Convertir a mayúsculas
                                setDireccion(newValue); // Permitir espacios
                            }}
                            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                            placeholder="Introduce tu dirección"
                        />
                    </div>

                    {/* Comuna */}
                    <div>
                        <label htmlFor="comuna" className="block mb-1">Comuna (opcional)</label>
                        <select
                            id="comuna"
                            value={comunaId || ''} // Usa '' para manejar el estado nulo
                            onChange={(e) => setComunaId(e.target.value || null)} // Guarda el ID o null
                            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                        >
                            <option value="">Selecciona una comuna</option>
                            {comunas.map((comuna) => (
                                <option key={comuna.id} value={comuna.id}>
                                    {comuna.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dirección URL */}
                    <div>
                        <label htmlFor="direccionUrl" className="block mb-1">URL de Google Maps (opcional)</label>
                        <input
                            id="direccionUrl"
                            type="url"
                            value={direccionUrl || ''}
                            onChange={(e) => setDireccionUrl(e.target.value || null)} // Puede ser null
                            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                            placeholder="Introduce la URL de Google Maps"
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="col-span-2">
                        <label htmlFor="password" className="block mb-1">Contraseña</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                                placeholder="Introduce tu contraseña"
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOffIcon size={20} color="#fff" /> : <EyeIcon size={20} color="#fff" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirmar Contraseña */}
                    <div className="col-span-2">
                        <label htmlFor="confirmPassword" className="block mb-1">Confirmar Contraseña</label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                                placeholder="Confirma tu contraseña"
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOffIcon size={20} color="#fff" /> : <EyeIcon size={20} color="#fff" />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-gray-700 text-white py-2 border border-white hover:bg-gray-600 hover:border-transparent transition duration-200 col-span-2">Registrarse</button>
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="w-full bg-gray-700 text-white py-2 border border-white hover:bg-gray-600 hover:border-transparent transition duration-200 mt-2 col-span-2"
                    >
                        Volver a Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
}
