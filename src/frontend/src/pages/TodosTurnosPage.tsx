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
                {/* (Contenido) */}
                <div className="navbar-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <h2>💈 Turnos Agendados (Barbero)</h2>
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
                <h1>Todos los Turnos Programados</h1>
                {error && <div className="error-message" style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

                {turnos.length === 0 && !error ? (
                    // Estado Vacio
                    <div className="empty-state">
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