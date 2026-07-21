import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ErrorPage from './ErrorPage';

describe('ErrorPage', () => {
  it('shows 404 texts and a link back to home', () => {
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('404 - Página No Encontrada')).toBeInTheDocument();
    expect(screen.getByText('La página que estás buscando no existe.')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'Regresar al inicio' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});