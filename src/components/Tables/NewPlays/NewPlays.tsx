import React, { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../../store/appContext/useAppContext";
import { Play } from "../../../services/types";
import { MUITable } from "../MUITable/MUITable";
import { deletePlayById, readPlays } from "../../../services";
import { ModalMessage } from "../../Modal";
import { CustomSelectedToolbarProps } from "../MUITable/Toolbar";

interface PlaysToolbarProps extends CustomSelectedToolbarProps {
  fetchCallback: () => void;
  messageCallback: (severity: string, message: string) => void;
}

const CustomToolbar = ({ selected, fetchCallback, messageCallback }: PlaysToolbarProps) => {
  const { tokens } = useAppContext();
  
  /**
   * Handles the deletion of selected plays.
   * @function
   * @async
   * @param {MUIDataTableIsRowCheck} selected - Selected rows in the table.
   * @returns {Promise<void>}
   */
  const handleDeletePlay = async (selected?: readonly number[]): Promise<void> => {
    try {
      if (!selected) return;
      for (const id of selected) {
        await deletePlayById(id, tokens?.access_token ?? "");
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
    <>
      <button onClick={() => handleDeletePlay(selected)}>Eliminar</button>
    </>
  )
}

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
export const PlaysDataTable = React.forwardRef<HTMLDivElement, object>((_props, ref) => {

  const { tokens } = useAppContext();
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
      setPlaysData(response.data);
    } catch (error) {
      openModalMessage("error", "Ha ocurrido un error al cargar las partidas.");
      console.error(error);
    }
  }, [openModalMessage, tokens?.access_token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div ref={ref}>
      <MUITable
        title="Historial de Partidas"
        data={playsData}
        CustomSelectedToolbar={(props) => (
          <CustomToolbar
            {...props}
            fetchCallback={fetchData}
            messageCallback={openModalMessage}
          />
        )}
      />
      <ModalMessage handleCloseModal={closeModalMessage} {...modalMessageAttr} />
    </div>
  );
});
