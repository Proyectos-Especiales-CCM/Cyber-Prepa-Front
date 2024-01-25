import './admin.css'
import MUIDataTable from "mui-datatables";
import { Box, Button, Stack, IconButton } from "@mui/material";
import { Delete, Visibility, VisibilityOff, Cancel, CheckCircle, KeyboardDoubleArrowUp, KeyboardDoubleArrowDown } from '@mui/icons-material';
import { useAppContext } from "../../store/appContext/appContext";
import { useState, useEffect } from "react";
import { readPlays, readGames, readStudents, readUsers, patchUserById, changeIdToName } from "../../services";
import {
  playColumns,
  gameColumns,
  studentColumns,
  userColumns,
  tableOptions,
  ModalMessage,
  Modal,
  CreateUserPanel,
  CreateGamePanel
} from "../../components";
import { ApiResponse, Game, Play, Student, User } from '../../services/types';

const Admin = () => {
  const { tokens, admin } = useAppContext();

  const [gamesData, setGamesData] = useState<Game[]>([]);
  const [playsData, setPlaysData] = useState<Play[]>([]);
  const [sanctionsData, setSanctionsData] = useState([]);
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [gamesSelected] = useState([]);
  const [usersSelected] = useState([]);
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

  const closeModal = () => {
    setModalAttr({
      ...modalAttr,
      openModal: false,
    });
  }
  const openModalMessage = (severity: string, message: string) => {
    setModalMessageAttr({
      ...modalMessageAttr,
      openModal: true,
      severity: severity,
      message: message,
    });
  }
  const updateGamesData = async () => {
    const response = await readGames(tokens?.access_token ?? "");
    response?.status === 200 ? setGamesData(response?.data) : console.error(response?.data);
  }
  const setAddGameModal = () => {
    setModalAttr({
      ...modalAttr,
      openModal: true,
      title: "Añadir Juego",
      children: (<><CreateGamePanel openModalMessage={openModalMessage} closeModal={closeModal} updateGamesData={updateGamesData} /></>),
    });
  }
  const updateUsersData = async () => {
    const response: ApiResponse<User> = await readUsers(tokens?.access_token ?? "");
    response?.status === 200 ? setUsersData(response?.data) : console.error(response?.data);
  }
  const handleUpdateUser = async (selectedRows: any, field: string, value: boolean | string) => {
    try {
      for (const row of selectedRows.data) {
        const index = row.dataIndex;

        let requestBody = {};
        if (field === "is_active") {
          requestBody = { is_active: value };
        }
        else if (field === "is_admin") {
          requestBody = { is_admin: value };
        }

        await patchUserById(usersData[index].id, tokens?.access_token ?? "", requestBody);
      }
      await updateUsersData();
      openModalMessage("success", "Usuario/s actualizado/s correctamente.");
    }
    catch (error) {
      openModalMessage("error", "Ha ocurrido un error al actualizar el/los usuario/s.");
      console.error(error);
    }
  }
  const setAddUserModal = () => {
    setModalAttr({
      ...modalAttr,
      openModal: true,
      title: "Añadir Usuario",
      children: (<><CreateUserPanel openModalMessage={openModalMessage} closeModal={closeModal} updateUsersData={updateUsersData} /></>),
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      const gameResponse = await readGames();
      const resGamesData = gameResponse?.data;
      gameResponse?.status === 200 ? setGamesData(resGamesData) : console.error(resGamesData);
      const playResponse = await readPlays(tokens?.access_token ?? "");
      playResponse?.status === 200 ? setPlaysData(changeIdToName(playResponse?.data, resGamesData)) : console.error(playResponse?.data);
      //const response = await readSanctions(tokens?.access_token ?? "");
      //response?.status === 200 ? setSanctionsData(response?.data) : console.log(response?.data);
      if (admin === true) {
        const studentResponse = await readStudents(tokens?.access_token ?? "");
        studentResponse?.status === 200 ? setStudentsData(studentResponse?.data) : console.error(studentResponse?.data);
        //response = await readBecarios(tokens?.access_token ?? "");
        //response?.status === 200 ? setBecariosData(response?.data) : console.log(response?.data);
        const userResponse = await readUsers(tokens?.access_token ?? "");
        userResponse?.status === 200 ? setUsersData(userResponse?.data) : console.error(userResponse?.data);
      }
    };

    fetchData();
  }, [tokens, admin]);

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <MUIDataTable
          title={"Historial de Partidas"}
          data={playsData}
          columns={playColumns}
          options={tableOptions}
          className="cyber__table"
        />
        <MUIDataTable
          title={"Sanciones"}
          data={sanctionsData}
          columns={["Estudiante", "Fecha y hora", "Detalle"]}
          options={tableOptions}
          className="cyber__table"
        />
        {admin ? (
          <>
            <MUIDataTable
              title={"Catálogo de Juegos"}
              data={gamesData}
              columns={gameColumns}
              options={{
                ...tableOptions,
                rowsSelected: gamesSelected,
                customToolbar: () => <Button variant='contained' color='success' onClick={setAddGameModal}>Añadir Juego</Button>,
                customToolbarSelect: (selectedRows: object) =>
                  <>
                    <Stack id='game-options' direction="row">
                      <IconButton
                        aria-label="show"
                        color="inherit"
                        size="large"
                        onClick={() => {
                          console.log(selectedRows);
                        }}
                      >
                        <Visibility fontSize='inherit' />
                      </IconButton>
                      <IconButton
                        aria-label="not-show"
                        color="inherit"
                        size="large"
                        onClick={() => {
                          console.log(selectedRows);
                        }}
                      >
                        <VisibilityOff fontSize='inherit' />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        color="error"
                        size="large"
                        onClick={() => {
                          console.log(selectedRows);
                        }}
                      >
                        <Delete fontSize='inherit' />
                      </IconButton>
                    </Stack>
                  </>,
              }}
              className="cyber__table"
            />
            <MUIDataTable
              title={"Estudiantes"}
              data={studentsData}
              columns={studentColumns}
              options={tableOptions}
              className="cyber__table"
            />
            <MUIDataTable
              title={"Historial de los Becarios"}
              data={[]}
              columns={["Usuario", "Fecha y hora", "Detalle"]}
              options={tableOptions}
              className="cyber__table"
            />
            <MUIDataTable
              title={"Usuarios"}
              data={usersData}
              columns={userColumns}
              options={{
                ...tableOptions,
                rowsSelected: usersSelected,
                customToolbar: () => <Button variant='contained' color='success' onClick={setAddUserModal}>Añadir Usuario</Button>,
                customToolbarSelect: (selectedRows: object) =>
                  <>
                    <Stack id='user-options' direction="row">
                      <IconButton
                        aria-label="make-admin"
                        color="warning"
                        size="large"
                        onClick={() => {
                          handleUpdateUser(selectedRows, "is_admin", true);
                        }}
                      >
                        <KeyboardDoubleArrowUp fontSize='inherit' />
                      </IconButton>
                      <IconButton
                        aria-label="make-non-admin"
                        color="info"
                        size="large"
                        onClick={() => {
                          handleUpdateUser(selectedRows, "is_admin", false);
                        }}
                      >
                        <KeyboardDoubleArrowDown fontSize='inherit' />
                      </IconButton>
                      <IconButton
                        aria-label="activate"
                        color="success"
                        size="large"
                        onClick={() => {
                          handleUpdateUser(selectedRows, "is_active", true);
                        }}
                      >
                        <CheckCircle fontSize='inherit' />
                      </IconButton>
                      <IconButton
                        aria-label="deactivate"
                        color="error"
                        size="large"
                        onClick={() => {
                          handleUpdateUser(selectedRows, "is_active", false);
                        }}
                      >
                        <Cancel fontSize='inherit' />
                      </IconButton>
                    </Stack>
                  </>,
              }}
              className="cyber__table"
            />
          </>
        ) : (
          <></>
        )}
        <Button onClick={() => console.log(playsData)}>Refresh Token</Button>
        <Modal {...modalAttr} />
        <ModalMessage {...modalMessageAttr} />
      </Box>
    </>
  )
}

export default Admin
