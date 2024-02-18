import React, { useState, useEffect, useCallback } from 'react';
import { DateCell } from "../CustomBodyCells";
import { Box, Button, IconButton, Stack, Tooltip } from '@mui/material';
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableIsRowCheck } from 'mui-datatables';
import { Delete, Edit } from '@mui/icons-material';
import { useAppContext } from '../../../store/appContext/appContext';
import { CreateSanctionPanel, ModifySanctionPanel } from '../..';
import { deleteSanctionById, readSanctions } from '../../../services';
import { Sanction } from '../../../services/types';

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

interface SanctionsDataTableProps {
    modalAttr: { openModal: boolean; handleCloseModal: () => void; title: string; children: JSX.Element; };
    setModalAttr: (value: React.SetStateAction<{ openModal: boolean; handleCloseModal: () => void; title: string; children: JSX.Element; }>) => void
    openModalMessage: (severity: string, message: string) => void;
}

const SanctionsDataTable = React.forwardRef((props: SanctionsDataTableProps, ref) => {

    const { tokens } = useAppContext();
    const [sanctionsData, setSanctionsData] = useState<Sanction[]>([]);
    const [sanctionsSelected] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const response = await readSanctions(tokens?.access_token ?? "");
            setSanctionsData(response?.data);
        } catch (error) {
            props.openModalMessage("error", "Ha ocurrido un error al cargar las sanciones.");
            console.error(error);
        }
    }, [tokens, props]);

    const handleDeleteSanction = async (selectedRows: MUIDataTableIsRowCheck) => {
        try {
            for (const row of selectedRows.data) {
                const index = row.dataIndex;

                await deleteSanctionById(sanctionsData[index].id, tokens?.access_token ?? "");
            }
            fetchData();
            props.openModalMessage("success", "Sanción/es eliminada/s correctamente.");
        }
        catch (error) {
            props.openModalMessage("error", "Ha ocurrido un error al eliminar la/s sanción/es.");
            console.error(error);
        }
    }

    // Métodos extra para cambiar el contenido del modal por el
    // componente de creación de juego
    const setAddSanctionModal = () => {
        props.setModalAttr({
            ...props.modalAttr,
            openModal: true,
            title: "Crear Sanción",
            children: (<><CreateSanctionPanel
                openModalMessage={props.openModalMessage}
                closeModal={props.modalAttr.handleCloseModal}
                updateSanctionsData={fetchData}
            /></>),
        });
    };

    const setModifySanctionModal = (selectedRows: MUIDataTableIsRowCheck) => {
        if (selectedRows.data.length !== 1) {
            props.openModalMessage("error", "Solo debes seleccionar un juego para modificarlo.");
            return;
        }
        const index = selectedRows.data[0].dataIndex;
        const sanction = sanctionsData[index];

        props.setModalAttr({
            ...props.modalAttr,
            openModal: true,
            title: "Modificar Sanción de: " + sanction.student,
            children: (<><ModifySanctionPanel
                sanctionId={sanction.id}
                prevStudent={sanction.student}
                prevCause={sanction.cause}
                prevDate={sanction.end_time}
                openModalMessage={props.openModalMessage}
                closeModal={props.modalAttr.handleCloseModal}
                updateSanctionsData={fetchData}
            /></>),
        });
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <Box ref={ref} sx={{ margin: '1rem' }}>
            <MUIDataTable
                title={"Sanciones"}
                data={sanctionsData}
                columns={sanctionColumns as MUIDataTableColumnDef[]}
                options={{
                    selectableRowsOnClick: true,
                    responsive: "simple",
                    rowsSelected: sanctionsSelected,
                    customToolbar: () => <Button variant='contained' color='success' onClick={setAddSanctionModal}>Crear Sanción</Button>,
                    customToolbarSelect: (selectedRows: object) =>
                        <>
                            <Stack id='game-options' direction="row">
                                <Tooltip title="Modificar">
                                    <IconButton
                                        aria-label="edit"
                                        color="info"
                                        size="large"
                                        onClick={() => {
                                            setModifySanctionModal(selectedRows as MUIDataTableIsRowCheck);
                                        }}
                                    >
                                        <Edit fontSize='inherit' />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Borrar">
                                    <IconButton
                                        aria-label="delete"
                                        color="error"
                                        size="large"
                                        onClick={() => {
                                            handleDeleteSanction(selectedRows as MUIDataTableIsRowCheck);
                                        }}
                                    >
                                        <Delete fontSize='inherit' />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </>,
                    sortOrder: {
                        name: 'id',
                        direction: 'desc'
                    }
                }}
            />
        </Box >
    );
});

export default SanctionsDataTable;
