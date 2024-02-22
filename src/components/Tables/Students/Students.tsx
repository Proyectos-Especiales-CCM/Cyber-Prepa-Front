import React, { useState, useEffect, useCallback } from "react";
import { useAppContext } from "../../../store/appContext/useAppContext";
import MUIDataTable, { MUIDataTableColumnDef } from "mui-datatables";
import { Box } from "@mui/material";
import { Student } from "../../../services/types";
import { readStudents } from "../../../services";
import { BooleanCell } from "../CustomBodyCells";
import { ModalMessage } from "../..";

const studentColumns = [
    {
        name: 'id',
        label: 'Matrícula',
        options: {
            filterType: 'textField',
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
    },
    {
        name: 'weekly_plays',
        label: 'Jugadas esta semana',
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

/**
 * Students MUI DataTable component.
 * 
 * Displays a table with the students and they data fetched from the API.
 * 
 * @example
 * const ref = useRef();
 * 
 * return (
 *   <StudentsDataTable ref={ref} />
 * );
 * 
 * @component
 * @param {React.ForwardedRef} ref Ref to allow quick navigation.
 * 
 * @property studentsData: <Student[]> - List of students fetched from the API.
 * @property modalMessageAttr: <{openModal: boolean, severity: string, message: string}> - Attributes for the modal message.
 * 
 * @author Diego Jacobo Mtz. [Github](https://github.com/Djmr5)
 */
const StudentsDataTable = React.forwardRef((_props, ref) => {

    const { tokens } = useAppContext();
    const [studentsData, setStudentsData] = useState<Student[]>([]);

    // Variable de atributos del modal de mensajes (feedback al usuario)
    const [modalMessageAttr, setModalMessageAttr] = useState({
        openModal: false,
        severity: "info",
        message: "Sample Message",
    });

    /**
     * Closes the modal with a message and resets its attributes.
     * 
     * @function
     * 
     * @returns {void}
     */
    const closeModalMessage = useCallback((): void => {
        setModalMessageAttr({
            openModal: false,
            severity: "info",
            message: "Sample Message",
        });
    }, []);

    /**
     * Opens a modal with a message.
     * 
     * @function
     * @param {string} severity - Severity of the message.
     * @param {string} message - Content of the message.
     * 
     * @returns {void}
     */
    const openModalMessage = useCallback((severity: string, message: string): void => {
        setModalMessageAttr({
            openModal: true,
            severity: severity,
            message: message,
        });
    }, []);


    /**
     * Fetches users data from the server.
     * @function
     * @async
     * @returns {Promise<void>}
     */
    const fetchData = useCallback(async (): Promise<void> => {
        try {
            const response = await readStudents(tokens?.access_token ?? "");
            setStudentsData(response.data);
        } catch (error) {
            openModalMessage("error", "Ha ocurrido un error al cargar los estudiantes");
            console.error(error);
        }
    }, [tokens?.access_token, openModalMessage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    return (
        <>
            <Box ref={ref} sx={{ margin: '1rem' }}>
                <MUIDataTable
                    title={"Estudiantes"}
                    data={studentsData}
                    columns={studentColumns as MUIDataTableColumnDef[]}
                    options={{ selectableRowsOnClick: true, responsive: "simple", }}
                />
            </Box>
            <ModalMessage handleCloseModal={closeModalMessage} {...modalMessageAttr} />
        </>
    );
});

export default StudentsDataTable;
