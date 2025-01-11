import { Button } from "@mui/material";
import { CustomSelectedToolbarProps } from "../MUITable/Toolbar";
import { Material } from "../../../services/types";
import { MUITable } from "../MUITable/MUITable";
import { useCallback, useEffect, useState } from "react";
import { readMaterials } from "../../../services/rental/readMaterials";
import { useAppContext } from "../../../store/appContext/useAppContext";
import { Modal, ModalMessage } from "../../Modal";
import { HeadCell } from "../MUITable/TableHead";
import CreateMaterialPanel from "../TableComponents/CreateMaterialPanel";

const CustomToolbar = ({ setAddMaterialModal }: { setAddMaterialModal: () => void }) => {
  return (
    <Button size="small" variant='contained' color='success' onClick={setAddMaterialModal}>Añadir Material</Button>
  )
};

interface MaterialSelectedToolbarProps extends CustomSelectedToolbarProps<Material> {
  fetchCallback: () => void;
  messageCallback: (severity: string, message: string) => void;
  openModifyModal: (selected: readonly Material[]) => void;
}

const headCells: HeadCell<Material>[] = [
  { id: "id", label: "Id", numeric: true },
  { id: "name", label: "Nombre", numeric: false },
  { id: "amount", label: "Cantidad", numeric: true },
  { id: "description", label: "Descripción", numeric: false },
];

export const MaterialDataTable = () => {
  const { tokens } = useAppContext();
  const [materialsData, setMaterialsData] = useState<Material[]>([]);
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
 * Sets the modal attributes for creating a new user.
 * @function
 * @returns {void}
 */
  const setAddMaterialModal = (): void => {
    setModalAttr({
      openModal: true,
      title: "Añadir Material",
      children: (<><CreateMaterialPanel
        openModalMessage={openModalMessage}
        closeModal={handleCloseModal}
        updateMaterialsData={fetchData}
      /></>),
    });
  };

  /**
   * Fetches users data from the server.
   * @function
   * @async
   * @returns {Promise<void>}
   */
  const fetchData = useCallback(async () => {
    try {
      const response = await readMaterials(tokens?.access_token ?? '');
      setMaterialsData(response.data);
    } catch (error) {
      openModalMessage('error', 'Ha ocurrido un error al cargar los usuarios.');
      console.error(error);
    }
  }, [openModalMessage, tokens]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <MUITable
        title="Materiales"
        data={materialsData}
        headCells={headCells as HeadCell<unknown>[]}
        CustomToolbar={() => <CustomToolbar setAddMaterialModal={setAddMaterialModal} />}
      />
      <ModalMessage handleCloseModal={closeModalMessage} {...modalMessageAttr} />
      <Modal handleCloseModal={handleCloseModal} {...modalAttr} />
    </>
  )
}
