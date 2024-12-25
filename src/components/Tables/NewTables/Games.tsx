import { CheckCircleOutline, Delete, Edit, HighlightOff, Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import { useCallback, useEffect, useState } from 'react';
import { CreateGamePanel, Modal, ModalMessage, ModifyGamePanel, MUITable } from '../..';
import { completeImageUrl, deleteGameById, findImageIdWithUrl, patchGameById, readGames, readImages } from '../../../services/';
import { Game, Image } from '../../../services/types';
import { useAppContext } from "../../../store/appContext/useAppContext";
import { HeadCell } from '../MUITable/TableHead';
import { CustomCell } from '../MUITable/MUITable';
import { CustomSelectedToolbarProps } from '../MUITable/Toolbar';

const CustomToolbar = ({ setCreateGameModal }: { setCreateGameModal: () => void }) => {
  return (
    <Button
      variant='contained'
      color='success'
      onClick={setCreateGameModal}
    >
      Añadir Juego
    </Button>
  )
};

interface GameSelectedToolbarProps extends CustomSelectedToolbarProps {
  fetchCallback: () => void;
  messageCallback: (severity: string, message: string) => void;
  openModifyModal: (selected: readonly (number | string)[]) => void;
}

const CustomSelectedToolbar = ({ selected, fetchCallback, messageCallback, openModifyModal }: GameSelectedToolbarProps) => {
  const { tokens } = useAppContext();

  /**
 * Updates game's data in the server.
 * 
 * Can only update one field with the same value for all selected games at a time.
 * 
 * @function
 * @async
 * @param {MUIDataTableIsRowCheck} selectedRows Selected rows in the table.
 * @param {string} field Field to update.
 * @param {boolean | string} value New value for the field.
 * @returns {Promise<void>}
 */
  const handleUpdateGame = async (selected: readonly (number | string)[], field: string, value: boolean | string): Promise<void> => {
    try {
      for (const id of selected) {

        if (typeof id !== "number") return;
        let requestBody = {};
        if (field === "show") {
          requestBody = { show: value };
        } else {
          return;
        }

        await patchGameById(id, tokens?.access_token ?? "", requestBody);
      }
      fetchCallback();
      messageCallback("success", "Juego/s actualizado/s correctamente.");
    }
    catch (error) {
      messageCallback("error", "Ha ocurrido un error al actualizar el/los juego/s.");
      console.error(error);
    }
  };

  /**
   * Handles the deletion of selected images.
   * @function
   * @async
   * @param {MUIDataTableIsRowCheck} selectedRows - Selected rows in the table.
   * @returns {Promise<void>}
   */
  const handleDeleteGame = async (selected: readonly (number | string)[]) => {
    try {
      for (const id of selected) {
        if (typeof id !== "number") return;
        await deleteGameById(id, tokens?.access_token ?? "");
      }
      fetchCallback();
      messageCallback("success", "Juego/s eliminado/s correctamente.");
    }
    catch (error) {
      messageCallback("error", "Ha ocurrido un error al eliminar el/los juego/s.");
      console.error(error);
    }
  };

  return (
    <Stack id='game-options' direction="row">
      <Tooltip title="Editar">
        <IconButton
          aria-label="edit"
          color="info"
          size="large"
          onClick={() => {
            if (!selected) return;
            openModifyModal(selected);
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
            if (!selected) return;
            handleUpdateGame(selected, "show", true);
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
            if (!selected) return;
            handleUpdateGame(selected, "show", false);
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
            if (!selected) return;
            handleDeleteGame(selected);
          }}
        >
          <Delete fontSize='inherit' />
        </IconButton>
      </Tooltip>
    </Stack>
  )
};

const CustomCells: CustomCell<Game>[] = [
  {
    id: "start_time",
    render: (row: Game) => row.start_time ? new Date(row.start_time).toLocaleString() : "",
  },
  {
    id: "show",
    render: (row: Game) => (row.show ? <CheckCircleOutline color="success" /> : <HighlightOff color="error" />),
  },
  {
    id: "image",
    render: (row: Game) => <img src={completeImageUrl(row.image ?? '')} alt={row.name} width="50" height="auto" />,
  }
]

const headCells: HeadCell<Game>[] = [
  { id: 'id', label: 'Id', numeric: true },
  { id: 'name', label: 'Nombre', numeric: false },
  { id: 'plays', label: 'No. Jugadores', numeric: false },
  { id: 'show', label: 'Mostrar', numeric: false },
  { id: 'start_time', label: 'Fecha y hora de Inicio', numeric: false },
  { id: 'image', label: 'Imagen', numeric: false },
];

/**
 * Games MUI DataTable component.
 * 
 * Allows to display, modify, create and delete games.
 * 
 * Allowed modifications:
 * - Change game's name.
 * - Change if the game is shown or not.
 * - Change game's image.
 * 
 * @example
 * const ref = useRef();
 * 
 * return (
 *   <GamesDataTable ref={ref} />
 * );
 * 
 * @component
 * @param {React.ForwardedRef} ref Ref to allow quick navigation.
 * 
 * @property gamesData: <Game[]> - List of games fetched from the API.
 * @property gamesSelected: <[]> - Rows selected in the table.
 * @property modalMessageAttr: <{openModal: boolean, severity: string, message: string}> - Attributes for the modal message.
 * @property modalAttr: <{openModal: boolean, title: string, children: React.ReactNode}> - Attributes for the modal.
 * 
 * @author Diego Jacobo Mtz. [Github](https://github.com/Djmr5)
 */
export const GamesDataTable = () => {

  const { tokens } = useAppContext();
  const [images, setImages] = useState<Image[]>([]);
  const [gamesData, setGamesData] = useState<Game[]>([]);

  // Variable de atributos del modal de mensajes (feedback al usuario)
  const [modalMessageAttr, setModalMessageAttr] = useState({
    openModal: false,
    severity: "info",
    message: "Sample Message",
  });

  /**
   * Closes the modal with a message and resets its attributes.
   * 
   * @function
   * 
   * @returns {void}
   */
  const closeModalMessage = useCallback((): void => {
    setModalMessageAttr({
      openModal: false,
      severity: "info",
      message: "Sample Message",
    });
  }, []);

  /**
   * Opens a modal with a message.
   * 
   * @function
   * @param {string} severity - Severity of the message.
   * @param {string} message - Content of the message.
   * 
   * @returns {void}
   */
  const openModalMessage = useCallback((severity: string, message: string): void => {
    setModalMessageAttr({
      openModal: true,
      severity: severity,
      message: message,
    });
  }, []);

  // Variables de atributos de los modales
  const [modalAttr, setModalAttr] = useState({
    openModal: false,
    title: "Hello, I'm a Modal",
    children: (<><p>Sample Content</p></>),
  });

  /**
   * Closes the modal and resets its attributes.
   * 
   * @function
   * 
   * @returns {void}
   */
  const handleCloseModal = useCallback((): void => {
    setModalAttr({
      openModal: false,
      title: "Hello, I'm a Modal",
      children: (<><p>Sample Content</p></>),
    });
  }, []);

  /**
   * Fetches images data from the server.
   * @function
   * @async
   * @returns {Promise<void>}
   */
  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const gameResponse = await readGames();
      setGamesData(gameResponse.data);
      const imageResponse = await readImages(tokens?.access_token ?? "");
      setImages(imageResponse?.data);
    } catch (error) {
      openModalMessage("error", "Ha ocurrido un error al cargar los juegos.");
      console.error(error);
    }
  }, [tokens, openModalMessage]);

  // Métodos extra para cambiar el contenido del modal por el
  // componente de creación de juego
  /**
   * Sets the modal attributes for creating a new game.
   * @function
   * @returns {void}
   */
  const setAddGameModal = () => {
    setModalAttr({
      openModal: true,
      title: "Añadir Juego",
      children: (<><CreateGamePanel
        openModalMessage={openModalMessage}
        closeModal={handleCloseModal}
        updateGamesData={fetchData}
      /></>),
    });
  }

  /**
   * Sets the modal attributes for modifying a game.
   * @function
   * @param {MUIDataTableIsRowCheck} selectedRows Selected rows in the table.
   * @returns {void}
   */
  const setModifyGameModal = (selected: readonly (number | string)[]) => {
    if (selected.length !== 1) {
      openModalMessage("error", "Solo debes seleccionar un juego para modificarlo.");
      return;
    }
    const index = selected[0];
    if (typeof index !== "number") return;
    const game = gamesData[index];

    const gameImage = findImageIdWithUrl(images, completeImageUrl(game.image ?? '') ?? '');

    setModalAttr({
      ...modalAttr,
      openModal: true,
      title: "Modificar Juego " + game.name,
      children: (<><ModifyGamePanel
        openModalMessage={openModalMessage}
        closeModal={handleCloseModal}
        updateGamesData={fetchData}
        gameId={game.id}
        prevName={game.name}
        prevShow={game.show}
        prevImageId={gameImage}
      /></>),
    });
  }

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {gamesData && (
        <>
          <MUITable
            title="Catálogo de Juegos"
            data={gamesData}
            headCells={headCells as HeadCell<unknown>[]}
            customCells={CustomCells as CustomCell<object>[]}
            CustomToolbar={() => <CustomToolbar setCreateGameModal={setAddGameModal} />}
            CustomSelectedToolbar={(props) => (
              <CustomSelectedToolbar
                {...props}
                fetchCallback={fetchData}
                messageCallback={openModalMessage}
                openModifyModal={setModifyGameModal}
              />
            )}
          />
          <ModalMessage handleCloseModal={closeModalMessage} {...modalMessageAttr} />
          <Modal handleCloseModal={handleCloseModal} {...modalAttr} />
        </>
      )}
    </>
  )
};
