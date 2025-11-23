import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './css/MisTurnosPage.css';

// Estructura de turno
interface Turno {
    _id: string;
    fecha: string;
    hora?: string;
    barbero: string;
    tipo: string;
    servicios?: string;
    duracion: number;
    precio: number;
}

function MisTurnosPage() {
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();

    // Estados
    const [turnos, setTurnos] = useState<Turno[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Manejo del Logout 
    const handleLogout = () => {
        logout();
    };

    // Cargar turnos al montar el componente FALTA EL TOKEN EN EL HEADER
    

    // Estados
    // ...

    // Cargar turnos al montar el componente: IMPLEMENTACIÓN MANUAL DEL TOKEN EN EL HEADER
    useEffect(() => {
        const cargarMisTurnos = async () => {

            // Si no hay token, no hacemos la petición.
            if (!token) {
                setError('Debes iniciar sesión para ver tus turnos.');
                setIsLoading(false);
                return;
            }

            try {
                // 🔑 CAMBIO 2: Añadir el objeto de configuración con el Header
                const response = await api.get('/turnos/mis-turnos', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTurnos(response.data);
                setError(''); // Limpiar errores
                setSuccessMessage(''); // Limpiar mensajes de éxito
            } catch (err: any) {
                // ...
            } finally {
                setIsLoading(false);
            }
        };

        cargarMisTurnos();
        // 🔑 CAMBIO 3: Añadir 'token' a las dependencias
    }, [token]);

    // Función para cancelar turno
    const handleCancelar = async (id: string) => {
        if (!window.confirm('¿Estas seguro de que queres cancelar?')) {
            return;
        }

        try {
            await api.delete(`/turnos/${id}`);

            setTurnos(prevTurnos => prevTurnos.filter(turno => turno._id !== id));
            alert('Turno cancelado exitosamente');
        } catch (err) {
            console.error('Error al cancelar:', err);
            alert('Hubo un error al intentar cancelar el turno');
        }
    };

    // Helpers para formato de fecha y hora (Argentina)
    const formatearFecha = (fechaString: string) => {
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString('es-AR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatearHora = (fechaString: string) => {
        const fecha = new Date(fechaString);
        return fecha.toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Renderizado de Carga
    if (isLoading) {
        return (
            <div className="mis-turnos-container loading-container">
                <p>Cargando tus turnos...</p>
            </div>
        );
    }

    return (
        <div className="mis-turnos-container">
            {/* NAVBAR */}
            <nav className="navbar">
                <div className="navbar-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <h2>💈 Barbería Sistema</h2>
                    </div>

                    <div className="navbar-right">
                        <Link to="/" className="btn-back">
                            ← Volver al Inicio
                        </Link>
                        <span className="user-info">
                            {user?.nombre} ({user?.tipoUsuario})
                        </span>
                        <button onClick={handleLogout} className="btn-logout">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </nav>

            {/*CONTENIDO PRINCIPAL*/}
            <div className="page-content">

                <div className="page-header">
                    <h1>Mis Turnos</h1>
                    {/* Boton flotante */}
                    {turnos.length > 0 && (
                        <Link to="/reservar-turno" className="btn-primary-link" style={{ fontSize: '14px', padding: '8px 16px' }}>
                            + Nuevo Turno
                        </Link>
                    )}
                </div>

                {error && <div className="error-message" style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

                {turnos.length === 0 && !error ? (
                    // Estado Vacio
                    <div className="empty-state">
                        <h3>No tienes turnos programados</h3>
                        <p>Parece que an no has realizado ninguna reserva.</p>
                        <Link to="/reservar-turno" className="btn-primary-link">
                            📅 Reservar mi primer turno
                        </Link>
                    </div>
                ) : (
                    // Lista de Turnos
                    <div className="turnos-grid">
                        {turnos.map((turno) => (
                            <div key={turno._id} className="turno-card">
                                <div>
                                    <div className="turno-header">
                                        <span className="fecha-badge">
                                            {formatearFecha(turno.fecha)}
                                        </span>
                                    </div>

                                    <div className="turno-details">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span className="hora-badge">⏰ {formatearHora(turno.fecha)} hs</span>
                                            <span style={{ fontSize: '0.9rem', color: '#666' }}>({turno.duracion} min)</span>
                                        </div>
                                        <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '10px 0' }} />

                                        <p><strong>Barbero:</strong> {turno.barbero}</p>
                                        <p><strong>Tipo:</strong> {turno.tipo}</p>

                                        {turno.servicios && (
                                            <p><strong>Servicios:</strong> {turno.servicios}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="turno-price">
                                        ${turno.precio}
                                    </div>
                                    <button
                                        className="btn-cancelar"
                                        onClick={() => handleCancelar(turno._id)}
                                    >
                                        Cancelar Turno
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MisTurnosPage;