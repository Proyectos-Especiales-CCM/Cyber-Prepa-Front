import { BooleanCell, DateCell } from "../CustomBodyCells";

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
export default playColumns;
