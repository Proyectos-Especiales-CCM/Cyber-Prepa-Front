import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from "../../../store/appContext/useAppContext";
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableIsRowCheck } from "mui-datatables";
import { Box } from '@mui/material';
import { BooleanCell, DateCell } from "../CustomBodyCells";
import { Play } from '../../../services/types'
import { readPlays, deletePlayById } from '../../../services/';
import { ModalMessage } from '../..';

const playColumns = [
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
        name: 'game',
        label: 'Juego',
        options: {
            filterType: 'textField',
        }
    },
    {
        name: 'time',
        label: 'Fecha y hora',
        options: {
            customBodyRender: (value: string) => DateCell({ value }),
            filterType: 'textField',
        }
    },
    {
        name: 'ended',
        label: 'Finalizada',
        options: {
            customBodyRender: (value: boolean) => BooleanCell({ value }),
            filterType: 'checkbox',
        }
    }
];

/**
 * Plays MUI DataTable component.
 * 
 * Allows to display, and delete plays.
 * 
 * @example
 * const ref = useRef();
 * 
 * return (
 *   <PlaysDataTable ref={ref} />
 * );
 * 
 * @component
 * @param {React.ForwardedRef} ref Ref to allow quick navigation.
 * 
 * @property playsData: <Play[]> - List of plays fetched from the API.
 * @property playsSelected: <[]> - Rows selected in the table.
 * @property modalMessageAttr: <Object> - Attributes for the modal.
 * 
 * @author Diego Jacobo Mtz. [Github](https://github.com/Djmr5)
 */
const PlaysDataTable = React.forwardRef((_props, ref) => {

    const { tokens } = useAppContext();
    const [playsData, setPlaysData] = useState<Play[]>([]);
    const [playsSelected] = useState([]);

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
            const response = await readPlays(tokens?.access_token ?? "");
            setPlaysData(response.data);
        } catch (error) {
            openModalMessage("error", "Ha ocurrido un error al cargar las partidas.");
            console.error(error);
        }
    }, [openModalMessage, tokens?.access_token]);

    /**
     * Handles the deletion of selected plays.
     * @function
     * @async
     * @param {MUIDataTableIsRowCheck} selectedRows - Selected rows in the table.
     * @returns {Promise<void>}
     */
    const handleDeletePlay = async (selectedRows: MUIDataTableIsRowCheck): Promise<void> => {
        try {
            for (const row of selectedRows.data) {
                const index = row.dataIndex;

                await deletePlayById(playsData[index].id, tokens?.access_token ?? "");
            }
            fetchData();
            openModalMessage("success", "Partida/s eliminada/s correctamente.");
        }
        catch (error) {
            openModalMessage("error", "Ha ocurrido un error al eliminar la/s partida/s.");
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            <Box ref={ref} sx={{ margin: '1rem' }}>
                <MUIDataTable
                    title={"Historial de Partidas"}
                    data={playsData}
                    columns={playColumns as MUIDataTableColumnDef[]}
                    options={{
                        selectableRowsOnClick: true,
                        responsive: "simple",
                        rowsSelected: playsSelected,
                        onRowsDelete: (rowsDeleted) => {
                            handleDeletePlay(rowsDeleted as MUIDataTableIsRowCheck);
                        },
                        sortOrder: {
                            name: 'id',
                            direction: 'desc'
                        }
                    }}
                />
            </Box>
            <ModalMessage handleCloseModal={closeModalMessage} {...modalMessageAttr} />
        </>
    );
});

export default PlaysDataTable;
