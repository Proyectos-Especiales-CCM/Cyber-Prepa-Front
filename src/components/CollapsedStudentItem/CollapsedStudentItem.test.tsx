import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CollapsedStudentItem from './CollapsedStudentItem';

const copyMock = vi.fn();
const returnOwedMaterialMock = vi.fn();

vi.mock('@mui/icons-material', () => ({
  Check: () => <span>CheckIcon</span>,
  NotificationImportant: () => <span>NotificationImportantIcon</span>,
  PriorityHigh: () => <span>PriorityHighIcon</span>,
  SportsBaseball: () => <span>SportsBaseballIcon</span>,
}));

vi.mock('@mui/icons-material/ContentPaste', () => ({
  default: () => <span>ContentPasteIcon</span>,
}));

vi.mock('copy-to-clipboard', () => ({
  default: (...args: unknown[]) => copyMock(...args),
}));

vi.mock('../../services/rental/returnOwedMaterials', () => ({
  returnOwedMaterial: (...args: unknown[]) => returnOwedMaterialMock(...args),
}));

vi.mock('../../store/appContext/useAppContext', () => ({
  useAppContext: () => ({
    tokens: { access_token: 'token', refresh_token: 'refresh' },
  }),
}));

vi.mock('..', () => ({
  EndPlayButton: () => <button>EndPlayAction</button>,
  SanctionButton: () => <button>SanctionAction</button>,
}));

vi.mock('../ChangeGameButton/ChangeGameButton', () => ({
  default: () => <button>ChangeGameAction</button>,
}));

vi.mock('../SnackbarComponent', () => ({
  SnackbarComponent: ({ message }: { message: string }) => <div>{message}</div>,
}));

describe('CollapsedStudentItem component', () => {
  const player = {
    id: 9,
    student: 'a01234567',
    game: 1,
    ended: false,
    time: '',
    notices: [{ id: 1, cause: 'late', play: 1, student: 'a01234567', created_at: '' }],
    owed_materials: [{ id: 3, material: 20, material_name: 'Control', amount: 2, delivered: 0, student: 'a01234567', updated_at: '', created_at: '' }],
  };

  beforeEach(() => {
    copyMock.mockReset();
    returnOwedMaterialMock.mockReset();
  });

  it('copies student id to clipboard', () => {
    render(
      <CollapsedStudentItem
        player={player}
        cardGameId={1}
        isGameActive={true}
        notices={player.notices}
        owedMaterials={player.owed_materials}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Copiar' }));
    expect(copyMock).toHaveBeenCalledWith('a01234567');
  });

  it('sets drag payload on drag start', () => {
    render(
      <CollapsedStudentItem
        player={player}
        cardGameId={1}
        isGameActive={true}
        notices={player.notices}
        owedMaterials={player.owed_materials}
      />,
    );

    const dataTransfer = { setData: vi.fn() };
    const draggable = document.getElementById('9') as HTMLElement;

    fireEvent.dragStart(draggable, { dataTransfer });

    expect(dataTransfer.setData).toHaveBeenCalledWith(
      'application/json',
      JSON.stringify({ playerId: 9, playerName: 'a01234567' }),
    );
  });

  it('submits owed material return and shows success feedback', async () => {
    returnOwedMaterialMock.mockResolvedValueOnce({});

    render(
      <CollapsedStudentItem
        player={player}
        cardGameId={1}
        isGameActive={true}
        notices={player.notices}
        owedMaterials={player.owed_materials}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'SportsBaseballIcon' }));

    const amountInput = await screen.findByPlaceholderText('0');
    fireEvent.change(amountInput, { target: { value: '1' } });
    fireEvent.submit(amountInput.closest('form') as HTMLFormElement);

    await waitFor(() => {
      expect(returnOwedMaterialMock).toHaveBeenCalledWith(3, 1, 'token');
    });

    expect(screen.getByText('Material entregado con éxito')).toBeInTheDocument();
  });
});