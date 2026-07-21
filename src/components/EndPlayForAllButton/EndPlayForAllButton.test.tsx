import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import EndPlayForAllButton from './EndPlayForAllButton';

const endPlaysByIdMock = vi.fn();

vi.mock('../../services', () => ({
  endPlaysById: (...args: unknown[]) => endPlaysByIdMock(...args),
}));

vi.mock('../../store/appContext/useAppContext', () => ({
  useAppContext: () => ({
    tokens: { access_token: 'token', refresh_token: 'refresh' },
  }),
}));

vi.mock('..', () => ({
  Loading: () => <span>Loading</span>,
}));

describe('EndPlayForAllButton component', () => {
  const game = {
    id: 11,
    name: 'FIFA',
    show: true,
    start_time: '',
    image: '',
    plays: [],
    needsUpdate: false,
  };

  beforeEach(() => {
    endPlaysByIdMock.mockReset();
  });

  it('shows success message when ending plays succeeds', async () => {
    endPlaysByIdMock.mockResolvedValueOnce({ status: 200, data: [] });

    render(<EndPlayForAllButton cardGame={game} />);
    fireEvent.click(screen.getByRole('button', { name: 'Finalizar juego para todos' }));

    await waitFor(() => {
      expect(endPlaysByIdMock).toHaveBeenCalledWith(11, 'token');
    });

    expect(screen.getByText('Juego terminado para todos')).toBeInTheDocument();
  });

  it('shows warning message when backend returns non-200 status', async () => {
    endPlaysByIdMock.mockResolvedValueOnce({ status: 500, data: [] });

    render(<EndPlayForAllButton cardGame={game} />);
    fireEvent.click(screen.getByRole('button', { name: 'Finalizar juego para todos' }));

    await waitFor(() => {
      expect(screen.getByText('Error terminando juego, vuelve a intentarlo')).toBeInTheDocument();
    });
  });
});