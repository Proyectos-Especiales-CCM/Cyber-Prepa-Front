import { Explore, FindInPage, Image, Key, People, Rule, SportsEsports, VideogameAsset, VideogameAssetOff, Warning } from '@mui/icons-material';
import { Box, Button, SpeedDial, SpeedDialAction, Stack, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { GamesDataTable } from '../../components/Tables/NewTables/Games';
import { ImagesDataTable } from '../../components/Tables/NewTables/Images';
import { LogsDataTable } from '../../components/Tables/NewTables/Logs';
import { MaterialDataTable } from '../../components/Tables/NewTables/Materials';
import { OwedMaterialDataTable } from '../../components/Tables/NewTables/OwedMaterials';
import { PlaysDataTable } from '../../components/Tables/NewTables/Plays';
import { SanctionsDataTable } from '../../components/Tables/NewTables/Sanctions';
import { StudentsDataTable } from '../../components/Tables/NewTables/Students';
import { UsersDataTable } from '../../components/Tables/NewTables/Users';
import { useAppContext } from "../../store/appContext/useAppContext";
import './admin.css';


const Admin = () => {
  const { admin } = useAppContext();

  const [isStudentsTableVisible, setIsStudentsTableVisible] = useState(false);

  const handleButtonClick = () => {
    setIsStudentsTableVisible(prevState => !prevState);
  };

  // Refs para el quick navigation
  const playsTableRef = useRef(null);
  const owedMaterialsTableRef = useRef(null);
  const sanctionsTableRef = useRef(null);
  const materialsTableRef = useRef(null);
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
    { icon: <VideogameAssetOff />, name: 'Deben material', action: () => owedMaterialsTableRef.current && (owedMaterialsTableRef.current as HTMLElement).scrollIntoView() },
    { icon: <Rule />, name: 'Partidas', action: () => playsTableRef.current && (playsTableRef.current as HTMLElement).scrollIntoView() },
  ];

  const adminRoutes = [
    { icon: <Key />, name: 'Usuarios', action: () => usersTableRef.current && (usersTableRef.current as HTMLElement).scrollIntoView() },
    { icon: <FindInPage />, name: 'Historial', action: () => logsTableRef.current && (logsTableRef.current as HTMLElement).scrollIntoView() },
    { icon: <People />, name: 'Estudiantes', action: () => studentsTableRef.current && (studentsTableRef.current as HTMLElement).scrollIntoView() },
    { icon: <Image />, name: 'Imágenes', action: () => imagesTableRef.current && (imagesTableRef.current as HTMLElement).scrollIntoView() },
    { icon: <SportsEsports />, name: 'Juegos', action: () => gamesTableRef.current && (gamesTableRef.current as HTMLElement).scrollIntoView() },
    { icon: <VideogameAsset />, name: 'Materiales', action: () => materialsTableRef.current && (materialsTableRef.current as HTMLElement).scrollIntoView() },
    ...routes,
  ];

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Box ref={playsTableRef} margin={2}>
          <PlaysDataTable />
        </Box>
        <Box ref={owedMaterialsTableRef} margin={2}>
          <OwedMaterialDataTable />
        </Box>
        <Box ref={sanctionsTableRef} margin={2}>
          <SanctionsDataTable />
        </Box>
        {admin ? (
          <>
            <Box ref={materialsTableRef} margin={2}>
              <MaterialDataTable />
            </Box>
            <Box ref={gamesTableRef} margin={2} >
              <GamesDataTable />
            </Box>
            <Box ref={imagesTableRef} margin={2} >
              <ImagesDataTable />
            </Box>
            <Box ref={studentsTableRef} margin={2} >
              {isStudentsTableVisible ?
                <StudentsDataTable /> :
                <Stack direction="row" justifyContent="space-between" alignItems="center" paddingY={25} paddingX={5} spacing={4}>
                  <Button variant="contained" color='secondary' onClick={handleButtonClick}>Mostrar tabla de estudiantes</Button>
                  <Typography>La tabla de estudiantes carga una gran cantidad de datos, para verla presione el botón y espere alrededor de 1 minuto para ver los datos de los alumnos como veces que jugó esta semana, el día de hoy, etc.</Typography>
                </Stack>
              }
            </Box>
            <Box ref={logsTableRef} margin={2}>
              <LogsDataTable />
            </Box>
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
