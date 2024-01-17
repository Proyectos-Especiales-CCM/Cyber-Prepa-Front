import { BooleanCell } from "../CustomBodyCells";

const studentColumns = [
    {
        name: 'id',
        label: 'Matrícula',
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
        name: 'played_today',
        label: 'Jugó hoy',
        options: {
            filterType: 'textField',
        }
    },
    {
        name: 'weekly_plays',
        label: 'Jugadas esta semana',
        options: {
            filterType: 'textField',
        }
    },
    {
        name: 'sanctions_number',
        label: 'No. de sanciones',
        options: {
            filter: false,
        }
    },
    {
        name: 'forgoten_id',
        label: 'Olvidó credencial',
        options: {
            customBodyRender: (value: boolean) => BooleanCell({ value }),
            filterType: 'checkbox',
        }
    }
];
export default studentColumns;