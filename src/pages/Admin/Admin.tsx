import './admin.css';
import { useAppContext } from "../../store/appContext/appContext";
import { useState, useEffect, useRef } from "react";
import { Box, SpeedDial, SpeedDialAction } from "@mui/material";
import { Explore, SportsEsports, Rule, Warning, People, FindInPage, Key, } from '@mui/icons-material';
import { readImages, } from "../../services";
import {
  PlaysDataTable,
  GamesDataTable,
  StudentsDataTable,
  UsersDataTable,
  SanctionsDataTable,
  LogsDataTable,
  ModalMessage,
  Modal,
} from "../../components";
import { Image } from '../../services/types';

const Admin = () => {
  const { tokens, admin } = useAppContext();

  // Variables de datos de las tablas
  const [images, setImages] = useState<Image[]>([]);

  // Refs para el quick navigation
  const playsTableRef = useRef(null);
  const sanctionsTableRef = useRef(null);
  const gamesTableRef = useRef(null);
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
    { icon: <SportsEsports />, name: 'Juegos', action: () => gamesTableRef.current && (gamesTableRef.current as HTMLElement).scrollIntoView() },
    ...routes,
  ]

  // Variables de atributos de los modales
  const [modalAttr, setModalAttr] = useState({
    openModal: false,
    handleCloseModal: () => {
      setModalAttr({
        ...modalAttr,
        openModal: false,
      });
    },
    title: "Hello, I'm a Modal",
    children: (<><p>Sample Content</p></>),
  });
  const [modalMessageAttr, setModalMessageAttr] = useState({
    openModal: false,
    handleCloseModal: () => {
      setModalMessageAttr({
        ...modalMessageAttr,
        openModal: false,
      });
    },
    severity: "info",
    message: "Sample Message",
  });

  const openModalMessage = (severity: string, message: string) => {
    setModalMessageAttr({
      ...modalMessageAttr,
      openModal: true,
      severity: severity,
      message: message,
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (admin === true) {
          const imageResponse = await readImages(tokens?.access_token ?? "");
          setImages(imageResponse?.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [tokens, admin]);

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <PlaysDataTable openModalMessage={openModalMessage} ref={playsTableRef} />
        <SanctionsDataTable openModalMessage={openModalMessage} ref={sanctionsTableRef} />
        {admin ? (
          <>
            <GamesDataTable openModalMessage={openModalMessage} images={images} modalAttr={modalAttr} setModalAttr={setModalAttr} ref={gamesTableRef} />
            <StudentsDataTable openModalMessage={openModalMessage} ref={studentsTableRef} />
            <LogsDataTable openModalMessage={openModalMessage} ref={logsTableRef} />
            <UsersDataTable openModalMessage={openModalMessage} modalAttr={modalAttr} setModalAttr={setModalAttr} ref={usersTableRef} />
          </>
        ) : (
          <></>
        )}
        <Modal {...modalAttr} />
        <ModalMessage {...modalMessageAttr} />
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
