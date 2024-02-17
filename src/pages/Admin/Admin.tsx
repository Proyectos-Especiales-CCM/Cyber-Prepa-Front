import './admin.css'
import MUIDataTable from "mui-datatables";
import { Box, Button, Stack, IconButton, Tooltip } from "@mui/material";
import { Delete, Visibility, VisibilityOff, Cancel, CheckCircle, KeyboardDoubleArrowUp, KeyboardDoubleArrowDown, Edit } from '@mui/icons-material';
import { useAppContext } from "../../store/appContext/useAppContext";
import { useState, useEffect } from "react";
import {
  readPlays,
  readGames,
  readStudents,
  readUsers,
  readSanctions,
  readLogs,
  patchGameById,
  patchUserById,
  deletePlayById,
  deleteGameById,
  deleteSanctionById,
  changeIdToName,
  readImages,
  findImageIdWithUrl,
  completeImageUrl,
} from "../../services";
import {
  playColumns,
  gameColumns,
  studentColumns,
  userColumns,
  sanctionColumns,
  logColumns,
  tableOptions,
  ModalMessage,
  Modal,
  CreateUserPanel,
  ModifyUserPanel,
  CreateGamePanel,
  ModifyGamePanel,
} from "../../components";
import { ApiResponse, Game, Play, Student, User, Sanction, Log, Image } from '../../services/types';

const Admin = () => {
  const { tokens, admin } = useAppContext();

  // Variables de datos de las tablas
  const [gamesData, setGamesData] = useState<Game[]>([]);
  const [playsData, setPlaysData] = useState<Play[]>([]);
  const [sanctionsData, setSanctionsData] = useState<Sanction[]>([]);
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [logsData, setLogsData] = useState<Log[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  // Variables para tracking de filas seleccionadas en las tablas
  const [playsSelected] = useState([]);
  const [gamesSelected] = useState([]);
  const [usersSelected] = useState([]);
  const [sanctionsSelected] = useState([]);
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

  // Métodos de los modales, cerrar y abrir (cambia el estado)
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

  // Métodos de actualización de datos de las tablas
  /* Plays */
  const updatePlaysData = async () => {
    const response = await readPlays(tokens?.access_token ?? "");
    response?.status === 200 ? setPlaysData(changeIdToName(response?.data, gamesData)) : console.error(response?.data);
  }
  const handleDeletePlay = async (selectedRows: any) => {
    try {
      for (const row of selectedRows.data) {
        const index = row.dataIndex;

        await deletePlayById(playsData[index].id, tokens?.access_token ?? "");
      }
      await updatePlaysData();
      openModalMessage("success", "Partida/s eliminada/s correctamente.");
    }
    catch (error) {
      openModalMessage("error", "Ha ocurrido un error al eliminar la/s partida/s.");
      console.error(error);
    }
  }

  /* Games */
  const updateGamesData = async () => {
    const response = await readGames();
    response?.status === 200 ? setGamesData(response?.data) : console.error(response?.data);
  }
  const handleUpdateGame = async (selectedRows: any, field: string, value: boolean | string) => {
    try {
      for (const row of selectedRows.data) {
        const index = row.dataIndex;

        let requestBody = {};
        if (field === "show") {
          requestBody = { show: value };
        } else if (field === "name") {
          requestBody = { name: value };
        } else if (field === "file_route") {
          requestBody = { file_route: value };
        }

        await patchGameById(gamesData[index].id, tokens?.access_token ?? "", requestBody);
      }
      await updateGamesData();
      openModalMessage("success", "Juego/s actualizado/s correctamente.");
    }
    catch (error) {
      openModalMessage("error", "Ha ocurrido un error al actualizar el/los juego/s.");
      console.error(error);
    }
  }
  const handleDeleteGame = async (selectedRows: any) => {
    try {
      for (const row of selectedRows.data) {
        const index = row.dataIndex;

        await deleteGameById(gamesData[index].id, tokens?.access_token ?? "");
      }
      await updateGamesData();
      openModalMessage("success", "Juego/s eliminado/s correctamente.");
    }
    catch (error) {
      openModalMessage("error", "Ha ocurrido un error al eliminar el/los juego/s.");
      console.error(error);
    }
  }
  // Métodos extra para cambiar el contenido del modal por el
  // componente de creación de juego
  const setAddGameModal = () => {
    setModalAttr({
      ...modalAttr,
      openModal: true,
      title: "Añadir Juego",
      children: (<><CreateGamePanel
        openModalMessage={openModalMessage}
        closeModal={closeModal}
        updateGamesData={updateGamesData}
      /></>),
    });
  }
  const setModifyGameModal = (selectedRows: any) => {
    if (selectedRows.data.length !== 1) {
      openModalMessage("error", "Solo debes seleccionar un juego para modificarlo.");
      return;
    }
    const index = selectedRows.data[0].dataIndex;
    const game = gamesData[index];

    const gameImage = findImageIdWithUrl(images, completeImageUrl(game.image ?? '') ?? '');

    setModalAttr({
      ...modalAttr,
      openModal: true,
      title: "Modificar Juego " + game.name,
      children: (<><ModifyGamePanel
        openModalMessage={openModalMessage}
        closeModal={closeModal}
        updateGamesData={updateGamesData}
        gameId={game.id}
        prevName={game.name}
        prevShow={game.show}
        prevImageId={gameImage}
      /></>),
    });
  }

  /* Sanctions */
  const updateSanctionsData = async () => {
    const response = await readSanctions(tokens?.access_token ?? "");
    response?.status === 200 ? setSanctionsData(response?.data) : console.error(response?.data);
  }
  const handleDeleteSanction = async (selectedRows: any) => {
    try {
      for (const row of selectedRows.data) {
        const index = row.dataIndex;

        await deleteSanctionById(sanctionsData[index].id, tokens?.access_token ?? "");
      }
      await updateSanctionsData();
      openModalMessage("success", "Sanción/es eliminada/s correctamente.");
    }
    catch (error) {
      openModalMessage("error", "Ha ocurrido un error al eliminar la/s sanción/es.");
      console.error(error);
    }
  }

  /* Users */
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
  // Métodos extra para cambiar el contenido del modal por el
  // componente de creación de usuario
  const setAddUserModal = () => {
    setModalAttr({
      ...modalAttr,
      openModal: true,
      title: "Añadir Usuario",
      children: (<><CreateUserPanel
        openModalMessage={openModalMessage}
        closeModal={closeModal}
        updateUsersData={updateUsersData}
      /></>),
    });
  }
  const setModifyUserModal = (selectedRows: any) => {
    if (selectedRows.data.length !== 1) {
      openModalMessage("error", "Solo debes seleccionar un usuario para modificarlo.");
      return;
    }
    const index = selectedRows.data[0].dataIndex;
    const user = usersData[index];

    setModalAttr({
      ...modalAttr,
      openModal: true,
      title: "Modificar Usuario " + user.email,
      children: (<><ModifyUserPanel
        openModalMessage={openModalMessage}
        closeModal={closeModal}
        updateUsersData={updateUsersData}
        userId={user.id}
        prevEmail={user.email}
        prevIsAdmin={user.is_admin}
        prevIsActive={user.is_active}
      /></>),
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gameResponse = await readGames();
        const resGamesData = gameResponse?.data;
        gameResponse?.status === 200 ? setGamesData(resGamesData) : console.error(resGamesData);
        const playResponse = await readPlays(tokens?.access_token ?? "");
        playResponse?.status === 200 ? setPlaysData(changeIdToName(playResponse?.data, resGamesData)) : console.error(playResponse?.data);
        const sanctionResponse = await readSanctions(tokens?.access_token ?? "");
        sanctionResponse?.status === 200 ? setSanctionsData(sanctionResponse?.data) : console.log(sanctionResponse?.data);
        if (admin === true) {
          const studentResponse = await readStudents(tokens?.access_token ?? "");
          studentResponse?.status === 200 ? setStudentsData(studentResponse?.data) : console.error(studentResponse?.data);
          const logResponse = await readLogs(tokens?.access_token ?? "");
          logResponse?.status === 200 ? setLogsData(logResponse?.data) : console.log(logResponse?.data);
          const userResponse = await readUsers(tokens?.access_token ?? "");
          userResponse?.status === 200 ? setUsersData(userResponse?.data) : console.error(userResponse?.data);
          const imageResponse = await readImages(tokens?.access_token ?? "");
          imageResponse?.status === 200 ? setImages(imageResponse?.data) : console.error(imageResponse?.data);
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
        <MUIDataTable
          title={"Historial de Partidas"}
          data={playsData}
          columns={playColumns}
          options={{
            ...tableOptions,
            rowsSelected: playsSelected,
            onRowsDelete: handleDeletePlay,
          }}
          className="cyber__table"
        />
        <MUIDataTable
          title={"Sanciones"}
          data={sanctionsData}
          columns={sanctionColumns}
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
                      <Tooltip title="Editar">
                        <IconButton
                          aria-label="edit"
                          color="info"
                          size="large"
                          onClick={() => {
                            setModifyGameModal(selectedRows);
                          }}
                        >
                          <Edit fontSize='inherit' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Mostrar">
                        <IconButton
                          aria-label="show"
                          color="inherit"
                          size="large"
                          onClick={() => {
                            handleUpdateGame(selectedRows, "show", true);
                          }}
                        >
                          <Visibility fontSize='inherit' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Ocultar">
                        <IconButton
                          aria-label="not-show"
                          color="inherit"
                          size="large"
                          onClick={() => {
                            handleUpdateGame(selectedRows, "show", false);
                          }}
                        >
                          <VisibilityOff fontSize='inherit' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Borrar">
                        <IconButton
                          aria-label="delete"
                          color="error"
                          size="large"
                          onClick={() => {
                            handleDeleteGame(selectedRows);
                          }}
                        >
                          <Delete fontSize='inherit' />
                        </IconButton>
                      </Tooltip>
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
              title={"Historial de los Usuarios"}
              data={logsData}
              columns={logColumns}
              options={{
                ...tableOptions,
                selectableRows: "none",
              }}
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
                      <Tooltip title="Editar">
                        <IconButton
                          aria-label="edit"
                          color="info"
                          size="large"
                          onClick={() => {
                            setModifyUserModal(selectedRows);
                          }}
                        >
                          <Edit fontSize='inherit' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Hacer administrador">
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
                      </Tooltip>
                      <Tooltip title="Hacer becario">
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
                      </Tooltip>
                      <Tooltip title="Activar">
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
                      </Tooltip>
                      <Tooltip title="Desactivar">
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
                      </Tooltip>
                    </Stack>
                  </>,
              }}
              className="cyber__table"
            />
          </>
        ) : (
          <></>
        )}
        <Modal {...modalAttr} />
        <ModalMessage {...modalMessageAttr} />
      </Box>
    </>
  )
}

export default Admin
