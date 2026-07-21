import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ConnectedUsersTooltip from './ConnectedUsersTooltip';

const useWebSocketMock = vi.fn();

vi.mock('react-use-websocket', () => ({
  default: (...args: unknown[]) => useWebSocketMock(...args),
  ReadyState: {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
    UNINSTANTIATED: -1,
  },
}));

describe('ConnectedUsersTooltip component', () => {
  beforeEach(() => {
    useWebSocketMock.mockReset();
  });

  it('connects to users websocket with token and renders list on hover', async () => {
    useWebSocketMock.mockReturnValue({
      lastMessage: {
        data: JSON.stringify({ users: ['a01606010@tec.mx', 'a01606011@tec.mx'] }),
      },
      readyState: 1,
    });

    render(<ConnectedUsersTooltip accessToken="token-123" />);

    expect(useWebSocketMock).toHaveBeenCalled();
    expect(String(useWebSocketMock.mock.calls[0][0])).toContain('ws/users/?token=token-123');

    const button = screen.getByRole('button', { name: 'usuarios conectados' });
    fireEvent.mouseEnter(button);

    expect(await screen.findByText('Usuarios conectados (2)')).toBeInTheDocument();
    expect(screen.getByText('a01606010@tec.mx')).toBeInTheDocument();
    expect(screen.getByText('a01606011@tec.mx')).toBeInTheDocument();
  });

  it('keeps tooltip open after mouse leave when clicked', async () => {
    useWebSocketMock.mockReturnValue({
      lastMessage: {
        data: JSON.stringify({ users: ['admin@tec.mx'] }),
      },
      readyState: 1,
    });

    render(<ConnectedUsersTooltip accessToken="token-abc" />);

    const button = screen.getByRole('button', { name: 'usuarios conectados' });

    fireEvent.mouseEnter(button);
    expect(await screen.findByText('admin@tec.mx')).toBeInTheDocument();

    fireEvent.click(button);
    fireEvent.mouseLeave(button);

    expect(screen.getByText('admin@tec.mx')).toBeInTheDocument();
  });
});
