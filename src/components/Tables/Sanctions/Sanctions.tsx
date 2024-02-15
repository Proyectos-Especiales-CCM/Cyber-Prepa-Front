import React, { useState, useEffect, useCallback } from 'react';
import { DateCell } from "../CustomBodyCells";
import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableIsRowCheck } from 'mui-datatables';
import { Delete } from '@mui/icons-material';
import { useAppContext } from '../../../store/appContext/appContext';
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

interface SanctionsDataTableProps {
    openModalMessage: (severity: string, message: string) => void;
}

const SanctionsDataTable = React.forwardRef((props: SanctionsDataTableProps, ref) => {

    const { tokens } = useAppContext();
    const [sanctionsData, setSanctionsData] = useState<Sanction[]>([]);
    const [sanctionsSelected] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const response = await readSanctions(tokens?.access_token ?? "");
            setSanctionsData(response?.data);
        } catch (error) {
            props.openModalMessage("error", "Ha ocurrido un error al cargar las sanciones.");
            console.error(error);
        }
    }, [tokens, props]);

    const handleDeleteSanction = async (selectedRows: MUIDataTableIsRowCheck) => {
        try {
            for (const row of selectedRows.data) {
                const index = row.dataIndex;

                await deleteSanctionById(sanctionsData[index].id, tokens?.access_token ?? "");
            }
            fetchData();
            props.openModalMessage("success", "Sanción/es eliminada/s correctamente.");
        }
        catch (error) {
            props.openModalMessage("error", "Ha ocurrido un error al eliminar la/s sanción/es.");
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <Box ref={ref} sx={{ margin: '1rem' }}>
            <MUIDataTable
                title={"Sanciones"}
                data={sanctionsData}
                columns={sanctionColumns as MUIDataTableColumnDef[]}
                options={{
                    selectableRowsOnClick: true,
                    responsive: "simple",
                    rowsSelected: sanctionsSelected,
                    customToolbarSelect: (selectedRows: object) =>
                        <>
                            <Stack id='game-options' direction="row">
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
                }}
            />
        </Box >
    );
});

export default SanctionsDataTable;
