import { BooleanCell, DateCell } from "../CustomBodyCells";

const gameColumns = [
    {
        name: 'id',
        label: 'ID',
        options: {
            filter: false,
        }
    },
    {
        name: 'name',
        label: 'Nombre',
        options: {
            filterType: 'textField',
        }
    },
    {
        name: 'plays',
        label: 'No. Jugadores',
        options: {
            filter: false,
        }
    },
    {
        name: 'show',
        label: 'Mostrar',
        options: {
            customBodyRender: (value: boolean) => BooleanCell({ value }),
            filterType: 'checkbox',
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
        name: 'file_route',
        label: 'Nombre del archivo de imagen',
        options: {
            display: 'excluded',
            filter: false,
        }
    }
];
export default gameColumns;
