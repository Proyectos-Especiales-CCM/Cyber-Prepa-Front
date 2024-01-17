import { BooleanCell } from "../CustomBodyCells";

const userColumns = [
    {
        name: 'id',
        label: 'ID',
        options: {
            filter: false,
        }
    },
    {
        name: 'email',
        label: 'Correo electrónico',
        options: {
            filterType: 'textField',
        }
    },
    {
        name: 'is_admin',
        label: 'Es administrador',
        options: {
            customBodyRender: (value: boolean) => BooleanCell({ value }),
            filterType: 'checkbox',
        }
    },
    {
        name: 'is_active',
        label: 'Activo',
        options: {
            customBodyRender: (value: boolean) => BooleanCell({ value }),
            filterType: 'checkbox',
        }
    }
];
export default userColumns;