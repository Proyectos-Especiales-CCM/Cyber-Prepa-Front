import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ChangeGameButton from './ChangeGameButton';

const patchPlayByIdMock = vi.fn();
const useGamesContextMock = vi.fn();
const useAppContextMock = vi.fn();

vi.mock('@mui/icons-material', () => ({
  MoveUpOutlined: () => <span>MoveUpIcon</span>,
}));

vi.mock('../../services', () => ({
  patchPlayById: (...args: unknown[]) => patchPlayByIdMock(...args),
}));

vi.mock('../../store/gamesContext/useGamesContext', () => ({
  useGamesContext: () => useGamesContextMock(),
}));

vi.mock('../../store/appContext/useAppContext', () => ({
  useAppContext: () => useAppContextMock(),
}));

describe('ChangeGameButton component', () => {
  const player = {
    id: 4,
    student: 'a01234567',
    game: 2,
    ended: false,
    time: '',
    notices: [],
    owed_materials: [],
  };

  beforeEach(() => {
    patchPlayByIdMock.mockReset();
    useGamesContextMock.mockReset();
    useAppContextMock.mockReset();

    useGamesContextMock.mockReturnValue({
      games: [
        { id: 1, name: 'FIFA' },
        { id: 2, name: 'Mario Kart' },
        { id: 3, name: 'Smash' },
      ],
    });

    useAppContextMock.mockReturnValue({
      tokens: { access_token: 'token', refresh_token: 'refresh' },
    });
  });

  it('renders only destination games (excluding current game)', async () => {
    render(<ChangeGameButton player={player} />);

    fireEvent.click(screen.getByRole('button', { name: 'Cambiar de juego' }));

    expect(screen.getByText('FIFA')).toBeInTheDocument();
    expect(screen.getByText('Smash')).toBeInTheDocument();
    expect(screen.queryByText('Mario Kart')).not.toBeInTheDocument();
  });

  it('changes game and shows success message', async () => {
    patchPlayByIdMock.mockResolvedValueOnce({});

    render(<ChangeGameButton player={player} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cambiar de juego' }));
    fireEvent.click(screen.getByText('FIFA'));

    await waitFor(() => {
      expect(patchPlayByIdMock).toHaveBeenCalledWith(4, 'token', { game: 1 });
    });

    expect(screen.getByText('Juego del estudiante a01234567 cambiado de juego exitosamente.')).toBeInTheDocument();
  });

  it('shows session error when token is missing', async () => {
    useAppContextMock.mockReturnValue({ tokens: undefined });

    render(<ChangeGameButton player={player} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cambiar de juego' }));
    fireEvent.click(screen.getByText('FIFA'));

    await waitFor(() => {
      expect(screen.getByText('Se agotó el tiempo de la sesión del usuario.')).toBeInTheDocument();
    });

    expect(patchPlayByIdMock).not.toHaveBeenCalled();
  });
});