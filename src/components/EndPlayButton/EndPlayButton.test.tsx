import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import EndPlayButton from './EndPlayButton';

const patchPlayByIdMock = vi.fn();

vi.mock('@mui/icons-material', () => ({
  Rule: () => <span>RuleIcon</span>,
}));

vi.mock('../../services', () => ({
  patchPlayById: (...args: unknown[]) => patchPlayByIdMock(...args),
}));

vi.mock('../../store/appContext/useAppContext', () => ({
  useAppContext: () => ({
    tokens: { access_token: 'token', refresh_token: 'refresh' },
  }),
}));

describe('EndPlayButton component', () => {
  const player = {
    id: 5,
    student: 'a01234567',
    game: 1,
    ended: false,
    time: '',
    notices: [],
    owed_materials: [],
  };

  beforeEach(() => {
    patchPlayByIdMock.mockReset();
  });

  it('finishes play and shows success message', async () => {
    patchPlayByIdMock.mockResolvedValueOnce({});

    render(<EndPlayButton player={player} cardGameId={1} isGameActive={true} />);

    fireEvent.click(screen.getByRole('button', { name: 'Terminar juego para el jugador' }));

    await waitFor(() => {
      expect(patchPlayByIdMock).toHaveBeenCalledWith(5, 'token', { ended: true });
    });

    expect(screen.getByText('Juego del estudiante a01234567 terminado exitosamente.')).toBeInTheDocument();
  });

  it('shows error message when request fails', async () => {
    patchPlayByIdMock.mockRejectedValueOnce(new Error('boom'));

    render(<EndPlayButton player={player} cardGameId={1} isGameActive={true} />);

    fireEvent.click(screen.getByRole('button', { name: 'Terminar juego para el jugador' }));

    await waitFor(() => {
      expect(screen.getByText('Error terminando el juego.')).toBeInTheDocument();
    });
  });

  it('is disabled when game is not active', () => {
    render(<EndPlayButton player={player} cardGameId={1} isGameActive={false} />);

    expect(screen.getByRole('button', { name: 'Terminar juego para el jugador' })).toBeDisabled();
  });
});