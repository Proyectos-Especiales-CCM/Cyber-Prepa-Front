import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Home from './Home';

const useAppContextMock = vi.fn();
const setGamesMock = vi.fn();
const getGamesDataMock = vi.fn();
const useWebSocketMock = vi.fn();
const webSocketState: {
  sendMessage: ReturnType<typeof vi.fn>;
  lastMessage: MessageEvent | null;
  getWebSocket: () => { close: ReturnType<typeof vi.fn> };
} = {
  sendMessage: vi.fn(),
  lastMessage: null,
  getWebSocket: () => ({ close: vi.fn() }),
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({ pathname: '/' }),
  };
});

vi.mock('react-use-websocket', () => ({
  default: (...args: unknown[]) => useWebSocketMock(...args),
}));

vi.mock('../../store/appContext/useAppContext', () => ({
  useAppContext: () => useAppContextMock(),
}));

vi.mock('../../store/gamesContext/useGamesContext', () => ({
  useGamesContext: () => ({
    setGames: setGamesMock,
  }),
}));

vi.mock('./getGames', () => ({
  getGamesData: (...args: unknown[]) => getGamesDataMock(...args),
}));

vi.mock('../../components', () => ({
  Card: ({ cardGame }: { cardGame: { name: string; needsUpdate?: boolean } }) => (
    <div>
      Card:{cardGame.name}:{String(Boolean(cardGame.needsUpdate))}
    </div>
  ),
}));

vi.mock('../../components/Announcements', () => ({
  Announcements: () => <div>Announcements component</div>,
}));

vi.mock('../../components/MainPageTutorials/MainPageTutorials', () => ({
  MainPageTutorials: () => <div>Main tutorials</div>,
}));

vi.mock('../../components/SnackbarComponent', () => ({
  SnackbarComponent: ({ message }: { message: string }) => <div>Snackbar:{message}</div>,
}));

describe('Home page', () => {
  beforeEach(() => {
    useAppContextMock.mockReset();
    setGamesMock.mockReset();
    getGamesDataMock.mockReset();
    useWebSocketMock.mockReset();
    webSocketState.sendMessage = vi.fn();
    webSocketState.lastMessage = null;
    webSocketState.getWebSocket = () => ({ close: vi.fn() });

    useWebSocketMock.mockImplementation(() => webSocketState);
  });

  it('loads and renders game cards', async () => {
    const games = [
      { id: 1, name: 'FIFA', show: true, needsUpdate: false },
      { id: 2, name: 'Mario Kart', show: true, needsUpdate: false },
    ];

    useAppContextMock.mockReturnValue({
      user: undefined,
      tokens: undefined,
    });
    getGamesDataMock.mockResolvedValueOnce(games);

    render(<Home />);

    await waitFor(() => {
      expect(getGamesDataMock).toHaveBeenCalled();
    });

    expect(screen.getByText('Card:FIFA:false')).toBeInTheDocument();
    expect(screen.getByText('Card:Mario Kart:false')).toBeInTheDocument();
    expect(setGamesMock).toHaveBeenCalledWith(games);
  });

  it('shows tutorials section only for authenticated users', async () => {
    useAppContextMock.mockReturnValue({
      user: { id: '1', email: 'user@tec.mx', isAdmin: false, theme: 'dark', isActive: true },
      tokens: { access_token: 'token', refresh_token: 'refresh' },
    });
    getGamesDataMock.mockResolvedValueOnce([]);

    render(<Home />);

    await waitFor(() => {
      expect(getGamesDataMock).toHaveBeenCalled();
    });

    expect(screen.getByText('Guías y tutoriales')).toBeInTheDocument();
    expect(screen.getByText('Main tutorials')).toBeInTheDocument();
  });

  it('shows warning snackbar when games fetch fails', async () => {
    useAppContextMock.mockReturnValue({
      user: undefined,
      tokens: undefined,
    });
    getGamesDataMock.mockRejectedValueOnce(new Error('boom'));

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Snackbar:Hubo un error en el servidor, refresca la página')).toBeInTheDocument();
    });
  });

  it('marks the corresponding game as needsUpdate after websocket plays update', async () => {
    const games = [
      { id: 1, name: 'FIFA', show: true, needsUpdate: false },
      { id: 2, name: 'Mario Kart', show: true, needsUpdate: false },
    ];

    useAppContextMock.mockReturnValue({
      user: { id: '1', email: 'user@tec.mx', isAdmin: false, theme: 'dark', isActive: true },
      tokens: { access_token: 'token', refresh_token: 'refresh' },
    });
    getGamesDataMock.mockResolvedValue(games);

    const { rerender } = render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Card:FIFA:false')).toBeInTheDocument();
      expect(screen.getByText('Card:Mario Kart:false')).toBeInTheDocument();
    });

    webSocketState.lastMessage = {
      data: JSON.stringify({ message: 'Plays updated', info: 2 }),
    } as MessageEvent;

    rerender(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Card:Mario Kart:true')).toBeInTheDocument();
    });
  });
});