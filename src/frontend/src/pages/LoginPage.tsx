import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
  // Estado para los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estado para manejar errores y loading
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hook para navegar entre páginas
  const navigate = useNavigate();

  // Traemos la función login del contexto
  const { login } = useAuth();

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue

    setError(''); // Limpia errores previos
    setIsLoading(true); // Muestra que está cargando

    try {
      // Llama a la función login del contexto
      await login(email, password);

      // Si llegó acá, el login fue exitoso
      // Redirige a la página principal
      navigate('/');
    } catch (err: any) {
      // Si hubo error, lo muestra
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      // Siempre deja de mostrar "cargando"
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Barbería - Inicio de Sesión</h1>

        <form onSubmit={handleSubmit}>
          {/* Campo de Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              disabled={isLoading}
            />
          </div>

          {/* Campo de Contraseña */}
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Botón de submit */}
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Link para ir a registro */}
        <p className="register-link">
          ¿No tenés cuenta? <Link to="/register">Registrate acá</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;