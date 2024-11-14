import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CalendarioCitaProps {
  ocupadas: { fecha: string; hora: string }[];
  tatuadorId: string; // Asegúrate de que este prop esté presente
}

interface DaySelectorProps {
  currentDate: Date;
  selectDay: (day: number) => void;
  selectedDay: number | null;
  ocupadas: { fecha: string; hora: string }[];
}

const DaySelector: React.FC<DaySelectorProps> = ({ currentDate, selectDay, selectedDay, ocupadas }) => {
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const adjustedFirstDay = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);
  const today = new Date();

  const occupiedDates = new Set(ocupadas.map(c => {
    const date = new Date(c.fecha);
    date.setDate(date.getDate() + 1);
    return date.toDateString();
  }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
      {dayNames.map(day => (
        <div key={day} style={{ textAlign: 'center', fontWeight: 'bold', color: '#888' }}>
          {day}
        </div>
      ))}
      {Array.from({ length: adjustedFirstDay }).map((_, index) => (
        <div key={`empty-${index}`} />
      ))}
      {Array.from({ length: daysInMonth }).map((_, index) => {
        const day = index + 1;
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

        const isOccupied = occupiedDates.has(date.toDateString());
        const isPastOrToday = date <= today;

        return (
          <button
            key={day}
            style={{
              backgroundColor: isPastOrToday ? '#3a3a3a' : (selectedDay === day || isOccupied ? '#1E40AF' : '#3a3a3a'),
              color: isPastOrToday ? '#888' : '#ffffff',
              width: '100%',
              height: '40px',
              padding: '0',
              cursor: isPastOrToday ? 'not-allowed' : 'pointer',
            }}
            onClick={() => !isPastOrToday && selectDay(day)}
            disabled={isPastOrToday}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
};

interface HourSelectorProps {
  selectHour: (hour: string) => void;
  selectedHour: string | null;
  currentDate: Date;
  selectedDay: number;
  ocupadas: { fecha: string; hora: string }[];
}

const HourSelector: React.FC<HourSelectorProps> = ({ selectHour, selectedHour, currentDate, selectedDay, ocupadas }) => {
  const occupiedHours = ocupadas
    .filter(c => {
      const citaDate = new Date(c.fecha);
      citaDate.setDate(citaDate.getDate() + 1);
      return (
        citaDate.getDate() === selectedDay &&
        citaDate.getMonth() === currentDate.getMonth() &&
        citaDate.getFullYear() === currentDate.getFullYear()
      );
    })
    .map(c => c.hora.slice(0, 5));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
      {Array.from({ length: 14 }, (_, i) => i + 8).map(hour => {
        const hourString = `${hour.toString().padStart(2, '0')}:00`;
        const isOccupied = occupiedHours.includes(hourString);

        return (
          <button
            key={hour}
            style={{
              backgroundColor: selectedHour === hourString ? '#4a4a4a' : (isOccupied ? '#1E40AF' : '#3a3a3a'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '10px',
              cursor: isOccupied ? 'not-allowed' : 'pointer',
            }}
            onClick={() => !isOccupied && selectHour(hourString)}
            disabled={isOccupied}
          >
            <Clock style={{ marginRight: '10px' }} />
            {hourString}
          </button>
        );
      })}
    </div>
  );
};

interface FormProps {
  formData: { mensaje: string; image: File | null };
  setFormData: React.Dispatch<React.SetStateAction<{ mensaje: string; image: File | null }>>;
  selectedDay: number | null;
  selectedHour: string | null;
  currentDate: Date;
  tatuadorId: string; // Asegúrate de incluir tatuadorId
}

const Form: React.FC<FormProps> = ({ formData, setFormData, selectedDay, selectedHour, currentDate, tatuadorId }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No se encontró el ID del usuario en localStorage');
      return;
    }

    const citaData = new FormData();
    citaData.append('mensaje', formData.mensaje);
    citaData.append('fecha', `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDay?.toString().padStart(2, '0')}`);
    citaData.append('hora', selectedHour || '');
    citaData.append('tatuadorId', tatuadorId);

    // Si hay una imagen, agregarla al FormData
    if (formData.image) {
      citaData.append('foto', formData.image);
    }

    try {
      const response = await fetch(`http://localhost:3000/user/${userId}/cita`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: citaData,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Error al agendar la cita');
      }

      const result = await response.json();
      console.log('Cita agendada con éxito:', result);
      
      // Mostrar mensaje de éxito
      toast.success('Cita agendada con éxito');

      // Redirigir después de un breve retraso o actualizar la página
      setTimeout(() => {
        window.location.reload(); // Actualiza la página para ver la cita agendada
      }, 2000); // 2000 milisegundos = 2 segundos

    } catch (error) {
      console.error('Error al agendar la cita:', error);
      toast.error('Error al agendar la cita');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Detalles de la Cita</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="date" style={{ display: 'block', marginBottom: '5px' }}>Fecha</label>
            <input
              type="text"
              id="date"
              name="date"
              value={selectedDay ? `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}` : ''}
              readOnly
              style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#3a3a3a', color: '#ffffff', border: '1px solid #4a4a4a', borderRadius: '4px' }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label htmlFor="hour" style={{ display: 'block', marginBottom: '5px' }}>Hora</label>
            <input
              type="text"
              id="hour"
              name="hour"
              value={selectedHour || ''}
              readOnly
              style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#3a3a3a', color: '#ffffff', border: '1px solid #4a4a4a', borderRadius: '4px' }}
            />
          </div>
        </div>

        <label htmlFor="mensaje" style={{ display: 'block', marginBottom: '5px' }}>Mensaje</label>
        <textarea
          id="mensaje"
          name="mensaje"
          value={formData.mensaje}
          onChange={handleInputChange}
          placeholder="Ingrese un mensaje o nota adicional"
          style={{ width: '100%', padding: '10px', height: '100px', marginBottom: '10px', backgroundColor: '#3a3a3a', color: '#ffffff', border: '1px solid #4a4a4a', borderRadius: '4px', resize: 'vertical' }}
        />

        <label htmlFor="image" style={{ display: 'block', marginBottom: '5px' }}>Imagen</label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById('image-input') as HTMLInputElement | null;
              input?.click();
            }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', padding: '0', backgroundColor: '#3a3a3a', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>
          <span style={{ marginLeft: '10px' }}>
            {formData.image ? 'Imagen seleccionada' : 'Ninguna imagen seleccionada'}
          </span>
        </div>
        <input
          type="file"
          id="image-input"
          name="image"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFormData(prev => ({ ...prev, image: file }));
            }
          }}
          accept="image/*"
          style={{ display: 'none' }}
        />

        {formData.image && (
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <img 
              src={URL.createObjectURL(formData.image)} 
              alt="Imagen de la cita" 
              style={{ maxWidth: '260px', maxHeight: '365px', borderRadius: '4px' }} 
            />
          </div>
        )}

        <button type="submit" style={{ width: '100%', marginTop: '20px', padding: '10px', backgroundColor: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Agendar Cita</button>
      </form>
    </div>
  );
};

export default function CalendarioCita({ ocupadas, tatuadorId }: CalendarioCitaProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [formData, setFormData] = useState({ mensaje: '', image: null as File | null });

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDay(null);
    setSelectedHour(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(null);
    setSelectedHour(null);
  };

  const selectDay = (day: number) => {
    setSelectedDay(day);
    setSelectedHour(null);
  };

  const selectHour = (hour: string) => {
    setSelectedHour(hour);
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    backgroundColor: '#111827',
    color: '#ffffff',
  };

  return (
    <div style={containerStyle}>
      <div style={{ backgroundColor: '#2a2a2a', borderRadius: '8px', padding: '20px' }}>
        <h2 style={{ textAlign: 'center' }}>Calendario</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={prevMonth}><ChevronLeft /></button>
          <h3>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
          <button onClick={nextMonth}><ChevronRight /></button>
        </div>
        <DaySelector currentDate={currentDate} selectDay={selectDay} selectedDay={selectedDay} ocupadas={ocupadas} />
      </div>

      <div style={{ backgroundColor: '#2a2a2a', borderRadius: '8px', padding: '20px' }}>
        <h2 style={{ textAlign: 'center' }}>Seleccionar Hora</h2>
        {selectedDay && (
          <HourSelector selectHour={selectHour} selectedHour={selectedHour} currentDate={currentDate} selectedDay={selectedDay} ocupadas={ocupadas} />
        )}
      </div>

      <div style={{ backgroundColor: '#2a2a2a', borderRadius: '8px', padding: '20px', gridColumn: 'span 2' }}>
        <Form
          formData={formData}
          setFormData={setFormData}
          selectedDay={selectedDay}
          selectedHour={selectedHour}
          currentDate={currentDate}
          tatuadorId={tatuadorId}
        />
      </div>

      <ToastContainer />
    </div>
  );
}