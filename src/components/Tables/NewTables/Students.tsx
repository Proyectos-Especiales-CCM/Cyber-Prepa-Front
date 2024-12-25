import { useState, useEffect, useCallback } from "react";
import { useAppContext } from "../../../store/appContext/useAppContext";
import { Student } from "../../../services/types";
import { readStudents } from "../../../services";
import { ModalMessage, MUITable } from "../..";
import { HeadCell } from "../MUITable/TableHead";

const headCells: HeadCell<Student>[] = [
  { id: "id", label: "Matrícula", numeric: false },
  { id: "name", label: "Nombre", numeric: false },
  { id: "played_today", label: "Jugó hoy", numeric: false },
  { id: "weekly_plays", label: "Jugadas esta semana", numeric: false },
  { id: "sanctions_number", label: "No. de sanciones", numeric: false },
  { id: "forgoten_id", label: "Olvidó credencial", numeric: false },
];

/**
 * Students MUI DataTable component.
 * 
 * Displays a table with the students and they data fetched from the API.
 * 
 * @example
 * const ref = useRef();
 * 
 * return (
 *   <StudentsDataTable ref={ref} />
 * );
 * 
 * @component
 * @param {React.ForwardedRef} ref Ref to allow quick navigation.
 * 
 * @property studentsData: <Student[]> - List of students fetched from the API.
 * @property modalMessageAttr: <{openModal: boolean, severity: string, message: string}> - Attributes for the modal message.
 * 
 * @author Diego Jacobo Mtz. [Github](https://github.com/Djmr5)
 */
export const StudentsDataTable = () => {

  const { tokens } = useAppContext();
  const [studentsData, setStudentsData] = useState<Student[]>([]);

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
      const response = await readStudents(tokens?.access_token ?? "");
      setStudentsData(response.data);
    } catch (error) {
      openModalMessage("error", "Ha ocurrido un error al cargar los estudiantes");
      console.error(error);
    }
  }, [tokens?.access_token, openModalMessage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  return (
    <>
      <MUITable
        title="Estudiantes"
        data={studentsData}
        headCells={headCells as HeadCell<unknown>[]}
      />
      <ModalMessage handleCloseModal={closeModalMessage} {...modalMessageAttr} />
    </>
  );
};
