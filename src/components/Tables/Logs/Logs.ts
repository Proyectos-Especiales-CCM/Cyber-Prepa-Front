import { DateCell } from "../CustomBodyCells";

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
export default logColumns;
