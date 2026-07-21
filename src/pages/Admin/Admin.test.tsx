import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Admin from './Admin';

const useAppContextMock = vi.fn();

vi.mock('@mui/icons-material', () => ({
  Explore: () => <span>ExploreIcon</span>,
  FindInPage: () => <span>FindIcon</span>,
  Help: () => <span>HelpIcon</span>,
  Image: () => <span>ImageIcon</span>,
  Key: () => <span>KeyIcon</span>,
  People: () => <span>PeopleIcon</span>,
  Rule: () => <span>RuleIcon</span>,
  SportsEsports: () => <span>SportsIcon</span>,
  VideogameAsset: () => <span>GameAssetIcon</span>,
  VideogameAssetOff: () => <span>GameAssetOffIcon</span>,
  Warning: () => <span>WarningIcon</span>,
}));

vi.mock('../../store/appContext/useAppContext', () => ({
  useAppContext: () => useAppContextMock(),
}));

vi.mock('../../components/Tables/NewTables/Plays', () => ({ PlaysDataTable: () => <div>Plays table</div> }));
vi.mock('../../components/Tables/NewTables/OwedMaterials', () => ({ OwedMaterialDataTable: () => <div>Owed materials table</div> }));
vi.mock('../../components/Tables/NewTables/Sanctions', () => ({ SanctionsDataTable: () => <div>Sanctions table</div> }));
vi.mock('../../components/Tables/NewTables/Materials', () => ({ MaterialDataTable: () => <div>Materials table</div> }));
vi.mock('../../components/Tables/NewTables/Games', () => ({ GamesDataTable: () => <div>Games table</div> }));
vi.mock('../../components/Tables/NewTables/Images', () => ({ ImagesDataTable: () => <div>Images table</div> }));
vi.mock('../../components/Tables/NewTables/Students', () => ({ StudentsDataTable: () => <div>Students table</div> }));
vi.mock('../../components/Tables/NewTables/Logs', () => ({ LogsDataTable: () => <div>Logs table</div> }));
vi.mock('../../components/Tables/NewTables/Users', () => ({ UsersDataTable: () => <div>Users table</div> }));

vi.mock('../../components/AdminTutorials/AdminTutorials', () => ({
  AdminTutorials: () => <div>Admin tutorials</div>,
}));

describe('Admin page', () => {
  beforeEach(() => {
    useAppContextMock.mockReset();
  });

  it('renders shared tables but hides admin-only sections for non-admin users', () => {
    useAppContextMock.mockReturnValue({
      admin: false,
      driverObj: { setSteps: vi.fn(), drive: vi.fn() },
    });

    render(<Admin />);

    expect(screen.getByText('Plays table')).toBeInTheDocument();
    expect(screen.getByText('Owed materials table')).toBeInTheDocument();
    expect(screen.getByText('Sanctions table')).toBeInTheDocument();
    expect(screen.queryByText('Materials table')).not.toBeInTheDocument();
    expect(screen.queryByText('Users table')).not.toBeInTheDocument();
  });

  it('renders admin-only sections for admins and toggles students table', () => {
    useAppContextMock.mockReturnValue({
      admin: true,
      driverObj: { setSteps: vi.fn(), drive: vi.fn() },
    });

    render(<Admin />);

    expect(screen.getByText('Materials table')).toBeInTheDocument();
    expect(screen.getByText('Games table')).toBeInTheDocument();
    expect(screen.getByText('Images table')).toBeInTheDocument();
    expect(screen.getByText('Logs table')).toBeInTheDocument();
    expect(screen.getByText('Users table')).toBeInTheDocument();

    expect(screen.queryByText('Students table')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar tabla de estudiantes' }));
    expect(screen.getByText('Students table')).toBeInTheDocument();
  });
});