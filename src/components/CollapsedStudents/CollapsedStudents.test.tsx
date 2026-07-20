import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CollapsedStudents from './CollapsedStudents';

vi.mock('..', () => ({
  CollapsedStudentItem: ({ player }: { player: { student: string } }) => <div>Player:{player.student}</div>,
}));

describe('CollapsedStudents component', () => {
  it('shows unauthorized message when plays is a number', () => {
    render(
      <CollapsedStudents
        cardGame={{
          id: 1,
          name: 'FIFA',
          show: true,
          start_time: '',
          image: '',
          plays: 3,
          needsUpdate: false,
        }}
        isGameActive={true}
      />,
    );

    expect(screen.getByText('No estás autorizado para ver la data de los 3 jugadores')).toBeInTheDocument();
  });

  it('renders a collapsed student item per player when plays are loaded', () => {
    render(
      <CollapsedStudents
        cardGame={{
          id: 1,
          name: 'FIFA',
          show: true,
          start_time: '',
          image: '',
          plays: [
            { id: 1, student: 'a01234567', game: 1, ended: false, time: '', notices: [], owed_materials: [] },
            { id: 2, student: 'a07654321', game: 1, ended: false, time: '', notices: [], owed_materials: [] },
          ],
          needsUpdate: false,
        }}
        isGameActive={true}
      />,
    );

    expect(screen.getByText('Player:a01234567')).toBeInTheDocument();
    expect(screen.getByText('Player:a07654321')).toBeInTheDocument();
  });
});