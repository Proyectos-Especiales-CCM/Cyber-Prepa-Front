import React, { useState, useEffect, useCallback } from "react";
import { useAppContext } from "../../../store/appContext/appContext";
import MUIDataTable, { MUIDataTableColumnDef } from "mui-datatables";
import { Box } from "@mui/material";
import { Student } from "../../../services/types";
import { readStudents } from "../../../services";
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

interface StudentsDataTableProps {
    openModalMessage: (severity: string, message: string) => void;
}

const StudentsDataTable = React.forwardRef((props: StudentsDataTableProps, ref) => {

    const { tokens } = useAppContext();
    const [studentsData, setStudentsData] = useState<Student[]>([]);

    const fetchData = useCallback(async () => {
        try {
            const response = await readStudents(tokens?.access_token ?? "");
            setStudentsData(response.data);
        } catch (error) {
            props.openModalMessage("error", "Ha ocurrido un error al cargar los estudiantes");
            console.error(error);
        }
    }, [props, tokens?.access_token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    return (
        <Box ref={ref} sx={{ margin: '1rem' }}>
            <MUIDataTable
                title={"Estudiantes"}
                data={studentsData}
                columns={studentColumns as MUIDataTableColumnDef[]}
                options={{ selectableRowsOnClick: true, responsive: "simple", }}
            />
        </Box>
    );
});

export default StudentsDataTable;
