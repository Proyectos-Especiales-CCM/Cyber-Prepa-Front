import { Cancel, CheckCircle, CheckCircleOutline, Edit, HighlightOff, KeyboardDoubleArrowDown, KeyboardDoubleArrowUp } from "@mui/icons-material";
import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { CreateUserPanel, Modal, ModalMessage, ModifyUserPanel, MUITable } from "../..";
import { patchUserById, readUsers } from "../../../services";
import { User } from "../../../services/types";
import { useAppContext } from "../../../store/appContext/useAppContext";
import { HeadCell } from "../MUITable/TableHead";
import { CustomSelectedToolbarProps } from "../MUITable/Toolbar";
import { CustomCell } from "../MUITable/MUITable";

const CustomToolbar = ({ setAddUserModal }: { setAddUserModal: () => void }) => {
  return (
    <Button variant='contained' color='success' onClick={setAddUserModal}>Añadir Usuario</Button>
  )
};

interface UserSelectedToolbarProps extends CustomSelectedToolbarProps<User> {
  fetchCallback: () => void;
  messageCallback: (severity: string, message: string) => void;
  openModifyModal: (selected: readonly User[]) => void;
}

const CustomSelectedToolbar = ({ selected, fetchCallback, messageCallback, openModifyModal }: UserSelectedToolbarProps) => {
  const { tokens } = useAppContext();

  /**
 * Updates user's data in the server.
 * 
 * Can only update one field with the same value for all selected users at a time.
 * 
 * @function
 * @async
 * @param {readonly User[]} selected
 * @param {string} field Field to update.
 * @param {boolean | string} value New value for the field.
 * @returns {Promise<void>}
 */
  const handleUpdateUser = async (selected: readonly User[], field: string, value: boolean | string): Promise<void> => {
    try {
      for (const user of selected) {
        let requestBody = {};
        if (field === "is_active") {
          requestBody = { is_active: value };
        }
        else if (field === "is_admin") {
          requestBody = { is_admin: value };
        }

        await patchUserById(user.id, tokens?.access_token ?? "", requestBody);
      }
      fetchCallback();
      messageCallback("success", "Usuario/s actualizado/s correctamente.");
    }
    catch (error) {
      messageCallback("error", "Ha ocurrido un error al actualizar el/los usuario/s.");
      console.error(error);
    }
  };

  return (
    <Stack id='user-options' direction="row">
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
      <Tooltip title="Hacer administrador">
        <IconButton
          aria-label="make-admin"
          color="warning"
          size="large"
          onClick={() => {
            if (!selected) return;
            handleUpdateUser(selected, "is_admin", true);
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
            if (!selected) return;
            handleUpdateUser(selected, "is_admin", false);
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
            if (!selected) return;
            handleUpdateUser(selected, "is_active", true);
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
            if (!selected) return;
            handleUpdateUser(selected, "is_active", false);
          }}
        >
          <Cancel fontSize='inherit' />
        </IconButton>
      </Tooltip>
    </Stack>
  )
};

const CustomCells: CustomCell<User>[] = [
  {
    id: "is_admin",
    render: (row: User) => (row.is_admin ? <CheckCircleOutline color="success" /> : <HighlightOff color="error" />),
  },
  {
    id: "is_active",
    render: (row: User) => (row.is_active ? <CheckCircleOutline color="success" /> : <HighlightOff color="error" />),
  },
];

const headCells: HeadCell<User>[] = [
  { id: "id", label: "Id", numeric: false },
  { id: "email", label: "Correo electrónico", numeric: false },
  { id: "is_admin", label: "Es administrador", numeric: false },
  { id: "is_active", label: "Activo", numeric: false },
];

/**
 * Users MUI DataTable component.
 * 
 * Allows to display, modify and create users.
 * 
 * Allowed modifications:
 * - Change user's email.
 * - Change user's password.
 * - Change user's role to admin or non-admin.
 * - Change user's status to active or inactive.
 * 
 * @example
 * const ref = useRef();
 * 
 * return (
 *   <UsersDataTable ref={ref} />
 * );
 * 
 * @component
 * @param {React.ForwardedRef} ref Ref to allow quick navigation.
 * 
 * @property usersData: <User[]> - List of users fetched from the API.
 * @property usersSelected: <[]> - Rows selected in the table.
 * @property modalMessageAttr: <{openModal: boolean, severity: string, message: string}> - Attributes for the modal message.
 * @property modalAttr: <{openModal: boolean, title: string, children: React.ReactNode}> - Attributes for the modal.
 * 
 * @author Diego Jacobo Mtz. [Github](https://github.com/Djmr5)
 */
export const UsersDataTable = () => {

  const { tokens } = useAppContext();
  const [usersData, setUsersData] = useState<User[]>([]);

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
   * Fetches users data from the server.
   * @function
   * @async
   * @returns {Promise<void>}
   */
  const fetchData = useCallback(async () => {
    try {
      const response = await readUsers(tokens?.access_token ?? '');
      setUsersData(response.data);
    } catch (error) {
      openModalMessage('error', 'Ha ocurrido un error al cargar los usuarios.');
      console.error(error);
    }
  }, [openModalMessage, tokens]);

  /**
   * Sets the modal attributes for creating a new user.
   * @function
   * @returns {void}
   */
  const setAddUserModal = (): void => {
    setModalAttr({
      openModal: true,
      title: "Añadir Usuario",
      children: (<><CreateUserPanel
        openModalMessage={openModalMessage}
        closeModal={handleCloseModal}
        updateUsersData={fetchData}
      /></>),
    });
  };

  /**
   * Sets the modal attributes for modifying a user.
   * @function
   * @param {MUIDataTableIsRowCheck} selectedRows Selected rows in the table.
   * @returns {void}
   */
  const setModifyUserModal = (selected: readonly User[]): void => {
    if (selected.length !== 1) {
      openModalMessage("error", "Solo debes seleccionar un usuario para modificarlo.");
      return;
    }
    const user = selected[0];

    setModalAttr({
      openModal: true,
      title: "Modificar Usuario " + user.email,
      children: (<><ModifyUserPanel
        openModalMessage={openModalMessage}
        closeModal={handleCloseModal}
        updateUsersData={fetchData}
        userId={user.id}
        prevEmail={user.email}
        prevIsAdmin={user.is_admin}
        prevIsActive={user.is_active}
      /></>),
    });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  return (
    <>
      <MUITable
        title="Usuarios"
        data={usersData}
        headCells={headCells as HeadCell<unknown>[]}
        customCells={CustomCells as CustomCell<object>[]}
        CustomToolbar={() => <CustomToolbar setAddUserModal={setAddUserModal} />}
        CustomSelectedToolbar={(props) => (
          <CustomSelectedToolbar
            data={props.data as User[]}
            selected={props.selected as readonly User[]}
            fetchCallback={fetchData}
            messageCallback={openModalMessage}
            openModifyModal={setModifyUserModal}
          />)}
      />
      <ModalMessage handleCloseModal={closeModalMessage} {...modalMessageAttr} />
      <Modal handleCloseModal={handleCloseModal} {...modalAttr} />
    </>
  );
};
