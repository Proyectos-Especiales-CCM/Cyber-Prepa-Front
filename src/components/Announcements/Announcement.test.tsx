import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Announcement } from './Announcement';

const useAppContextMock = vi.fn();
const deleteAnnouncementByIdMock = vi.fn();

vi.mock('@mui/icons-material', () => ({
  Delete: () => <span>DeleteIcon</span>,
  Edit: () => <span>EditIcon</span>,
}));

vi.mock('../../store/appContext/useAppContext', () => ({
  useAppContext: () => useAppContextMock(),
}));

vi.mock('../../services/rental/deleteAnnouncementById', () => ({
  deleteAnnouncementById: (...args: unknown[]) => deleteAnnouncementByIdMock(...args),
}));

describe('Announcement component', () => {
  const announcement = {
    id: 12,
    title: 'Nuevo aviso',
    content: 'Contenido importante',
    start_at: '2026-01-01T10:00:00.000Z',
    end_at: '2026-12-31T18:00:00.000Z',
  };

  beforeEach(() => {
    useAppContextMock.mockReset();
    deleteAnnouncementByIdMock.mockReset();
  });

  it('hides admin controls for non-admin users', () => {
    useAppContextMock.mockReturnValue({
      admin: false,
      tokens: undefined,
    });

    render(
      <Announcement
        announcement={announcement}
        setAnnOnModal={vi.fn()}
        openSnackbar={vi.fn()}
      />,
    );

    expect(screen.getByText('Nuevo aviso')).toBeInTheDocument();
    expect(screen.queryByText('DeleteIcon')).not.toBeInTheDocument();
    expect(screen.queryByText('EditIcon')).not.toBeInTheDocument();
  });

  it('executes delete flow for admins', () => {
    const openSnackbarMock = vi.fn();

    useAppContextMock.mockReturnValue({
      admin: true,
      tokens: { access_token: 'token', refresh_token: 'refresh' },
    });

    render(
      <Announcement
        announcement={announcement}
        setAnnOnModal={vi.fn()}
        openSnackbar={openSnackbarMock}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'DeleteIcon' }));

    expect(deleteAnnouncementByIdMock).toHaveBeenCalledWith(12, 'token');
    expect(openSnackbarMock).toHaveBeenCalledWith('Anuncio eliminado', 'success');
  });
});