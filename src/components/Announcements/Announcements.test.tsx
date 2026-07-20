import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Announcements } from './Announcements';

const useAppContextMock = vi.fn();
const readAnnouncementsMock = vi.fn();
const announcementRenderMock = vi.fn();

vi.mock('@mui/icons-material', () => ({
  Add: () => <span>AddIcon</span>,
}));

vi.mock('../../store/appContext/useAppContext', () => ({
  useAppContext: () => useAppContextMock(),
}));

vi.mock('../../services/rental/readAnnouncements', () => ({
  readAnnouncements: (...args: unknown[]) => readAnnouncementsMock(...args),
}));

vi.mock('../Modal', () => ({
  Modal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('./CreateUpdateAnnouncementPanel', () => ({
  CreateUpdateAnnouncementPanel: () => <div>Create update panel</div>,
}));

vi.mock('../SnackbarComponent', () => ({
  SnackbarComponent: () => <div>Announcements snackbar</div>,
}));

vi.mock('./Announcement', () => ({
  Announcement: ({ announcement }: { announcement: { id: number; title: string } }) => {
    announcementRenderMock(announcement);
    return <div>Rendered announcement: {announcement.title}</div>;
  },
}));

describe('Announcements component', () => {
  const now = new Date();
  const activeStart = new Date(now.getTime() - 60_000).toISOString();
  const activeEnd = new Date(now.getTime() + 60_000).toISOString();
  const expiredStart = new Date(now.getTime() - 120_000).toISOString();
  const expiredEnd = new Date(now.getTime() - 60_000).toISOString();

  const activeAnnouncement = {
    id: 1,
    title: 'Activo',
    content: 'vigente',
    start_at: activeStart,
    end_at: activeEnd,
  };

  const expiredAnnouncement = {
    id: 2,
    title: 'Expirado',
    content: 'pasado',
    start_at: expiredStart,
    end_at: expiredEnd,
  };

  beforeEach(() => {
    useAppContextMock.mockReset();
    readAnnouncementsMock.mockReset();
    announcementRenderMock.mockReset();
    readAnnouncementsMock.mockResolvedValue({
      data: [activeAnnouncement, expiredAnnouncement],
    });
  });

  it('shows only active announcements for non-admin users', async () => {
    useAppContextMock.mockReturnValue({
      tokens: undefined,
      admin: false,
    });

    render(<Announcements lastMessage={null} />);

    await waitFor(() => {
      expect(screen.getByText('Rendered announcement: Activo')).toBeInTheDocument();
    });

    expect(screen.queryByText('Rendered announcement: Expirado')).not.toBeInTheDocument();
  });

  it('shows all announcements for admin users', async () => {
    useAppContextMock.mockReturnValue({
      tokens: { access_token: 'token', refresh_token: 'refresh' },
      admin: true,
    });

    render(<Announcements lastMessage={null} />);

    await waitFor(() => {
      expect(screen.getByText('Rendered announcement: Activo')).toBeInTheDocument();
      expect(screen.getByText('Rendered announcement: Expirado')).toBeInTheDocument();
    });

    expect(screen.getByText('Crear nuevo anuncio')).toBeInTheDocument();
  });

  it('refreshes announcements when websocket update arrives', async () => {
    useAppContextMock.mockReturnValue({
      tokens: { access_token: 'token', refresh_token: 'refresh' },
      admin: false,
    });

    const websocketMessage = {
      data: JSON.stringify({ message: 'Announcements updated' }),
    } as MessageEvent;

    const { rerender } = render(<Announcements lastMessage={null} />);

    await waitFor(() => {
      expect(readAnnouncementsMock).toHaveBeenCalledTimes(1);
    });

    rerender(<Announcements lastMessage={websocketMessage} />);

    await waitFor(() => {
      expect(readAnnouncementsMock).toHaveBeenCalledTimes(2);
    });
  });
});