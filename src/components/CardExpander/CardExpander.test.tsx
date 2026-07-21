import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CardExpander from './CardExpander';

vi.mock('..', () => ({
  AddStudentButton: ({ style }: { style: { opacity?: number; pointerEvents?: string } }) => (
    <div>AddStudent:{String(style.opacity ?? 1)}:{String(style.pointerEvents ?? 'auto')}</div>
  ),
  CollapsedStudents: ({ isGameActive }: { isGameActive: boolean }) => <div>Collapsed:{String(isGameActive)}</div>,
}));

vi.mock('../EndPlayForAllButton', () => ({
  EndPlayForAllButton: () => <div>EndPlayForAll</div>,
}));

describe('CardExpander component', () => {
  const gameWithPlayers = {
    id: 7,
    name: 'Pool',
    show: true,
    start_time: '2026-01-01T00:00:00.000Z',
    image: '',
    plays: [{ id: 1, student: 'a01234567', game: 7, ended: false, time: '', notices: [], owed_materials: [] }],
    needsUpdate: false,
  };

  it('shows end-play-for-all when there are active players', () => {
    render(<CardExpander cardGame={gameWithPlayers} countdownStatus="COUNTING" />);

    expect(screen.getByText('EndPlayForAll')).toBeInTheDocument();
    expect(screen.getByText('AddStudent:1:auto')).toBeInTheDocument();
    expect(screen.getByText('Collapsed:true')).toBeInTheDocument();
  });

  it('fades actions and hides end-play-for-all when game is expired or has no players', () => {
    render(
      <CardExpander
        cardGame={{ ...gameWithPlayers, plays: [] }}
        countdownStatus="AGOTADO"
      />,
    );

    expect(screen.queryByText('EndPlayForAll')).not.toBeInTheDocument();
    expect(screen.getByText('AddStudent:0.5:none')).toBeInTheDocument();
    expect(screen.getByText('Collapsed:false')).toBeInTheDocument();
  });
});