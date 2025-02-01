import { Explore, FindInPage, Help, Image, Key, People, Rule, SportsEsports, VideogameAsset, VideogameAssetOff, Warning } from '@mui/icons-material';
import { Box, Button, Chip, createTheme, Divider, IconButton, SpeedDial, SpeedDialAction, Stack, TextField, ThemeProvider, Typography } from "@mui/material";
import "driver.js/dist/driver.css";
import { useRef, useState } from "react";
import { AdminTutorials } from '../../components/AdminTutorials/AdminTutorials';
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
import "./Admin.css";

const darkTheme = createTheme({
  breakpoints: {
    values: {
      xs: 300,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: { mode: 'dark' }
});

const Admin = () => {
  const { admin, driverObj } = useAppContext();

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
      <Box margin={2}>
        <ThemeProvider theme={darkTheme}>
          <Stack direction='row' justifyContent='space-between' marginBottom={2} >
            <Typography marginLeft={4} fontFamily='fantasy' variant='h3'>Panel</Typography>
            <IconButton sx={{ height: 'fit' }} onClick={() => {
              driverObj?.setSteps([
                { element: '#tutorials', popover: { title: 'Tutoriales', description: 'Aquí podrás encontrar tutoriales para aprender a usar la sección de administrador.' } },
                { element: '#search-tutorials', popover: { title: 'Buscar tutoriales', description: 'Puedes buscar tutoriales específicos escribiendo en este campo.' } },
              ])
              driverObj?.drive()
            }}>
              <Help fontSize='large' />
            </IconButton>
          </Stack>
        </ThemeProvider>
        <Box ref={playsTableRef} >
          <PlaysDataTable />
        </Box>
        <Box ref={owedMaterialsTableRef} >
          <OwedMaterialDataTable />
        </Box>
        <Box ref={sanctionsTableRef} >
          <SanctionsDataTable />
        </Box>
        {admin ? (
          <>
            <Box ref={materialsTableRef} >
              <MaterialDataTable />
            </Box>
            <Box ref={gamesTableRef}  >
              <GamesDataTable />
            </Box>
            <Box ref={imagesTableRef}  >
              <ImagesDataTable />
            </Box>
            <Box ref={studentsTableRef}  >
              {isStudentsTableVisible ?
                <StudentsDataTable /> :
                <Stack direction="row" justifyContent="space-between" alignItems="center" paddingY={25} paddingX={5} spacing={4}>
                  <Button variant="contained" color='secondary' onClick={handleButtonClick}>Mostrar tabla de estudiantes</Button>
                  <Typography>La tabla de estudiantes carga una gran cantidad de datos, para verla presione el botón y espere alrededor de 1 minuto para ver los datos de los alumnos como veces que jugó esta semana, el día de hoy, etc.</Typography>
                </Stack>
              }
            </Box>
            <Box ref={logsTableRef} >
              <LogsDataTable />
            </Box>
            <Box ref={usersTableRef}  >
              <UsersDataTable />
            </Box>
          </>
        ) : (
          <></>
        )}

        <ThemeProvider theme={darkTheme}>
          <Divider />
          <Stack flexWrap='wrap' direction='row' alignItems='bottom' margin={2} >
            <Typography width={301} marginBottom={2} marginLeft={4} fontFamily='fantasy' variant='h3' id="tutorials">Guías y tutoriales</Typography>
            <TextField sx={{ marginLeft: 'auto', width: '100%', maxWidth: 280 }} id='search-tutorials' label='Buscar tutoriales' variant='outlined' />
          </Stack>
          <Divider sx={{ marginX: 4, marginBottom: 3 }} >
            <Chip label="TUTORIALES" size="small" />
          </Divider>
          <AdminTutorials />
        </ThemeProvider>

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
