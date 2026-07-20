import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Card from './Card';

const initCardsFunctionalityMock = vi.fn();
const initCountdownMock = vi.fn();
const completeImageUrlMock = vi.fn();
const readGameByIdMock = vi.fn();

vi.mock('./initCardsFunctionality', () => ({
  initCardsFunctionality: (...args: unknown[]) => initCardsFunctionalityMock(...args),
}));

vi.mock('./initCountdown', () => ({
  initCountdown: (...args: unknown[]) => initCountdownMock(...args),
}));

vi.mock('../../services', () => ({
  completeImageUrl: (...args: unknown[]) => completeImageUrlMock(...args),
  patchPlayById: vi.fn(),
  readGameById: (...args: unknown[]) => readGameByIdMock(...args),
}));

vi.mock('../../store/appContext/useAppContext', () => ({
  useAppContext: () => ({
    tokens: { access_token: 'token', refresh_token: 'refresh' },
    user: { id: '1', email: 'user@tec.mx', isAdmin: false, theme: 'dark', isActive: true },
  }),
}));

vi.mock('..', () => ({
  CardExpander: ({ countdownStatus }: { countdownStatus: string }) => <div>CardExpander:{countdownStatus}</div>,
}));

vi.mock('../SnackbarComponent', () => ({
  SnackbarComponent: ({ message }: { message: string }) => <div>Snackbar:{message}</div>,
}));

describe('Card component', () => {
  const baseGame = {
    id: 10,
    name: 'FIFA',
    image: '/fifa.png',
    show: true,
    start_time: '2026-01-01T10:00:00.000Z',
    plays: [{ id: 99, student: 'a01234567', game: 10, ended: false, time: '', notices: [], owed_materials: [] }],
    needsUpdate: false,
  };

  beforeEach(() => {
    initCardsFunctionalityMock.mockReset();
    initCountdownMock.mockReset();
    completeImageUrlMock.mockReset();
    readGameByIdMock.mockReset();

    initCountdownMock.mockImplementation((_game, _ref, setStatus) => {
      setStatus('COUNTING');
      return 123;
    });
    completeImageUrlMock.mockImplementation((img: string) => `https://cdn.test${img}`);
  });

  it('renders game information and calls setup helpers for authenticated users', () => {
    render(
      <Card
        cardGame={baseGame}
        onUpdate={vi.fn()}
        sendMessage={vi.fn()}
      />,
    );

    expect(screen.getByText('FIFA')).toBeInTheDocument();
    expect(screen.getByText('1 jugador')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'FIFA' })).toHaveAttribute('src', 'https://cdn.test/fifa.png');
    expect(initCardsFunctionalityMock).toHaveBeenCalled();
    expect(initCountdownMock).toHaveBeenCalled();
    expect(screen.getByText('CardExpander:COUNTING')).toBeInTheDocument();
  });

  it('refreshes game data and triggers onUpdate when needsUpdate is true', async () => {
    const onUpdateMock = vi.fn();
    readGameByIdMock.mockResolvedValueOnce({
      data: {
        ...baseGame,
        plays: [
          ...baseGame.plays,
          { id: 100, student: 'a07654321', game: 10, ended: false, time: '', notices: [], owed_materials: [] },
        ],
      },
    });

    render(
      <Card
        cardGame={{ ...baseGame, needsUpdate: true }}
        onUpdate={onUpdateMock}
        sendMessage={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(readGameByIdMock).toHaveBeenCalledWith(10, 'token');
    });

    await waitFor(() => {
      expect(screen.getByText('2 jugadores')).toBeInTheDocument();
    });

    expect(onUpdateMock).toHaveBeenCalled();
  });

  it('sends websocket update after dropping a student on a new card', async () => {
    const sendMessageMock = vi.fn();

    render(
      <Card
        cardGame={baseGame}
        onUpdate={vi.fn()}
        sendMessage={sendMessageMock}
      />,
    );

    const cardNode = screen.getByText('FIFA').closest('.cyber__card') as HTMLElement;
    const dataTransfer = {
      getData: vi.fn(() => JSON.stringify({ playerId: 77, playerName: 'a01234567' })),
    };

    fireEvent.drop(cardNode, { dataTransfer });

    await waitFor(() => {
      expect(sendMessageMock).toHaveBeenCalledWith(10);
    });
  });
});