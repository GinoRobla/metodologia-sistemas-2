import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import ReservarTurnoPage from '../../pages/ReservarTurnoPage';
import * as AuthContext from '../../context/AuthContext';
import api from '../../services/api';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ReservarTurnoPage', () => {
  const mockUser = {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    tipoUsuario: 'Cliente',
  };

  const mockBarberos = [
    { _id: 1, nombre: 'Carlos Barbero', email: 'carlos@barberia.com' },
    { _id: 2, nombre: 'Luis Estilista', email: 'luis@barberia.com' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: mockUser,
      logout: vi.fn(),
      login: vi.fn(),
      register: vi.fn(),
      token: 'mock-token',
      isLoading: false,
    });

    vi.mocked(api.get).mockResolvedValue({ data: mockBarberos });
    window.alert = vi.fn();
  });

  it('debe renderizar el formulario y cargar barberos', async () => {
    renderWithRouter(<ReservarTurnoPage />);

    expect(screen.getByRole('heading', { name: /Reservar Turno/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Tipo de Turno/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Carlos Barbero')).toBeInTheDocument();
      expect(screen.getByText('Luis Estilista')).toBeInTheDocument();
    });
  });

  it('debe cambiar tipo de turno y mostrar/ocultar campo de servicios', async () => {
    renderWithRouter(<ReservarTurnoPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Barbero/i)).toBeInTheDocument();
    });

    const tipoTurnoSelect = screen.getByLabelText(/Tipo de Turno/i);

    fireEvent.change(tipoTurnoSelect, { target: { value: 'Simple' } });
    expect(screen.getByLabelText(/Servicios/i)).toBeInTheDocument();

    fireEvent.change(tipoTurnoSelect, { target: { value: 'Combo' } });
    expect(screen.queryByLabelText(/Servicios/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Combo incluye:/i)).toBeInTheDocument();
  });

  it('debe validar campos requeridos antes de enviar', async () => {
    renderWithRouter(<ReservarTurnoPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Barbero/i)).toBeInTheDocument();
    });

    const barberoSelect = screen.getByLabelText(/Barbero/i) as HTMLSelectElement;
    const fechaInput = screen.getByLabelText(/Fecha y Hora/i) as HTMLInputElement;

    expect(barberoSelect).toHaveAttribute('required');
    expect(fechaInput).toHaveAttribute('required');
    expect(barberoSelect.value).toBe('');
  });

  it('debe validar horario de atención', async () => {
    renderWithRouter(<ReservarTurnoPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Barbero/i)).toBeInTheDocument();
    });

    const barberoSelect = screen.getByLabelText(/Barbero/i);
    const fechaInput = screen.getByLabelText(/Fecha y Hora/i);

    fireEvent.change(barberoSelect, { target: { value: 'Carlos Barbero' } });
    
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    manana.setHours(21, 0, 0, 0);
    fireEvent.change(fechaInput, { target: { value: manana.toISOString().slice(0, 16) } });

    fireEvent.click(screen.getByRole('button', { name: /Reservar Turno/i }));

    await waitFor(() => {
      expect(screen.getByText(/El horario de atención es de 9:00 a 20:00/i)).toBeInTheDocument();
    });
  });

  it('debe reservar un turno exitosamente', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockBarberos })
      .mockResolvedValueOnce({ data: [] });
    vi.mocked(api.post).mockResolvedValueOnce({ data: { success: true } });
    
    renderWithRouter(<ReservarTurnoPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Barbero/i)).toBeInTheDocument();
    });

    const tipoTurnoSelect = screen.getByLabelText(/Tipo de Turno/i);
    const barberoSelect = screen.getByLabelText(/Barbero/i);
    const fechaInput = screen.getByLabelText(/Fecha y Hora/i);

    fireEvent.change(tipoTurnoSelect, { target: { value: 'Combo' } });
    fireEvent.change(barberoSelect, { target: { value: 'Carlos Barbero' } });
    
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    manana.setHours(10, 0, 0, 0);
    fireEvent.change(fechaInput, { target: { value: manana.toISOString().slice(0, 16) } });

    fireEvent.click(screen.getByRole('button', { name: /Reservar Turno/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/turnos', expect.objectContaining({
        tipo: 'Combo',
        cliente: 'Juan Pérez',
        barbero: 'Carlos Barbero',
      }));
      expect(window.alert).toHaveBeenCalledWith('Turno reservado con exito!');
      expect(mockNavigate).toHaveBeenCalledWith('/mis-turnos');
    });
  });

  it('debe permitir seleccionar diferentes barberos y fechas', async () => {
    renderWithRouter(<ReservarTurnoPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Barbero/i)).toBeInTheDocument();
    });

    const tipoTurnoSelect = screen.getByLabelText(/Tipo de Turno/i) as HTMLSelectElement;
    const barberoSelect = screen.getByLabelText(/Barbero/i) as HTMLSelectElement;
    const fechaInput = screen.getByLabelText(/Fecha y Hora/i) as HTMLInputElement;

    fireEvent.change(tipoTurnoSelect, { target: { value: 'Express' } });
    expect(tipoTurnoSelect.value).toBe('Express');

    fireEvent.change(barberoSelect, { target: { value: 'Luis Estilista' } });
    expect(barberoSelect.value).toBe('Luis Estilista');

    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    manana.setHours(14, 30, 0, 0);
    const fechaFormateada = manana.toISOString().slice(0, 16);
    
    fireEvent.change(fechaInput, { target: { value: fechaFormateada } });
    expect(fechaInput.value).toBe(fechaFormateada);
  });

  it('debe navegar a home al cancelar', async () => {
    renderWithRouter(<ReservarTurnoPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Barbero/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('debe manejar error al cargar barberos', async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Error de red'));
    
    renderWithRouter(<ReservarTurnoPage />);

    await waitFor(() => {
      expect(screen.getByText(/No hay barberos disponibles/i)).toBeInTheDocument();
    });
  });

  it('debe manejar error al reservar turno', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: mockBarberos });
    vi.mocked(api.post).mockRejectedValueOnce(new Error('Error al reservar'));
    
    renderWithRouter(<ReservarTurnoPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Barbero/i)).toBeInTheDocument();
    });

    const tipoTurnoSelect = screen.getByLabelText(/Tipo de Turno/i);
    const barberoSelect = screen.getByLabelText(/Barbero/i);
    const fechaInput = screen.getByLabelText(/Fecha y Hora/i);

    fireEvent.change(tipoTurnoSelect, { target: { value: 'Combo' } });
    fireEvent.change(barberoSelect, { target: { value: 'Carlos Barbero' } });
    
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    manana.setHours(10, 0, 0, 0);
    fireEvent.change(fechaInput, { target: { value: manana.toISOString().slice(0, 16) } });

    fireEvent.click(screen.getByRole('button', { name: /Reservar Turno/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error al reservar el turno/i)).toBeInTheDocument();
    });
  });
});