import React, { useState, useEffect, useCallback } from "react";
import { useAppContext } from "../../../store/appContext/useAppContext";
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableIsRowCheck } from "mui-datatables";
import { Box, Button, IconButton, Stack, Tooltip } from "@mui/material";
import { Edit, KeyboardDoubleArrowUp, KeyboardDoubleArrowDown, CheckCircle, Cancel } from "@mui/icons-material";
import { BooleanCell } from "../CustomBodyCells";
import { User } from "../../../services/types";
import { readUsers, patchUserById } from "../../../services";
import { CreateUserPanel, Modal, ModalMessage, ModifyUserPanel } from "../..";

const userColumns = [
    {
        name: 'id',
        label: 'ID',
        options: {
            filter: false,
        }
    },
    {
        name: 'email',
        label: 'Correo electrónico',
        options: {
            filterType: 'textField',
        }
    },
    {
        name: 'is_admin',
        label: 'Es administrador',
        options: {
            customBodyRender: (value: boolean) => BooleanCell({ value }),
            filterType: 'checkbox',
        }
    },
    {
        name: 'is_active',
        label: 'Activo',
        options: {
            customBodyRender: (value: boolean) => BooleanCell({ value }),
            filterType: 'checkbox',
        }
    }
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
const UsersDataTable = React.forwardRef((_props, ref) => {

    const { tokens } = useAppContext();
    const [usersData, setUsersData] = useState<User[]>([]);
    const [usersSelected] = useState([]);

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
     * Updates user's data in the server.
     * 
     * Can only update one field with the same value for all selected users at a time.
     * 
     * @function
     * @async
     * @param {MUIDataTableIsRowCheck} selectedRows Selected rows in the table.
     * @param {string} field Field to update.
     * @param {boolean | string} value New value for the field.
     * @returns {Promise<void>}
     */
    const handleUpdateUser = async (selectedRows: MUIDataTableIsRowCheck, field: string, value: boolean | string): Promise<void> => {
        try {
            for (const row of selectedRows.data) {
                const index = row.dataIndex;

                let requestBody = {};
                if (field === "is_active") {
                    requestBody = { is_active: value };
                }
                else if (field === "is_admin") {
                    requestBody = { is_admin: value };
                }

                await patchUserById(usersData[index].id, tokens?.access_token ?? "", requestBody);
            }
            fetchData();
            openModalMessage("success", "Usuario/s actualizado/s correctamente.");
        }
        catch (error) {
            openModalMessage("error", "Ha ocurrido un error al actualizar el/los usuario/s.");
            console.error(error);
        }
    };

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
    const setModifyUserModal = (selectedRows: MUIDataTableIsRowCheck): void => {
        if (selectedRows.data.length !== 1) {
            openModalMessage("error", "Solo debes seleccionar un usuario para modificarlo.");
            return;
        }
        const index = selectedRows.data[0].dataIndex;
        const user = usersData[index];

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
            <Box ref={ref} sx={{ margin: '1rem' }}>
                <MUIDataTable
                    title={"Usuarios"}
                    data={usersData}
                    columns={userColumns as MUIDataTableColumnDef[]}
                    options={{
                        selectableRowsOnClick: true,
                        responsive: 'simple',
                        rowsSelected: usersSelected,
                        customToolbar: () => <Button variant='contained' color='success' onClick={setAddUserModal}>Añadir Usuario</Button>,
                        customToolbarSelect: (selectedRows: object) =>
                            <>
                                <Stack id='user-options' direction="row">
                                    <Tooltip title="Editar">
                                        <IconButton
                                            aria-label="edit"
                                            color="info"
                                            size="large"
                                            onClick={() => {
                                                setModifyUserModal(selectedRows as MUIDataTableIsRowCheck);
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
                                                handleUpdateUser(selectedRows as MUIDataTableIsRowCheck, "is_admin", true);
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
                                                handleUpdateUser(selectedRows as MUIDataTableIsRowCheck, "is_admin", false);
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
                                                handleUpdateUser(selectedRows as MUIDataTableIsRowCheck, "is_active", true);
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
                                                handleUpdateUser(selectedRows as MUIDataTableIsRowCheck, "is_active", false);
                                            }}
                                        >
                                            <Cancel fontSize='inherit' />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </>,
                    }}
                />
            </Box>
            <ModalMessage handleCloseModal={closeModalMessage} {...modalMessageAttr} />
            <Modal handleCloseModal={handleCloseModal} {...modalAttr} />
        </>
    );
});

export default UsersDataTable;
