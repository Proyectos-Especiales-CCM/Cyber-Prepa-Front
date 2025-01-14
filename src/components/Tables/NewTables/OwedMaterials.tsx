import { Delete, Edit } from "@mui/icons-material";
import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { deleteOwedMaterialById } from "../../../services/rental/deleteOwedMaterialById";
import { readOwedMaterials } from "../../../services/rental/readOwedMaterials";
import { OwedMaterial } from "../../../services/types";
import { useAppContext } from "../../../store/appContext/useAppContext";
import { Modal, ModalMessage } from "../../Modal";
import { CustomCell, MUITable } from "../MUITable/MUITable";
import { HeadCell } from "../MUITable/TableHead";
import { CustomSelectedToolbarProps } from "../MUITable/Toolbar";
import { CreateOwedMaterialPanel } from "../TableComponents/CreateOwedMaterialPanel";
import { ModifyOwedMaterialPanel } from "../TableComponents/ModifyOwedMaterialPanel";
import dayjs from "dayjs";

const CustomToolbar = ({ setAddMaterialModal }: { setAddMaterialModal: () => void }) => {
  return (
    <Button size="small" variant='contained' color='success' onClick={setAddMaterialModal}>Añadir</Button>
  )
};

interface OwedMaterialSelectedToolbarProps extends CustomSelectedToolbarProps<OwedMaterial> {
  fetchCallback: () => void;
  messageCallback: (severity: string, message: string) => void;
  openModifyModal: (selected: readonly OwedMaterial[]) => void;
}

const CustomSelectedToolbar = ({ selected, fetchCallback, messageCallback, openModifyModal }: OwedMaterialSelectedToolbarProps) => {
  const { tokens } = useAppContext();

  /**
   * Handles the deletion of selected sanctions.
   * @function
   * @async
   * @param {readonly OwedMaterial} selected - Selected rows in the table.
   * @returns {Promise<void>}
   */
  const handleDeleteMaterial = async (selected?: readonly OwedMaterial[]): Promise<void> => {
    try {
      if (!selected) return;
      for (const row of selected) {
        await deleteOwedMaterialById(row.id, tokens?.access_token ?? "");
      }
      fetchCallback();
      messageCallback("success", "Material/es adeudados eliminado/s correctamente.");
    }
    catch (error) {
      messageCallback("error", "Ha ocurrido un error al eliminar el/los material/es adeudados.");
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

const CustomCells: CustomCell<OwedMaterial>[] = [
  {
    id: "delivery_deadline",
    render: (row: OwedMaterial) => row.delivery_deadline ? new Date(row.delivery_deadline).toLocaleString('es-MX') : 'N/A',
  },
  {
    id: "updated_at",
    render: (row: OwedMaterial) => new Date(row.updated_at).toLocaleString('es-MX'),
  },
  {
    id: "created_at",
    render: (row: OwedMaterial) => new Date(row.created_at).toLocaleString('es-MX'),
  },
]

const headCells: HeadCell<OwedMaterial>[] = [
  { id: "id", label: "ID", numeric: true },
  { id: "student", label: "Estudiante", numeric: false },
  { id: "material_name", label: "Material", numeric: false },
  { id: "amount", label: "Cantidad", numeric: true },
  { id: "delivered", label: "Cantidad entregada", numeric: true },
  { id: "delivery_deadline", label: "Fecha límite", numeric: false },
  { id: "updated_at", label: "Última actualización", numeric: false },
  { id: "created_at", label: "Creado el", numeric: false },
];

export const OwedMaterialDataTable = () => {
  const { tokens } = useAppContext();
  const [materialsData, setMaterialsData] = useState<OwedMaterial[]>([]);
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
      title: "Añadir adeudo de Material",
      children: (<><CreateOwedMaterialPanel
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
  const setModifyMaterialModal = (selected: readonly OwedMaterial[]): void => {
    if (selected.length !== 1) {
      openModalMessage("error", "Solo debes seleccionar un usuario para modificarlo.");
      return;
    }
    const owedMaterial = selected[0];

    setModalAttr({
      openModal: true,
      title: "Modificando aduedo de material " + owedMaterial.material_name + " de " + owedMaterial.student,
      children: (<><ModifyOwedMaterialPanel
        openModalMessage={openModalMessage}
        closeModal={handleCloseModal}
        updateUsersData={fetchData}
        owedMaterialId={owedMaterial.id}
        prevMaterialId={owedMaterial.material}
        prevAmount={owedMaterial.amount}
        prevStudentId={owedMaterial.student}
        prevDeliveryDeadline={dayjs(owedMaterial.delivery_deadline)}
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
      const response = await readOwedMaterials(tokens?.access_token ?? '');
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
        title="Materiales adeudados por estudiantes"
        data={materialsData}
        headCells={headCells as HeadCell<unknown>[]}
        customCells={CustomCells as CustomCell<object>[]}
        CustomToolbar={() => <CustomToolbar setAddMaterialModal={setAddMaterialModal} />}
        CustomSelectedToolbar={(props) => (
          <CustomSelectedToolbar
            data={props.data as OwedMaterial[]}
            selected={props.selected as readonly OwedMaterial[]}
            fetchCallback={fetchData}
            messageCallback={openModalMessage}
            openModifyModal={setModifyMaterialModal}
          />)}
      />
      <ModalMessage handleCloseModal={closeModalMessage} {...modalMessageAttr} />
      <Modal handleCloseModal={handleCloseModal} {...modalAttr} />
    </>
  );
}