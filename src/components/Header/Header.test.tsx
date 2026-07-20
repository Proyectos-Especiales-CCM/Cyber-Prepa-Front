import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Header from './Header';

const navigateMock = vi.fn();
const logOutMock = vi.fn();
const useAppContextMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('../../store/appContext/useAppContext', () => ({
  useAppContext: () => useAppContextMock(),
}));

vi.mock('..', () => ({
  CyberPrepaLogo: () => <div data-testid="logo">Logo</div>,
}));

describe('Header component', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    logOutMock.mockReset();
    useAppContextMock.mockReset();
  });

  it('shows login button when there is no active user', () => {
    useAppContextMock.mockReturnValue({
      logOut: logOutMock,
      user: undefined,
      admin: false,
    });

    render(<Header />);

    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'ADMIN' })).not.toBeInTheDocument();
  });

  it('shows admin-only actions for admin users', () => {
    useAppContextMock.mockReturnValue({
      logOut: logOutMock,
      user: { id: '1', email: 'admin@tec.mx', isAdmin: true, theme: 'dark', isActive: true },
      admin: true,
    });

    render(<Header />);

    expect(screen.getByRole('button', { name: 'ADMIN' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'HISTORIAL DE ALUMNOS' })).toBeInTheDocument();
  });

  it('navigates to reglamento when clicking reglamento button', () => {
    useAppContextMock.mockReturnValue({
      logOut: logOutMock,
      user: undefined,
      admin: false,
    });

    render(<Header />);

    fireEvent.click(screen.getByRole('button', { name: 'REGLAMENTO' }));

    expect(navigateMock).toHaveBeenCalledWith('/reglamento');
  });
});