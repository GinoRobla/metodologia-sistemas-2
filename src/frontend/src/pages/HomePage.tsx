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
          <h2>💈 Barbería Sistema de Turnos</h2>
          <div className="navbar-right">
            <span className="user-info">
              {user?.nombre} ({user?.tipoUsuario})
            </span>
            <button onClick={handleLogout} className="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="home-content">
        <div className="welcome-card">
          <h1>¡Bienvenido, {user?.nombre}!</h1>
          <p className="user-type-badge">
            Tipo de usuario: <strong>{user?.tipoUsuario}</strong>
          </p>
          <p className="user-email">Email: {user?.email}</p>

          <div className="info-section">
            <h3>Acciones disponibles</h3>

            {user?.tipoUsuario === 'Cliente' ? (
              <div className="actions-grid">
                <Link to="/reservar-turno" className="action-button">
                  📅 Reservar Turno
                </Link>
                <Link to="/mis-turnos" className="action-button">
                  📋 Mis Turnos
                </Link>
                <button className="action-button" disabled>
                  💈 Ver Barberos (Próximamente)
                </button>
              </div>
            ) : (
              <div className="actions-grid">
                <button className="action-button" disabled>
                  📅 Ver Todos los Turnos (Próximamente)
                </button>
                <button className="action-button" disabled>
                  👥 Gestionar Clientes (Próximamente)
                </button>
                <button className="action-button" disabled>
                  ⚙️ Administrar (Próximamente)
                </button>
              </div>
            )}
          </div>

          <div className="debug-section">
            <h4>🔍 Información de Debug</h4>
            <pre>{JSON.stringify(user, null, 2)}</pre>
            <p className="debug-note">
              Token guardado en localStorage ✓
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;