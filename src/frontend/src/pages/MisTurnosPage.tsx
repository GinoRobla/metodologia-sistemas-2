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
    const { user, logout } = useAuth();

    const [turnos, setTurnos] = useState<Turno[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const handleLogout = () => {
        logout();
    };

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        const cargarMisTurnos = async () => {
            setIsLoading(true);
            try {
                // Enviar el nombre del cliente en el body con POST
                const response = await api.post('/turnos/mis-turnos', {
                    cliente: user?.nombre
                });
                setTurnos(response.data);
                setError('');
            } catch (err: any) {
                console.error('Error al cargar turnos:', err);

                if (err.response?.status !== 401) {
                    setError('No se pudieron cargar tus turnos. Por favor intenta más tarde.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        cargarMisTurnos();
    }, [user]);


    const handleCancelar = async (id: string) => {
        if (!window.confirm('¿Estás seguro de que quieres cancelar?')) {
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
                    <h2>
                        <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        Sistema de Turnos - Barbería
                    </h2>

                    <div className="navbar-right">
                        <Link to="/" className="btn-back">
                            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Volver al Inicio
                        </Link>
                        <button onClick={handleLogout} className="btn-logout">
                            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </nav>

            {/*CONTENIDO PRINCIPAL*/}
            <div className="page-content">

                <div className="page-header">
                    <h1>
                        <svg className="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Mis Turnos
                    </h1>
                    {/* Boton flotante */}
                    {turnos.length > 0 && (
                        <Link to="/reservar-turno" className="btn-primary-link">
                            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nuevo Turno
                        </Link>
                    )}
                </div>

                {error && <div className="error-message" style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

                {turnos.length === 0 && !error ? (
                    // Estado Vacio
                    <div className="empty-state">
                        <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3>No tienes turnos programados</h3>
                        <p>Parece que aún no has realizado ninguna reserva.</p>
                        <Link to="/reservar-turno" className="btn-primary-link">
                            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Reservar mi primer turno
                        </Link>
                    </div>
                ) : (
                    // Lista de Turnos
                    <div className="turnos-grid">
                        {turnos.map((turno) => (
                            <div key={turno._id} className="turno-card">
                                <div>
                                    <div className="turno-header">
                                        <svg className="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="fecha-badge">
                                            {formatearFecha(turno.fecha)}
                                        </span>
                                    </div>

                                    <div className="turno-details">
                                        <div className="hora-section">
                                            <svg className="clock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="hora-badge">{formatearHora(turno.fecha)} hs</span>
                                            <span className="duracion-text">({turno.duracion} min)</span>
                                        </div>
                                        <hr className="divider" />

                                        <div className="detail-row">
                                            <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <p><strong>Barbero:</strong> {turno.barbero}</p>
                                        </div>
                                        <div className="detail-row">
                                            <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            <p><strong>Tipo:</strong> {turno.tipo}</p>
                                        </div>

                                        {turno.servicios && (
                                            <div className="detail-row">
                                                <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                                </svg>
                                                <p><strong>Servicios:</strong> {turno.servicios}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="turno-footer">
                                    <div className="turno-price">
                                        ${turno.precio}
                                    </div>
                                    <button
                                        className="btn-cancelar"
                                        onClick={() => handleCancelar(turno._id)}
                                    >
                                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
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