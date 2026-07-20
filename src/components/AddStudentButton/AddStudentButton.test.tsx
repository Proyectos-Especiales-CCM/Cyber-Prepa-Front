import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AddStudentButton from './AddStudentButton';

const createPlayMock = vi.fn();

vi.mock('../../services', () => ({
  createPlay: (...args: unknown[]) => createPlayMock(...args),
}));

vi.mock('../../store/appContext/useAppContext', () => ({
  useAppContext: () => ({
    tokens: {
      access_token: 'test-token',
      refresh_token: 'refresh-token',
    },
  }),
}));

vi.mock('..', () => ({
  Loading: () => <span>Loading</span>,
}));

describe('AddStudentButton component', () => {
  const game = {
    id: 1,
    name: 'FIFA',
    show: true,
    start_time: '2026-01-01T10:00:00.000Z',
    image: '',
    plays: [],
    needsUpdate: false,
  };

  beforeEach(() => {
    createPlayMock.mockReset();
  });

  it('auto-submits when a valid student id is fully typed', async () => {
    createPlayMock.mockResolvedValueOnce({ detail: 'ok', status: 200 });

    render(<AddStudentButton cardGame={game} style={{}} />);

    const input = screen.getByPlaceholderText('Matricula de estudiante');
    fireEvent.change(input, { target: { value: 'A01234567' } });

    await waitFor(() => {
      expect(createPlayMock).toHaveBeenCalledWith(false, 'a01234567', 1, 'test-token');
    });

    expect(screen.getByText('Estudiante A01234567 agregado exitosamente')).toBeInTheDocument();
  });

  it('shows warning when backend reports invalid student id', async () => {
    createPlayMock.mockResolvedValueOnce({ detail: 'Invalid student id', status: 400 });

    render(<AddStudentButton cardGame={game} style={{}} />);

    fireEvent.change(screen.getByPlaceholderText('Matricula de estudiante'), {
      target: { value: 'A00000000' },
    });

    await waitFor(() => {
      expect(screen.getByText('Matricula inválida, vuelve a intentarlo')).toBeInTheDocument();
    });
  });

  it('submits from button click even when id is not length 9', async () => {
    createPlayMock.mockResolvedValueOnce({ detail: 'Student is already playing', status: 400 });

    render(<AddStudentButton cardGame={game} style={{}} />);

    fireEvent.change(screen.getByPlaceholderText('Matricula de estudiante'), {
      target: { value: 'A123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Agregar estudiante' }));

    await waitFor(() => {
      expect(createPlayMock).toHaveBeenCalledWith(false, 'a123', 1, 'test-token');
    });
    expect(screen.getByText('El estudiante A123 ya se encuentra jugando')).toBeInTheDocument();
  });
});