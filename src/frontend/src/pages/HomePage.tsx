import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './css/HomePage.css';

function HomePage() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // El logout borra el token, y App.tsx detecta que user es null
    // Automáticamente redirige a /login
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <h2>
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Sistema de Turnos - Barbería
          </h2>
          <div className="navbar-right">
            <button onClick={handleLogout} className="btn-logout">
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="home-content">
        <div className="welcome-section">
          <h1 className="welcome-title">Bienvenido, {user?.nombre}</h1>
          <div className="user-info-card">
            <div className="user-badge">
              <svg className="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                {user?.tipoUsuario === 'Cliente' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
              <span className="badge-text">{user?.tipoUsuario}</span>
            </div>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>

        <div className="actions-section">
          <h2 className="section-title">Panel de Acciones</h2>

          {user?.tipoUsuario === 'Cliente' ? (
            <div className="actions-grid">
              <Link to="/reservar-turno" className="action-card">
                <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3>Reservar Turno</h3>
                <p>Agenda tu próxima cita</p>
              </Link>
              <Link to="/mis-turnos" className="action-card">
                <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3>Mis Turnos</h3>
                <p>Revisa tus reservas</p>
              </Link>
            </div>
          ) : (
            <div className="actions-grid">
              <Link to="/todos-turnos" className="action-card primary">
                <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <h3>Ver Todos los Turnos</h3>
                <p>Gestiona las reservas</p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;