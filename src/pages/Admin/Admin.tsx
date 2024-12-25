import './admin.css';
import { useAppContext } from "../../store/appContext/useAppContext";
import { useRef } from "react";
import { Box, SpeedDial, SpeedDialAction } from "@mui/material";
import { Explore, SportsEsports, Rule, Warning, Image, People, FindInPage, Key, } from '@mui/icons-material';
import {
  LogsDataTable,
} from "../../components";
import { PlaysDataTable } from '../../components/Tables/NewTables/Plays';
import { SanctionsDataTable } from '../../components/Tables/NewTables/Sanctions';
import { GamesDataTable } from '../../components/Tables/NewTables/Games';
import { StudentsDataTable } from '../../components/Tables/NewTables/Students';
import { UsersDataTable } from '../../components/Tables/NewTables/Users';
import { ImagesDataTable } from '../../components/Tables/NewTables/Images';


const Admin = () => {
  const { admin } = useAppContext();

  // Refs para el quick navigation
  const playsTableRef = useRef(null);
  const sanctionsTableRef = useRef(null);
  const gamesTableRef = useRef(null);
  const imagesTableRef = useRef(null);
  const studentsTableRef = useRef(null);
  const logsTableRef = useRef(null);
  const usersTableRef = useRef(null);

  /* Quick actions to navigate to the different sections of the page */
  // Routes are rendered in the same order as they are declared
  // so the last route will be the topmost in the SpeedDial
  const routes = [
    { icon: <Warning />, name: 'Sanciones', action: () => sanctionsTableRef.current && (sanctionsTableRef.current as HTMLElement).scrollIntoView() },
    { icon: <Rule />, name: 'Partidas', action: () => playsTableRef.current && (playsTableRef.current as HTMLElement).scrollIntoView() },
  ];

  const adminRoutes = [
    { icon: <Key />, name: 'Usuarios', action: () => usersTableRef.current && (usersTableRef.current as HTMLElement).scrollIntoView() },
    { icon: <FindInPage />, name: 'Historial', action: () => logsTableRef.current && (logsTableRef.current as HTMLElement).scrollIntoView() },
    { icon: <People />, name: 'Estudiantes', action: () => studentsTableRef.current && (studentsTableRef.current as HTMLElement).scrollIntoView() },
    { icon: <Image />, name: 'Imágenes', action: () => imagesTableRef.current && (imagesTableRef.current as HTMLElement).scrollIntoView() },
    { icon: <SportsEsports />, name: 'Juegos', action: () => gamesTableRef.current && (gamesTableRef.current as HTMLElement).scrollIntoView() },
    ...routes,
  ];

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Box ref={playsTableRef} margin={2}>
          <PlaysDataTable />
        </Box>
        <Box ref={sanctionsTableRef} margin={2}>
          <SanctionsDataTable />
        </Box>
        {admin ? (
          <>
            <Box ref={gamesTableRef} margin={2} >
              <GamesDataTable />
            </Box>
            <Box ref={imagesTableRef} margin={2} >
              <ImagesDataTable />
            </Box>
            <Box ref={studentsTableRef} margin={2} >
              <StudentsDataTable />
            </Box>
            <LogsDataTable ref={logsTableRef} />
            <Box ref={usersTableRef} margin={2} >
              <UsersDataTable />
            </Box>
          </>
        ) : (
          <></>
        )}
        <SpeedDial
          ariaLabel="quick-navigation"
          sx={{ position: 'fixed', bottom: 10, right: 10 }}
          icon={<Explore />}
        >
          {(admin ? adminRoutes : routes).map((route) => (
            <SpeedDialAction
              key={route.name}
              icon={route.icon}
              tooltipTitle={route.name}
              tooltipOpen={true}
              onClick={route.action}
            />
          ))}
        </SpeedDial>
      </Box>
    </>
  )
}

export default Admin
