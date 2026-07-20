import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Reglamento from './Reglamento';

describe('Reglamento page', () => {
  it('renders the page title and regulation list', () => {
    render(<Reglamento />);

    expect(screen.getByRole('heading', { name: 'Reglamento Cyber Prepa' })).toBeInTheDocument();
    expect(screen.getByText('1. Introducción al Reglamento')).toBeInTheDocument();
    expect(screen.getByText('26. Gestión de Credenciales Olvidadas')).toBeInTheDocument();
  });

  it('filters cards by search query', () => {
    render(<Reglamento />);

    fireEvent.change(screen.getByLabelText('Buscar en el reglamento'), {
      target: { value: 'apuestas' },
    });

    expect(screen.getByText('Prohibición de Apuestas')).toBeInTheDocument();
    expect(
      screen.queryByText('Horario de servicio: 8:30 am a 5:00 pm.'),
    ).not.toBeInTheDocument();
  });

  it('search is case-insensitive', () => {
    render(<Reglamento />);

    fireEvent.change(screen.getByLabelText('Buscar en el reglamento'), {
      target: { value: 'HORARIO' },
    });

    expect(screen.getByText('Horario de Servicio')).toBeInTheDocument();
    expect(screen.getByText('Horario de servicio: 8:30 am a 5:00 pm.')).toBeInTheDocument();
  });
});