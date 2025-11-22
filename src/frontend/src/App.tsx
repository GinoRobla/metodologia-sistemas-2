import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  const { user, isLoading } = useAuth();

  // Mientras verifica si hay sesión guardada, muestra un loader
  if (isLoading) {
    return (
      <div className="loading-screen">
        <h2>Cargando...</h2>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas (solo accesibles si NO estás logueado) */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <RegisterPage />}
        />

        {/* Rutas protegidas (solo accesibles si SÍ estás logueado) */}
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/login" replace />}
        />

        {/* Ruta por defecto: redirige a login o home según estado */}
        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;