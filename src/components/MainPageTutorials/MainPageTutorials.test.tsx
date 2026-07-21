import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MainPageTutorials } from './MainPageTutorials';

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

describe('MainPageTutorials component', () => {
  beforeEach(() => {
    setStepsMock.mockReset();
    driveMock.mockReset();
    moveNextMock.mockReset();
    movePreviousMock.mockReset();
    isActiveMock.mockReset();
    isActiveMock.mockReturnValue(false);
  });

  it('renders tutorial cards and starts tutorial on click', () => {
    render(<MainPageTutorials />);

    expect(screen.getByText('Agregar un jugador')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button', { name: 'Ver tutorial' });
    expect(buttons.length).toBeGreaterThan(0);

    fireEvent.click(buttons[0]);

    expect(setStepsMock).toHaveBeenCalledTimes(1);
    expect(driveMock).toHaveBeenCalledTimes(1);

    const steps = setStepsMock.mock.calls[0][0] as Array<{ popover?: { onNextClick?: () => void } }>;
    expect(steps[0]?.element).toBe('.cyber__card');

    const clickSpy = vi.fn();
    const querySelectorSpy = vi.spyOn(document, 'querySelector').mockReturnValue({
      click: clickSpy,
    } as unknown as Element);

    steps[0].popover?.onNextClick?.();

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(moveNextMock).toHaveBeenCalledTimes(1);

    querySelectorSpy.mockRestore();
  });
});