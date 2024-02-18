import React, { useState, useEffect, useCallback } from "react";
import { useAppContext } from "../../../store/appContext/useAppContext";
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableIsRowCheck } from "mui-datatables";
import { Box, Button, IconButton, Stack, Tooltip } from "@mui/material";
import { Edit, KeyboardDoubleArrowUp, KeyboardDoubleArrowDown, CheckCircle, Cancel } from "@mui/icons-material";
import { BooleanCell } from "../CustomBodyCells";
import { User } from "../../../services/types";
import { readUsers, patchUserById } from "../../../services";
import { CreateUserPanel, ModifyUserPanel } from "../..";

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

interface UsersDataTableProps {
    modalAttr: { openModal: boolean; handleCloseModal: () => void; title: string; children: JSX.Element; };
    setModalAttr: (value: React.SetStateAction<{ openModal: boolean; handleCloseModal: () => void; title: string; children: JSX.Element; }>) => void
    openModalMessage: (severity: string, message: string) => void;
}

const UsersDataTable = React.forwardRef((props: UsersDataTableProps, ref) => {

    const { tokens } = useAppContext();
    const [usersData, setUsersData] = useState<User[]>([]);
    const [usersSelected] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const response = await readUsers(tokens?.access_token ?? '');
            setUsersData(response.data);
        } catch (error) {
            props.openModalMessage('error', 'Ha ocurrido un error al cargar los usuarios.');
            console.error(error);
        }
    }, [props, tokens]);

    const handleUpdateUser = async (selectedRows: MUIDataTableIsRowCheck, field: string, value: boolean | string) => {
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
            props.openModalMessage("success", "Usuario/s actualizado/s correctamente.");
        }
        catch (error) {
            props.openModalMessage("error", "Ha ocurrido un error al actualizar el/los usuario/s.");
            console.error(error);
        }
    };

    const setAddUserModal = () => {
        props.setModalAttr({
            ...props.modalAttr,
            openModal: true,
            title: "Añadir Usuario",
            children: (<><CreateUserPanel
                openModalMessage={props.openModalMessage}
                closeModal={props.modalAttr.handleCloseModal}
                updateUsersData={fetchData}
            /></>),
        });
    };

    const setModifyUserModal = (selectedRows: MUIDataTableIsRowCheck) => {
        if (selectedRows.data.length !== 1) {
            props.openModalMessage("error", "Solo debes seleccionar un usuario para modificarlo.");
            return;
        }
        const index = selectedRows.data[0].dataIndex;
        const user = usersData[index];

        props.setModalAttr({
            ...props.modalAttr,
            openModal: true,
            title: "Modificar Usuario " + user.email,
            children: (<><ModifyUserPanel
                openModalMessage={props.openModalMessage}
                closeModal={props.modalAttr.handleCloseModal}
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
    );
});

export default UsersDataTable;
