import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './css/TodosTurnosPage.css'; 

// Estructura de turno 
interface Turno {
    _id: string;
    fecha: string;
    hora?: string; 
    cliente: string; 
    barbero: string;
    tipo: string; 
    servicios?: string;
    duracion: number;
    precio: number;
}

function TodosTurnosPage() {
    const navigate = useNavigate();
    const { user, logout, isLoading: isAuthLoading } = useAuth(); 

    // Estados
    const [turnos, setTurnos] = useState<Turno[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Manejo del Logout 
    const handleLogout = () => {
        logout();
    };


    useEffect(() => {

        if (isAuthLoading) { 
            return;
        }


        if (user?.tipoUsuario !== 'Barbero') {
            setError('Acceso denegado. Solo para Barberos.');
            setIsLoading(false);
            return;
        }
        
        const cargarTodosLosTurnos = async () => {
            setIsLoading(true);
            try {

                const response = await api.get('/turnos'); 
                

                const turnosOrdenados = response.data.sort((a: Turno, b: Turno) => 
                    new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
                );

                setTurnos(turnosOrdenados);
                setError('');
            } catch (err: any) {
                console.error('Error al cargar todos los turnos:', err);
                if (err.response?.status !== 401) { 
                    setError('No se pudieron cargar todos los turnos. Por favor intenta más tarde.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        cargarTodosLosTurnos();
        
    }, [isAuthLoading, user]); 


    const handleCancelar = async (id: string) => {
        if (!window.confirm('¿Estás seguro de que quieres cancelar este turno?')) {
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
    if (isAuthLoading || isLoading) {
        return (
            <div className="todos-turnos-container loading-container">
                <p>{isAuthLoading ? 'Verificando sesion...' : 'Cargando todos los turnos...'}</p>
            </div>
        );
    }
    
    // Renderizado de error de acceso
    if (error === 'Acceso denegado. Solo para Barberos.') {
        return (
            <div className="todos-turnos-container error-container">
                <h1> Acceso Denegado</h1>
                <p>Esta página es exclusiva para Barberos.</p>
                <Link to="/" className="btn-back">← Volver al Inicio</Link>
            </div>
        );
    }

    return (
        <div className="todos-turnos-container">
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        Todos los Turnos Programados
                    </h1>
                </div>

                {error && <div className="error-message">{error}</div>}

                {turnos.length === 0 && !error ? (
                    // Estado Vacio
                    <div className="empty-state">
                        <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3>No hay turnos programados</h3>
                        <p>El calendario está vacío.</p>
                    </div>
                ) : (
                    // Lista de Turnos en formato Tabla
                    <div className="turnos-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Barbero Asignado</th>
                                    <th>Tipo / Servicios</th>
                                    <th>Precio</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {turnos.map((turno) => (
                                    <tr key={turno._id}>
                                        <td><strong>{turno.cliente}</strong></td>
                                        <td>{formatearFecha(turno.fecha)}</td>
                                        <td>{formatearHora(turno.fecha)} hs</td>
                                        <td>{turno.barbero}</td>
                                        <td>
                                            {turno.tipo}
                                            {turno.servicios && <p className="servicios-small">({turno.servicios})</p>}
                                        </td>
                                        <td>${turno.precio}</td>
                                        <td>
                                            <button 
                                                className="btn-cancelar"
                                                onClick={() => handleCancelar(turno._id)}
                                            >
                                                Cancelar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TodosTurnosPage;