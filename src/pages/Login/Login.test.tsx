import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Login from './Login';

const navigateMock = vi.fn();
const logInAccessMock = vi.fn();

const setUserMock = vi.fn();
const setTokensMock = vi.fn();
const setIsAdminMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('@mui/icons-material', () => ({
  Password: () => <span data-testid="password-icon" />,
  Email: () => <span data-testid="email-icon" />,
}));

vi.mock('../../services', () => ({
  logInAccess: (...args: unknown[]) => logInAccessMock(...args),
}));

vi.mock('../../store/appContext/useAppContext', () => ({
  useAppContext: () => ({
    setUser: setUserMock,
    setTokens: setTokensMock,
    setIsAdmin: setIsAdminMock,
  }),
}));

describe('Login page', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    logInAccessMock.mockReset();
    setUserMock.mockReset();
    setTokensMock.mockReset();
    setIsAdminMock.mockReset();
  });

  it('shows validation message when fields are empty', async () => {
    render(<Login />);

    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(screen.getByText('Por favor rellena todos los campos')).toBeInTheDocument();
    expect(logInAccessMock).not.toHaveBeenCalled();
  });

  it('shows credentials feedback when login fails', async () => {
    logInAccessMock.mockResolvedValueOnce(null);
    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'user@tec.mx' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'bad-password' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(logInAccessMock).toHaveBeenCalled();
    });

    expect(screen.getByText('Por favor revisa tus credenciales.')).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('navigates to home on successful login when pressing Enter', async () => {
    logInAccessMock.mockResolvedValueOnce({ id: '1' });
    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'admin@tec.mx' },
    });

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.keyDown(screen.getByPlaceholderText('Password'), { key: 'Enter' });

    await waitFor(() => {
      expect(logInAccessMock).toHaveBeenCalledWith(
        'admin@tec.mx',
        'password123',
        setTokensMock,
        setUserMock,
        setIsAdminMock,
      );
    });

    expect(navigateMock).toHaveBeenCalledWith('/');
  });
});