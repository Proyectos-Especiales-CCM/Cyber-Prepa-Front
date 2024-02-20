import React, { useState, useEffect, useCallback } from 'react';
import { DateCell } from "../CustomBodyCells";
import { Box, Button, IconButton, Stack, Tooltip } from '@mui/material';
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableIsRowCheck } from 'mui-datatables';
import { Delete, Edit } from '@mui/icons-material';
import { useAppContext } from '../../../store/appContext/useAppContext';
import { CreateSanctionPanel, Modal, ModalMessage, ModifySanctionPanel } from '../..';
import { deleteSanctionById, readSanctions } from '../../../services';
import { Sanction } from '../../../services/types';

const sanctionColumns = [
    {
        name: 'id',
        label: 'ID',
        options: {
            filter: false,
        }
    },
    {
        name: 'student',
        label: 'Estudiante',
        options: {
            filterType: 'textField',
        }
    },
    {
        name: 'cause',
        label: 'Causa',
        options: {
            filterType: 'textField',
        }
    },
    {
        name: 'start_time',
        label: 'Fecha y hora de inicio',
        options: {
            customBodyRender: (value: string) => DateCell({ value }),
            filterType: 'textField',
        }
    },
    {
        name: 'end_time',
        label: 'Fecha y hora de fin',
        options: {
            customBodyRender: (value: string) => DateCell({ value }),
            filterType: 'textField',
        }
    },
    {
        name: 'play',
        label: 'Partida en la que se sancionó',
        options: {
            filter: false,
        }
    },
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
const SanctionsDataTable = React.forwardRef((_props, ref) => {

    const { tokens } = useAppContext();
    const [sanctionsData, setSanctionsData] = useState<Sanction[]>([]);
    const [sanctionsSelected] = useState([]);

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
     * Handles the deletion of selected sanctions.
     * @function
     * @async
     * @param {MUIDataTableIsRowCheck} selectedRows - Selected rows in the table.
     * @returns {Promise<void>}
     */
    const handleDeleteSanction = async (selectedRows: MUIDataTableIsRowCheck): Promise<void> => {
        try {
            for (const row of selectedRows.data) {
                const index = row.dataIndex;

                await deleteSanctionById(sanctionsData[index].id, tokens?.access_token ?? "");
            }
            fetchData();
            openModalMessage("success", "Sanción/es eliminada/s correctamente.");
        }
        catch (error) {
            openModalMessage("error", "Ha ocurrido un error al eliminar la/s sanción/es.");
            console.error(error);
        }
    }

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
     * @param {MUIDataTableIsRowCheck} selectedRows - Selected rows information.
     * @returns {void}
     */
    const setModifySanctionModal = (selectedRows: MUIDataTableIsRowCheck): void => {
        if (selectedRows.data.length !== 1) {
            openModalMessage("error", "Solo debes seleccionar un juego para modificarlo.");
            return;
        }
        const index = selectedRows.data[0].dataIndex;
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
            <Box ref={ref} sx={{ margin: '1rem' }}>
                <MUIDataTable
                    title={"Sanciones"}
                    data={sanctionsData}
                    columns={sanctionColumns as MUIDataTableColumnDef[]}
                    options={{
                        selectableRowsOnClick: true,
                        responsive: "simple",
                        rowsSelected: sanctionsSelected,
                        customToolbar: () =>
                            <Button
                                variant='contained'
                                color='success'
                                onClick={setAddSanctionModal}
                            >
                                Crear Sanción
                            </Button>,
                        customToolbarSelect: (selectedRows: object) =>
                            <>
                                <Stack id='game-options' direction="row">
                                    <Tooltip title="Modificar">
                                        <IconButton
                                            aria-label="edit"
                                            color="info"
                                            size="large"
                                            onClick={() => {
                                                setModifySanctionModal(selectedRows as MUIDataTableIsRowCheck);
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
                                                handleDeleteSanction(selectedRows as MUIDataTableIsRowCheck);
                                            }}
                                        >
                                            <Delete fontSize='inherit' />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </>,
                        sortOrder: {
                            name: 'id',
                            direction: 'desc'
                        }
                    }}
                />
            </Box >
            <ModalMessage handleCloseModal={closeModalMessage} {...modalMessageAttr} />
            <Modal handleCloseModal={handleCloseModal} {...modalAttr} />
        </>
    );
});

export default SanctionsDataTable;
