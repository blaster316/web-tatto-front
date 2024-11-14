import React, { useState, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical } from "lucide-react";
import Header from './Header';
import Footer from './Footer';

interface Chat {
  id: number;
  nombre: string;
  foto: string | null;
  lastMessage: string;
}

interface Message {
  usuario_origen: number;
  usuario_destino: number;
  texto: string;
  fecha_creacion: string;
}

export default function Mensaje() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]); // Estado para almacenar los mensajes

  // Cargar los chats del usuario
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('No se ha encontrado el userId en el localStorage');
        }

        const response = await fetch(`http://localhost:3000/chats/${userId}`);
        if (!response.ok) {
          throw new Error('Error al obtener los chats');
        }

        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error('Error al obtener los chats:', error);
      }
    };

    fetchChats();
  }, []);

  // Obtener los mensajes cuando se selecciona un chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return; // No hacer nada si no hay un chat seleccionado

      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('No se ha encontrado el userId en el localStorage');
        }

        // Hacer la solicitud al nuevo endpoint que hemos creado
        const response = await fetch(`http://localhost:3000/messages/${userId}/${selectedChat}`);
        if (!response.ok) {
          throw new Error('Error al obtener los mensajes');
        }

        const data = await response.json();
        setMessages(data); // Guardar los mensajes en el estado
      } catch (error) {
        console.error('Error al obtener los mensajes:', error);
      }
    };

    fetchMessages();
  }, [selectedChat]); // Se ejecuta cada vez que cambia el chat seleccionado

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId || !selectedChat) return;

        const newMessage = {
          usuario_origen: parseInt(userId),
          usuario_destino: selectedChat,
          texto: message,
          fecha_creacion: new Date().toISOString(),
        };

        // Enviar el mensaje al servidor
        const response = await fetch('http://localhost:3000/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMessage),
        });

        if (!response.ok) {
          throw new Error('Error al enviar el mensaje');
        }

        // Agregar el nuevo mensaje al historial en la UI
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage(''); // Limpiar el campo de mensaje
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
      }
    }
  };

  // Función para obtener la URL de la imagen del chat
  const getChatImageUrl = (foto: string | null) => {
    if (!foto) {
      return 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg';
    }

    foto = foto.replace(/\\/g, '/');
    foto = foto.replace('/uploads/', '/');
    if (foto.startsWith('http://localhost:3000/')) {
      return foto;
    }

    return `http://localhost:3000/${foto}`;
  };

  const currentChat = selectedChat ? chats.find((chat) => chat.id === selectedChat) : null;

  // Función para formatear la hora (solo hora y minutos)
  const formatTime = (date: string) => {
    const msgDate = new Date(date);
    const hours = msgDate.getHours().toString().padStart(2, '0');
    const minutes = msgDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <>
      <Header />
      <div className="flex h-screen bg-gray-900">
        <div className="w-1/3 bg-gray-800 border-r border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Chats</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-64px)]">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 ${selectedChat === chat.id ? 'bg-gray-600' : ''}`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <img src={getChatImageUrl(chat.foto)} alt={chat.nombre} className="w-12 h-12 rounded-full" />
                <div className="ml-4">
                  <h3 className="font-semibold text-white">{chat.nombre}</h3>
                  <p className="text-sm text-gray-400">{chat.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-gray-900">
          {currentChat ? (
            <>
              <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
                <div className="flex items-center">
                  <img src={getChatImageUrl(currentChat.foto)} alt={currentChat.nombre} className="w-10 h-10 rounded-full" />
                  <h2 className="ml-4 text-lg font-semibold text-white">{currentChat.nombre}</h2>
                </div>
                <div>
                  <button className="p-2 rounded-full hover:bg-gray-700 mr-2" aria-label="Llamada">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-700 mr-2" aria-label="Videollamada">
                    <Video className="h-5 w-5 text-gray-400" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-700" aria-label="Más opciones">
                    <MoreVertical className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                {/* Mostrar los mensajes del chat seleccionado */}
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isCurrentUser = msg.usuario_origen === parseInt(localStorage.getItem('userId')!); // Comprobar si es el mensaje del usuario actual

                    return (
                      <div
                        key={msg.fecha_creacion}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`} // Alineación de los mensajes
                      >
                        <div
                          className={`max-w-[80%] py-0.5 px-3 rounded-lg text-white ${
                            isCurrentUser ? 'bg-green-700' : 'bg-gray-600'
                          }`}
                        >
                          {msg.texto}
                          <div className="text-xs text-gray-400 mt-1 text-right">
                            {formatTime(msg.fecha_creacion)} {/* Mostrar solo la hora y minutos */}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="p-4 bg-gray-800 border-t border-gray-700 flex">
                <input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 mr-2 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white rounded-full p-2 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-900">
              <p className="text-xl text-gray-400">Selecciona un chat para comenzar</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}