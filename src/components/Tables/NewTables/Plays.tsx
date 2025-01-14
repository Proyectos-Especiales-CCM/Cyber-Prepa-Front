import { CheckCircleOutline, Delete, HighlightOff } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { deletePlayById, readPlays } from "../../../services";
import { Play } from "../../../services/types";
import { useAppContext } from "../../../store/appContext/useAppContext";
import { useGamesContext } from "../../../store/gamesContext/useGamesContext";
import { ModalMessage } from "../../Modal";
import { CustomCell, MUITable } from "../MUITable/MUITable";
import { HeadCell } from "../MUITable/TableHead";
import { CustomSelectedToolbarProps } from "../MUITable/Toolbar";

interface PlaysToolbarProps extends CustomSelectedToolbarProps<Play> {
  fetchCallback: () => void;
  messageCallback: (severity: string, message: string) => void;
}

const CustomSelectedToolbar = ({ selected, fetchCallback, messageCallback }: PlaysToolbarProps) => {
  const { tokens } = useAppContext();

  /**
   * Handles the deletion of selected plays.
   * @function
   * @async
   * @param {number[]} selected - Selected rows in the table.
   * @returns {Promise<void>}
   */
  const handleDeletePlay = async (selected?: readonly Play[]): Promise<void> => {
    try {
      if (!selected) return;
      for (const row of selected) {
        await deletePlayById(row.id, tokens?.access_token ?? "");
      }
      fetchCallback();
      messageCallback("success", "Partida/s eliminada/s correctamente.");
    }
    catch (error) {
      messageCallback("error", "Ha ocurrido un error al eliminar la/s partida/s.");
      console.error(error);
    }
  };

  return (
    <Tooltip title="Eliminar">
      <IconButton onClick={() => handleDeletePlay(selected)}>
        <Delete />
      </IconButton>
    </Tooltip>
  )
}

const CustomCells: CustomCell<Play>[] = [
  {
    id: "time",
    render: (row: Play) => new Date(row.time).toLocaleString('es-MX'),
  },
  {
    id: "ended",
    render: (row: Play) => (row.ended ? <CheckCircleOutline color="success" /> : <HighlightOff color="error" />),
  },
]

const headCells: HeadCell<Play>[] = [
  { id: "id", label: "ID", numeric: true },
  { id: "game", label: "Juego", numeric: true },
  { id: "student", label: "Estudiante", numeric: false },
  { id: "time", label: "Fecha y hora", numeric: false },
  { id: "ended", label: "Finalizada", numeric: false },
];

/**
 * Plays MUI DataTable component.
 * 
 * Allows to display, and delete plays.
 * 
 * @example
 * <PlaysDataTable />
 * 
 * @component
 * 
 * @property playsData: <Play[]> - List of plays fetched from the API.
 * @property modalMessageAttr: <Object> - Attributes for the modal.
 * 
 * @author Diego Jacobo Mtz. [Github](https://github.com/Djmr5)
 */
export const PlaysDataTable = () => {

  const { tokens } = useAppContext();
  const { games } = useGamesContext();
  const [playsData, setPlaysData] = useState<Play[]>([]);

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

  /**
   * Fetches users data from the server.
   * @function
   * @async
   * @returns {Promise<void>}
   */
  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const response = await readPlays(tokens?.access_token ?? "");
      for (const play of response.data) {
        const game = games.find((game) => game.id === play.game);
        if (game) play.game = game.name;
      }
      setPlaysData(response.data);
    } catch (error) {
      openModalMessage("error", "Ha ocurrido un error al cargar las partidas.");
      console.error(error);
    }
  }, [openModalMessage, tokens?.access_token, games]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <MUITable
        title="Historial de Partidas"
        data={playsData}
        headCells={headCells as HeadCell<unknown>[]}
        customCells={CustomCells as CustomCell<object>[]}
        defaultOrder="desc"
        CustomSelectedToolbar={(props) => (
          <CustomSelectedToolbar
            selected={props.selected as readonly Play[]}
            data={props.data as Play[]}
            fetchCallback={fetchData}
            messageCallback={openModalMessage}
          />
        )}
      />
      <ModalMessage handleCloseModal={closeModalMessage} {...modalMessageAttr} />
    </>
  );
};
