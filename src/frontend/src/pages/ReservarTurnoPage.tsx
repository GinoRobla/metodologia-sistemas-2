import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './css/ReservarTurnoPage.css';

// Define la estructura de un barbero
interface Barbero {
  _id: number;
  nombre: string;
  email: string;
}

// Define la estructura de un turno
interface TurnoExistente {
  _id: string;
  barbero: string;
  fecha: string;
  duracion: number;
  cliente: string;
  servicios?: string;
}

function ReservarTurnoPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados del formulario
  const [tipoTurno, setTipoTurno] = useState('Simple');
  const [barberoSeleccionado, setBarberoSeleccionado] = useState('');
  const [fecha, setFecha] = useState('');
  const [servicios, setServicios] = useState('');

  // Estados de la UI
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingBarberos, setLoadingBarberos] = useState(true);

  // Cargar lista de barberos al montar el componente
  useEffect(() => {
    const cargarBarberos = async () => {
      try {
        const response = await api.get('/usuarios/list-barberos');
        setBarberos(response.data);
      } catch (err) {
        setError('Error al cargar la lista de barberos');
        console.error(err);
      } finally {
        setLoadingBarberos(false);
      }
    };

    cargarBarberos();
  }, []);

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validaciones básicas
    if (!barberoSeleccionado) {
      setError('Debes seleccionar un barbero');
      setIsLoading(false);
      return;
    }

    if (!fecha) {
      setError('Debes seleccionar una fecha');
      setIsLoading(false);
      return;
    }

    // Validación 1: No permitir fechas en el pasado
    const fechaSeleccionada = new Date(fecha);
    const ahora = new Date();
    if (fechaSeleccionada < ahora) {
      setError('No puedes reservar un turno en el pasado');
      setIsLoading(false);
      return;
    }

    // Validación 2: Horario de atención (Lunes a Sábado, 9:00 - 20:00)
    const diaSemana = fechaSeleccionada.getDay();
    const hora = fechaSeleccionada.getHours();

    if (diaSemana === 0) {
      setError('La peluquería no atiende los domingos');
      setIsLoading(false);
      return;
    }

    if (hora < 9 || hora >= 20) {
      setError('El horario de atención es de 9:00 a 20:00');
      setIsLoading(false);
      return;
    }

    // Validación 3: Verificar disponibilidad del barbero
    try {
      const response = await api.get<TurnoExistente[]>('/turnos');
      const todosTurnos = response.data;

      // Filtrar turnos del barbero seleccionado
      const turnosBarbero = todosTurnos.filter(
        (turno: TurnoExistente) => turno.barbero === barberoSeleccionado
      );

      // Verificar si hay conflicto de horario
      const hayConflicto = turnosBarbero.some((turno: TurnoExistente) => {
        const fechaTurno = new Date(turno.fecha);
        const duracionTurno = turno.duracion || 60; // Duración en minutos
        const finTurno = new Date(fechaTurno.getTime() + duracionTurno * 60000);

        // Calcular duración del turno que estamos reservando
        let duracionNuevo = 60; // Por defecto 60 min
        if (tipoTurno === 'Combo') duracionNuevo = 90;
        if (tipoTurno === 'Express') duracionNuevo = 30;

        const finNuevo = new Date(fechaSeleccionada.getTime() + duracionNuevo * 60000);

        // Verificar si hay solapamiento
        return (
          (fechaSeleccionada >= fechaTurno && fechaSeleccionada < finTurno) ||
          (finNuevo > fechaTurno && finNuevo <= finTurno) ||
          (fechaSeleccionada <= fechaTurno && finNuevo >= finTurno)
        );
      });

      if (hayConflicto) {
        setError(`El barbero ${barberoSeleccionado} ya tiene un turno a esa hora. Por favor elige otro horario.`);
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.error('Error al verificar disponibilidad:', err);
      // Continuar con la reserva aunque falle la verificación
    }

    // Si es Simple o Express, servicios es obligatorio
    if ((tipoTurno === 'Simple' || tipoTurno === 'Express') && !servicios.trim()) {
      setError('Debes especificar los servicios para este tipo de turno');
      setIsLoading(false);
      return;
    }

    try {
      // Preparar los datos segun el tipo de turno
      const turnoData: {
        tipo: string;
        cliente: string | undefined;
        barbero: string;
        fecha: string;
        servicios?: string;
      } = {
        tipo: tipoTurno,
        cliente: user?.nombre,
        barbero: barberoSeleccionado,
        fecha: fecha
      };

      // Solo agregar servicios si NO es Combo (Combo no usa servicios)
      if (tipoTurno !== 'Combo') {
        turnoData.servicios = servicios;
      }

      // Enviar al backend
      await api.post('/turnos', turnoData);

      // Redirigir a "Mis Turnos"
      alert('Turno reservado con exito!');
      navigate('/mis-turnos');
    } catch (err) {
      console.error('Error al reservar turno:', err);
      const errorMessage = err instanceof Error && 'response' in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
        : 'Error al reservar el turno';
      setError(errorMessage || 'Error al reservar el turno');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reservar-turno-container">
      <div className="reservar-turno-card">
        <h1>Reservar Turno</h1>
        <p className="subtitle">Completa el formulario para agendar tu cita</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Tipo de Turno */}
          <div className="form-group">
            <label htmlFor="tipoTurno">Tipo de Turno</label>
            <select
              id="tipoTurno"
              value={tipoTurno}
              onChange={(e) => setTipoTurno(e.target.value)}
              disabled={isLoading}
            >
              <option value="Simple">Simple (corte basico)</option>
              <option value="Combo">Combo (corte + barba + lavado)</option>
              <option value="Express">Express (servicio rapido)</option>
            </select>
          </div>

          {/* Seleccion de Barbero */}
          <div className="form-group">
            <label htmlFor="barbero">Barbero</label>
            {loadingBarberos ? (
              <p className="loading-text">Cargando barberos...</p>
            ) : barberos.length === 0 ? (
              <p className="error-text">No hay barberos disponibles</p>
            ) : (
              <select
                id="barbero"
                value={barberoSeleccionado}
                onChange={(e) => setBarberoSeleccionado(e.target.value)}
                disabled={isLoading}
                required
              >
                <option value="">Selecciona un barbero</option>
                {barberos.map((barbero) => (
                  <option key={barbero._id} value={barbero.nombre}>
                    {barbero.nombre}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Fecha */}
          <div className="form-group">
            <label htmlFor="fecha">Fecha y Hora</label>
            <input
              type="datetime-local"
              id="fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {/* Servicios (solo para Simple y Express) */}
          {(tipoTurno === 'Simple' || tipoTurno === 'Express') && (
            <div className="form-group">
              <label htmlFor="servicios">Servicios</label>
              <input
                type="text"
                id="servicios"
                placeholder="Ej: Corte degradado, afeitado"
                value={servicios}
                onChange={(e) => setServicios(e.target.value)}
                disabled={isLoading}
              />
              <small>Describe los servicios que deseas</small>
            </div>
          )}

          {/* Informacion del Combo */}
          {tipoTurno === 'Combo' && (
            <div className="info-box">
              <strong>Combo incluye:</strong> Corte + Barba + Lavado
            </div>
          )}

          {/* Botones */}
          <div className="button-group">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/')}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading || loadingBarberos}
            >
              {isLoading ? 'Reservando...' : 'Reservar Turno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReservarTurnoPage;