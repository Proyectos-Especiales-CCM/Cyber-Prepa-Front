import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import { CustomSelectedToolbarProps } from "../MUITable/Toolbar";
import { Material } from "../../../services/types";
import { MUITable } from "../MUITable/MUITable";
import { useCallback, useEffect, useState } from "react";
import { readMaterials } from "../../../services/rental/readMaterials";
import { useAppContext } from "../../../store/appContext/useAppContext";
import { Modal, ModalMessage } from "../../Modal";
import { HeadCell } from "../MUITable/TableHead";
import CreateMaterialPanel from "../TableComponents/CreateMaterialPanel";
import { Delete, Edit } from "@mui/icons-material";
import { deleteMaterialById } from "../../../services/rental/deleteMaterialById";
import { ModifyMaterialPanel } from "../TableComponents/ModifyMaterialPanel";

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

const CustomSelectedToolbar = ({ selected, fetchCallback, messageCallback, openModifyModal }: MaterialSelectedToolbarProps) => {
  const { tokens } = useAppContext();

  /**
   * Handles the deletion of selected sanctions.
   * @function
   * @async
   * @param {MUIDataTableIsRowCheck} selectedRows - Selected rows in the table.
   * @returns {Promise<void>}
   */
  const handleDeleteMaterial = async (selected?: readonly Material[]): Promise<void> => {
    try {
      if (!selected) return;
      for (const row of selected) {
        await deleteMaterialById(row.id, tokens?.access_token ?? "");
      }
      fetchCallback();
      messageCallback("success", "Material/es eliminado/s correctamente.");
    }
    catch (error) {
      messageCallback("error", "Ha ocurrido un error al eliminar el/los material/es.");
      console.error(error);
    }
  };

  return (
    <Stack id='material-options' direction="row">
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
      <Tooltip title="Borrar">
        <IconButton
          aria-label="delete"
          color="error"
          size="large"
          onClick={() => {
            handleDeleteMaterial(selected);
          }}
        >
          <Delete fontSize='inherit' />
        </IconButton>
      </Tooltip>
    </Stack>
  )
};

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
 * Sets the modal attributes for creating a new material.
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
   * Sets the modal attributes for modifying a user.
   * @function
   * @param {MUIDataTableIsRowCheck} selectedRows Selected rows in the table.
   * @returns {void}
   */
    const setModifyMaterialModal = (selected: readonly Material[]): void => {
      if (selected.length !== 1) {
        openModalMessage("error", "Solo debes seleccionar un usuario para modificarlo.");
        return;
      }
      const material = selected[0];
  
      setModalAttr({
        openModal: true,
        title: "Modificando material " + material.name,
        children: (<><ModifyMaterialPanel
          openModalMessage={openModalMessage}
          closeModal={handleCloseModal}
          updateUsersData={fetchData}
          materialId={material.id}
          prevName={material.name}
          prevAmount={material.amount}
          prevDescrip={material.description}
        /></>),
      });
    };

  /**
   * Fetches materials data from the server.
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
        CustomSelectedToolbar={(props) => (
                  <CustomSelectedToolbar
                    data={props.data as Material[]}
                    selected={props.selected as readonly Material[]}
                    fetchCallback={fetchData}
                    messageCallback={openModalMessage}
                    openModifyModal={setModifyMaterialModal}
                  />)}
      />
      <ModalMessage handleCloseModal={closeModalMessage} {...modalMessageAttr} />
      <Modal handleCloseModal={handleCloseModal} {...modalAttr} />
    </>
  )
}
