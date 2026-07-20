import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminTutorials } from './AdminTutorials';

const setStepsMock = vi.fn();
const driveMock = vi.fn();
const moveNextMock = vi.fn();
const movePreviousMock = vi.fn();
const isActiveMock = vi.fn(() => false);

vi.mock('../../store/appContext/useAppContext', () => ({
  useAppContext: () => ({
    driverObj: {
      setSteps: setStepsMock,
      drive: driveMock,
      moveNext: moveNextMock,
      movePrevious: movePreviousMock,
      isActive: isActiveMock,
    },
  }),
}));

describe('AdminTutorials component', () => {
  beforeEach(() => {
    setStepsMock.mockReset();
    driveMock.mockReset();
    moveNextMock.mockReset();
    movePreviousMock.mockReset();
    isActiveMock.mockReset();
    isActiveMock.mockReturnValue(false);
  });

  it('renders tutorial cards and starts selected tutorial', () => {
    render(<AdminTutorials />);

    expect(screen.getByText('Borrar registros')).toBeInTheDocument();
    expect(screen.getByText('Crear nuevos usuarios')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: 'Ver tutorial' })[0]);

    expect(setStepsMock).toHaveBeenCalledTimes(1);
    expect(driveMock).toHaveBeenCalledTimes(1);

    const steps = setStepsMock.mock.calls[0][0] as Array<{ popover?: { onNextClick?: () => void } }>;
    expect(steps[1]?.element).toBe('#plays-table tbody tr td span input');

    const clickSpy = vi.fn();
    const querySelectorSpy = vi.spyOn(document, 'querySelector').mockReturnValue({
      click: clickSpy,
    } as unknown as Element);

    steps[1].popover?.onNextClick?.();

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(moveNextMock).toHaveBeenCalledTimes(1);

    querySelectorSpy.mockRestore();
  });
});