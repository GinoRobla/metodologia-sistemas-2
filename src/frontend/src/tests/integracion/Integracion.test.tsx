import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../App';
import * as AuthContext from '../../context/AuthContext';
import api from '../../services/api';

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('App - Test de Integración', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
    localStorage.clear();
  });

  it('debe mostrar LoginPage cuando no hay usuario autenticado', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      token: null,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(<App />);

    expect(screen.getByRole('heading', { name: /Barbería - Inicio de Sesión/i })).toBeInTheDocument();
  });

  it('debe mostrar HomePage cuando hay usuario autenticado', async () => {
    const mockUser = {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan@test.com',
      tipoUsuario: 'Cliente',
    };

    vi.mocked(api.get).mockResolvedValue({ data: [] });

    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: mockUser,
      token: 'mock-token',
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Bienvenido, Juan Pérez/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar pantalla de carga mientras verifica la sesión', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      token: null,
      isLoading: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(<App />);

    expect(screen.getByText(/Cargando.../i)).toBeInTheDocument();
  });

  it('debe permitir navegar de Login a Register', async () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      token: null,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(<App />);

    const registerLink = screen.getByText(/Registrate acá/i);
    fireEvent.click(registerLink);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Crear Cuenta/i })).toBeInTheDocument();
    });
  });

  it('debe mostrar acciones de Cliente para tipo Cliente', async () => {
    const mockUser = {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan@test.com',
      tipoUsuario: 'Cliente',
    };

    vi.mocked(api.get).mockResolvedValue({ data: [] });

    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: mockUser,
      token: 'mock-token',
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Reservar Turno/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar acciones de Barbero para tipo Barbero', async () => {
    const mockUser = {
      id: 2,
      nombre: 'Carlos Barbero',
      email: 'carlos@barberia.com',
      tipoUsuario: 'Barbero',
    };

    vi.mocked(api.get).mockResolvedValue({ data: [] });

    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: mockUser,
      token: 'mock-token',
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Ver Todos los Turnos/i)).toBeInTheDocument();
    });
  });

  it('debe ejecutar logout correctamente', async () => {
    const mockLogout = vi.fn();
    const mockUser = {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan@test.com',
      tipoUsuario: 'Cliente',
    };

    vi.mocked(api.get).mockResolvedValue({ data: [] });

    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: mockUser,
      token: 'mock-token',
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: mockLogout,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Cerrar Sesión/i)).toBeInTheDocument();
    });

    const logoutButton = screen.getByText(/Cerrar Sesión/i);
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it('debe navegar a ReservarTurno al hacer clic', async () => {
    const mockUser = {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan@test.com',
      tipoUsuario: 'Cliente',
    };

    vi.mocked(api.get).mockResolvedValue({ data: [
      { _id: 1, nombre: 'Carlos', email: 'carlos@test.com' }
    ]});

    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: mockUser,
      token: 'mock-token',
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Reservar Turno/i)).toBeInTheDocument();
    });

    const reservarLink = screen.getByText(/Reservar Turno/i);
    fireEvent.click(reservarLink);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Reservar Turno/i })).toBeInTheDocument();
    });
  });

  it('debe mostrar información de debug del usuario', async () => {
    const mockUser = {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan@test.com',
      tipoUsuario: 'Cliente',
    };

    vi.mocked(api.get).mockResolvedValue({ data: [] });

    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: mockUser,
      token: 'mock-token',
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    window.history.pushState({}, '', '/');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Bienvenido, Juan Pérez/i)).toBeInTheDocument();
    });
  });

  it('debe manejar registro exitoso', async () => {
    const mockRegister = vi.fn().mockResolvedValue(undefined);

    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      token: null,
      isLoading: false,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
    });

    window.history.pushState({}, '', '/register');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Crear Cuenta/i })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Nombre Completo/i), { target: { value: 'Nuevo' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'nuevo@test.com' } });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '1123456789' } });
    fireEvent.change(screen.getByLabelText(/^Contraseña$/i), { target: { value: 'pass123' } });
    fireEvent.change(screen.getByLabelText(/Confirmar Contraseña/i), { target: { value: 'pass123' } });

    fireEvent.click(screen.getByRole('button', { name: /Crear Cuenta/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });
  });
});