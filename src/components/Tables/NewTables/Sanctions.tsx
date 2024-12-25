import { useState, useEffect, useCallback } from 'react';
import { Button, IconButton, Stack, Tooltip } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useAppContext } from '../../../store/appContext/useAppContext';
import { CreateSanctionPanel, Modal, ModalMessage, ModifySanctionPanel, MUITable } from '../..';
import { deleteSanctionById, readSanctions } from '../../../services';
import { Sanction } from '../../../services/types';
import { HeadCell } from '../MUITable/TableHead';
import { CustomSelectedToolbarProps } from '../MUITable/Toolbar';
import { CustomCell } from '../MUITable/MUITable';

const CustomToolbar = ({ setAddSanctionModal }: { setAddSanctionModal: () => void }) => {
  return (
    <Button
      variant='contained'
      color='success'
      onClick={setAddSanctionModal}
    >
      Crear Sanción
    </Button>
  )
};

interface SanctionsToolbarProps extends CustomSelectedToolbarProps {
  fetchCallback: () => void;
  messageCallback: (severity: string, message: string) => void;
  openModifyModal: (selected: readonly (number | string)[]) => void;
}

const CustomSelectedToolbar = ({ selected, fetchCallback, messageCallback, openModifyModal }: SanctionsToolbarProps) => {
  const { tokens } = useAppContext();

  /**
   * Handles the deletion of selected sanctions.
   * @function
   * @async
   * @param {MUIDataTableIsRowCheck} selectedRows - Selected rows in the table.
   * @returns {Promise<void>}
   */
  const handleDeleteSanction = async (selected?: readonly (number | string)[]): Promise<void> => {
    try {
      if (!selected) return;
      for (const id of selected) {
        await deleteSanctionById(Number(id), tokens?.access_token ?? "");
      }
      fetchCallback();
      messageCallback("success", "Sanción/es eliminada/s correctamente.");
    }
    catch (error) {
      messageCallback("error", "Ha ocurrido un error al eliminar la/s sanción/es.");
      console.error(error);
    }
  };

  return (
    <Stack id='game-options' direction="row">
      <Tooltip title="Modificar">
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
      <Tooltip title="Borrar">
        <IconButton
          aria-label="delete"
          color="error"
          size="large"
          onClick={() => {
            handleDeleteSanction(selected);
          }}
        >
          <Delete fontSize='inherit' />
        </IconButton>
      </Tooltip>
    </Stack>
  )
};

const CustomCells: CustomCell<Sanction>[] = [
  {
    id: "start_time",
    render: (row: Sanction) => row.start_time ? new Date(row.start_time).toLocaleString() : "",
  },
  {
    id: "end_time",
    render: (row: Sanction) => row.end_time ? new Date(row.end_time).toLocaleString() : "",
  },
  {
    id: "play",
    render: (row: Sanction) => row.play ? row.play.toString() : "",
  },
]

const headCells: HeadCell<Sanction>[] = [
  { id: 'id', label: 'Id', numeric: true },
  { id: 'student', label: 'Estudiante', numeric: false },
  { id: 'cause', label: 'Causa', numeric: false },
  { id: 'start_time', label: 'Fecha y hora de Inicio', numeric: false },
  { id: 'end_time', label: 'Fecha y hora de Fin', numeric: false },
  { id: 'play', label: 'Partida en la que se sancionó', numeric: true },
];

/**
 * Sanctions MUI DataTable component.
 * 
 * Allows to display, modify, delete and create sanctions.
 * 
 * Allowed modifications:
 * - Change the student who received the sanction.
 * - Change the cause of the sanction.
 * - Change the end date of the sanction.
 * 
 * @component
 * @param {React.ForwardedRef} ref Ref to allow quick navigation.
 * 
 * @example
 * const ref = useRef();
 * 
 * return (
 *   <SanctionsDataTable ref={ref} />
 * );
 * 
 * @property sanctionsData: <Sanction[]> - List of sanctions fetched from the API.
 * @property sanctionsSelected: <[]> - Rows selected in the table.
 * @property modalMessageAttr: <{openModal: boolean, severity: string, message: string}> - Attributes for the modal message.
 * @property modalAttr: <{openModal: boolean, title: string, children: React.ReactNode}> - Attributes for the modal.
 * 
 * @author Diego Jacobo Mtz. [Github](https://github.com/Djmr5)
 */
export const SanctionsDataTable = () => {

  const { tokens } = useAppContext();
  const [sanctionsData, setSanctionsData] = useState<Sanction[]>([]);

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
   * Fetches sanctions data from the server.
   * @function
   * @async
   * @returns {Promise<void>}
   */
  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const response = await readSanctions(tokens?.access_token ?? "");
      setSanctionsData(response?.data);
    } catch (error) {
      openModalMessage("error", "Ha ocurrido un error al cargar las sanciones.");
      console.error(error);
    }
  }, [tokens?.access_token, openModalMessage]);

  /**
   * Sets the modal attributes for creating a new sanction.
   * @function
   * @returns {void}
   */
  const setAddSanctionModal = (): void => {
    setModalAttr({
      openModal: true,
      title: "Crear Sanción",
      children: (<><CreateSanctionPanel
        openModalMessage={openModalMessage}
        closeModal={handleCloseModal}
        updateSanctionsData={fetchData}
      /></>),
    });
  };

  /**
   * Sets the modal attributes for modifying an existing sanction.
   * @function
   * @param {readonly (number | string)[]} selectedRows - Selected rows in the table.
   * @returns {void}
   */
  const setModifySanctionModal = (selected: readonly (number | string)[]): void => {
    if (selected.length !== 1) {
      openModalMessage("error", "Solo debes seleccionar un juego para modificarlo.");
      return;
    }
    const index = selected[0];
    if (typeof index !== "number") return;
    const sanction = sanctionsData[index];

    setModalAttr({
      openModal: true,
      title: "Modificar Sanción de: " + sanction.student,
      children: (<><ModifySanctionPanel
        sanctionId={sanction.id}
        prevStudent={sanction.student}
        prevCause={sanction.cause}
        prevDate={sanction.end_time}
        openModalMessage={openModalMessage}
        closeModal={handleCloseModal}
        updateSanctionsData={fetchData}
      /></>),
    });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <MUITable
        title="Sanciones"
        data={sanctionsData}
        headCells={headCells as HeadCell<unknown>[]}
        customCells={CustomCells as CustomCell<object>[]}
        CustomToolbar={() => <CustomToolbar setAddSanctionModal={setAddSanctionModal} />}
        CustomSelectedToolbar={(props) => (
          <CustomSelectedToolbar
            {...props}
            fetchCallback={fetchData}
            messageCallback={openModalMessage}
            openModifyModal={setModifySanctionModal}
          />
        )}
      />
      <ModalMessage handleCloseModal={closeModalMessage} {...modalMessageAttr} />
      <Modal handleCloseModal={handleCloseModal} {...modalAttr} />
    </>
  );
};
