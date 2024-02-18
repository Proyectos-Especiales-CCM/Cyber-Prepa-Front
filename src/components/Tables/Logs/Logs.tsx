import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../../store/appContext/useAppContext';
import MUIDataTable, { MUIDataTableColumnDef } from 'mui-datatables';
import { Box } from '@mui/material';
import { DateCell } from "../CustomBodyCells";
import { Log } from '../../../services/types';
import { readLogs } from '../../../services';

const logColumns = [
    {
        name: 'line',
        label: 'Línea',
        options: {
            display: 'excluded',
            filter: false,
        }
    },
    {
        name: 'timestamp',
        label: 'Fecha y hora',
        options: {
            customBodyRender: (value: string) => DateCell({ value }),
            filterType: 'textField',
        }
    },
    {
        name: 'user',
        label: 'Usuario',
        options: {
            filterType: 'textField',
        }
    },
    {
        name: 'action',
        label: 'Acción realizada',
        options: {
            filter: false,
        }
    },
];

interface LogsDataTableProps {
    openModalMessage: (severity: string, message: string) => void;
}

const LogsDataTable = React.forwardRef((props: LogsDataTableProps, ref) => {

    const { tokens } = useAppContext();
    const [logsData, setLogsData] = useState<Log[]>([]);

    const fetchData = useCallback(async () => {
        try {
            const response = await readLogs(tokens?.access_token ?? '');
            setLogsData(response.data);
        } catch (error) {
            props.openModalMessage('error', 'No se pudieron obtener los registros de actividad');
            console.error(error);
        }
    }, [tokens, props]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <Box ref={ref} sx={{ margin: '1rem' }}>
            <MUIDataTable
                title={"Historial de los Usuarios"}
                data={logsData}
                columns={logColumns as MUIDataTableColumnDef[]}
                options={{
                    responsive: "simple",
                    selectableRows: "none",
                }}
            />
        </Box>
    )
});

export default LogsDataTable;
