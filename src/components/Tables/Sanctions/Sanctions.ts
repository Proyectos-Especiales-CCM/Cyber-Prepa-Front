import { DateCell } from "../CustomBodyCells";

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
export default sanctionColumns;
