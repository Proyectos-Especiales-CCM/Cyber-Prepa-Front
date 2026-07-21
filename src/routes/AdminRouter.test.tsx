import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminRouter from './AdminRouter';

const readUserMeMock = vi.fn();
const useAppContextMock = vi.fn();

vi.mock('../components/Header/Header', () => ({
  default: () => <div>Header</div>,
}));

vi.mock('../components/Footer/Footer', () => ({
  default: () => <div>Footer</div>,
}));

vi.mock('../services', () => ({
  readUserMe: (...args: unknown[]) => readUserMeMock(...args),
}));

vi.mock('../store/appContext/useAppContext', () => ({
  useAppContext: () => useAppContextMock(),
}));

describe('AdminRouter', () => {
  const setUser = vi.fn();
  const setIsAdmin = vi.fn();

  beforeEach(() => {
    readUserMeMock.mockReset();
    useAppContextMock.mockReset();
    setUser.mockReset();
    setIsAdmin.mockReset();
  });

  it('redirects unauthenticated visitors away from admin routes', async () => {
    useAppContextMock.mockReturnValue({
      tokens: undefined,
      admin: false,
      setUser,
      setIsAdmin,
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route element={<AdminRouter />}>
            <Route path="/admin" element={<div>Admin Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    expect(screen.queryByText('Admin Page')).not.toBeInTheDocument();
    expect(readUserMeMock).not.toHaveBeenCalled();
  });

  it('renders nested admin content after backend validation confirms admin access', async () => {
    readUserMeMock.mockImplementation(async (_token: string, setUserArg: typeof setUser, setIsAdminArg: typeof setIsAdmin) => {
      setUserArg({
        id: '1',
        email: 'admin@example.com',
        isAdmin: true,
        theme: 'dark',
        isActive: true,
      });
      setIsAdminArg(true);
      return {
        status: 200,
        data: {
          id: '1',
          email: 'admin@example.com',
          is_admin: true,
          theme: 'dark',
          is_active: true,
        },
      };
    });

    useAppContextMock.mockReturnValue({
      tokens: { access_token: 'valid-token', refresh_token: 'refresh-token' },
      admin: true,
      setUser,
      setIsAdmin,
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route element={<AdminRouter />}>
            <Route path="/admin" element={<div>Admin Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Admin Page')).toBeInTheDocument();
    });

    expect(readUserMeMock).toHaveBeenCalledWith('valid-token', setUser, setIsAdmin);
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});