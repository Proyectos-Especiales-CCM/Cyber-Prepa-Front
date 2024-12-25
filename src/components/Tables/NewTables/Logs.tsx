import { useCallback, useEffect, useState } from "react";
import { ModalMessage, MUITable } from "../..";
import { readLogs } from "../../../services";
import { Log } from "../../../services/types";
import { useAppContext } from "../../../store/appContext/useAppContext";
import { HeadCell } from "../MUITable/TableHead";

const headCells: HeadCell<Log>[] = [
  { id: "line", label: "Línea", numeric: false },
  { id: "timestamp", label: "Fecha y hora", numeric: false },
  { id: "user", label: "Usuario", numeric: false },
  { id: "action", label: "Acción realizada", numeric: false },
];

/**
 * Logs MUI DataTable component.
 *
 * Displays a table with the logs fetched from the API.
 *
 * @example
 * const ref = useRef();
 *
 * return (
 *   <LogsDataTable ref={ref} />
 * );
 *
 * @component
 * @param {React.ForwardedRef} ref Ref to allow quick navigation.
 *
 * @property logsData: <Log[]> - List of logs fetched from the API.
 * @property modalMessageAttr: <{openModal: boolean, severity: string, message: string}> - Attributes for the modal message.
 *
 * @author Diego Jacobo Mtz. [Github](https://github.com/Djmr5)
 */
export const LogsDataTable = () => {
  const { tokens } = useAppContext();
  const [logsData, setLogsData] = useState<Log[]>([]);

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
  const openModalMessage = useCallback(
    (severity: string, message: string): void => {
      setModalMessageAttr({
        openModal: true,
        severity: severity,
        message: message,
      });
    },
    [],
  );

  /**
   * Fetches users data from the server.
   * @function
   * @async
   * @returns {Promise<void>}
   */
  const fetchData = useCallback(async () => {
    try {
      const response = await readLogs(tokens?.access_token ?? "", 100);
      setLogsData(response.data);
    } catch (error) {
      openModalMessage(
        "error",
        "No se pudieron obtener los registros de actividad",
      );
      console.error(error);
    }
  }, [tokens, openModalMessage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <MUITable
        title="Historial de los Usuarios"
        data={logsData}
        headCells={headCells as HeadCell<unknown>[]}
        defaultOrderBy="line"
      />
      <ModalMessage
        handleCloseModal={closeModalMessage}
        {...modalMessageAttr}
      />
    </>
  );
};
