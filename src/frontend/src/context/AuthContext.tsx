import { createContext, useContext, useState, useEffect} from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';

// Define la estructura del usuario
interface User {
  nombre: string;
  email: string;
  tipoUsuario: string; // "Cliente" | "Barbero"
}

// Define qué cosas va a tener disponible el contexto
interface AuthContextType {
  user: User | null;              // Usuario actual (null si no está logueado)
  token: string | null;           // Token JWT
  login: (email: string, password: string) => Promise<void>;  // Función para login
  register: (nombre: string, email: string, telefono: string, password: string, tipoUsuario: string) => Promise<void>; // Función para registro
  logout: () => void;             // Función para logout
  isLoading: boolean;             // Indica si está cargando (verificando token)
}

// Crea el contexto (inicialmente undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider: componente que envuelve la app y provee el contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al cargar la app, verifica si hay token guardado
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  // Función de LOGIN
  const login = async (email: string, password: string) => {
    try {
      // Llama al backend
      const response = await api.post('/usuarios/auth/login', {
        email,
        contraseña: password
      });

      // El backend devuelve solo el token (string)
      const tokenReceived = response.data;

      // Decodifica el token para obtener los datos del usuario
      // JWT tiene 3 partes separadas por punto: header.payload.signature
      const payloadBase64 = tokenReceived.split('.')[1];
      const payloadDecoded = JSON.parse(atob(payloadBase64));

      // Crea el objeto user con los datos del payload
      const userData: User = {
        nombre: payloadDecoded.userName,
        email: payloadDecoded.userEmail,
        tipoUsuario: payloadDecoded.tipoUsuario // ✅ Ahora viene del backend
      };

      // Guarda en localStorage (persiste aunque cierres el navegador)
      localStorage.setItem('token', tokenReceived);
      localStorage.setItem('user', JSON.stringify(userData));

      // Actualiza el estado
      setToken(tokenReceived);
      setUser(userData);
    } catch (error: any) {
      console.error('Error en login:', error);
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  // Función de REGISTRO
  const register = async (nombre: string, email: string, telefono: string, password: string, tipoUsuario: string) => {
    try {
      // Llama al backend para registrar
      await api.post('/usuarios/auth/register', {
        nombre,
        email,
        telefono,
        contraseña: password,
        tipoUsuario
      });

      // Después de registrar, hace login automáticamente
      await login(email, password);
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw new Error(error.response?.data?.message || 'Error al registrarse');
    }
  };

  // Función de LOGOUT
  const logout = () => {
    // Borra todo
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Provee todos estos valores a los componentes hijos
  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto fácilmente
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  return context;
}