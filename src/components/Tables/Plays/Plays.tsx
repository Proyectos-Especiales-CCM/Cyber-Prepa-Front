import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from "../../../store/appContext/appContext";
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableIsRowCheck } from "mui-datatables";
import { Box } from '@mui/material';
import { BooleanCell, DateCell } from "../CustomBodyCells";
import { Play } from '../../../services/types'
import { readPlays, deletePlayById } from '../../../services/';

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

interface PlaysDataTableProps {
    openModalMessage: (severity: string, message: string) => void;
}

const PlaysDataTable = React.forwardRef((props: PlaysDataTableProps, ref) => {

    const { tokens } = useAppContext();
    const [playsData, setPlaysData] = useState<Play[]>([]);
    const [playsSelected] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const response = await readPlays(tokens?.access_token ?? "");
            setPlaysData(response.data);
        } catch (error) {
            props.openModalMessage("error", "Ha ocurrido un error al cargar las partidas.");
            console.error(error);
        }
    }, [props, tokens?.access_token]);

    const handleDeletePlay = async (selectedRows: MUIDataTableIsRowCheck) => {
        try {
            for (const row of selectedRows.data) {
                const index = row.dataIndex;

                await deletePlayById(playsData[index].id, tokens?.access_token ?? "");
            }
            fetchData();
            props.openModalMessage("success", "Partida/s eliminada/s correctamente.");
        }
        catch (error) {
            props.openModalMessage("error", "Ha ocurrido un error al eliminar la/s partida/s.");
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
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
    );
});

export default PlaysDataTable;
