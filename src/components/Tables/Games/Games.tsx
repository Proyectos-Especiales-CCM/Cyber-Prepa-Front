import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from "../../../store/appContext/appContext";
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableIsRowCheck } from "mui-datatables";
import { Box, Stack, Tooltip, IconButton, Button } from "@mui/material";
import { Edit, Visibility, VisibilityOff, Delete } from '@mui/icons-material';
import { BooleanCell, DateCell, ImageCell } from "../CustomBodyCells";
import { CreateGamePanel, ModifyGamePanel } from '../..';
import { Game, Image } from '../../../services/types'
import { readGames, deleteGameById, patchGameById, findImageIdWithUrl, completeImageUrl } from '../../../services/';

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
        name: 'image',
        label: 'Imagen',
        options: {
            customBodyRender: (value: string | undefined) => ImageCell({ value, style: { width: '50px', height: 'auto' } }),
            filter: false,
        },
    },
];

interface GamesDataTableProps {
    images: Image[];
    modalAttr: { openModal: boolean; handleCloseModal: () => void; title: string; children: JSX.Element; };
    setModalAttr: (value: React.SetStateAction<{ openModal: boolean; handleCloseModal: () => void; title: string; children: JSX.Element; }>) => void
    openModalMessage: (severity: string, message: string) => void;
}

const GamesDataTable = React.forwardRef((props: GamesDataTableProps, ref) => {

    const { tokens } = useAppContext();
    const [gamesData, setGamesData] = useState<Game[]>([]);
    const [gamesSelected] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const response = await readGames();
            setGamesData(response.data);
        } catch (error) {
            props.openModalMessage("error", "Ha ocurrido un error al cargar los juegos.");
            console.error(error);
        }
    }, [props]);

    const handleUpdateGame = async (selectedRows: MUIDataTableIsRowCheck, field: string, value: boolean | string) => {
        try {
            for (const row of selectedRows.data) {
                const index = row.dataIndex;

                let requestBody = {};
                if (field === "show") {
                    requestBody = { show: value };
                } else {
                    return;
                }

                await patchGameById(gamesData[index].id, tokens?.access_token ?? "", requestBody);
            }
            fetchData();
            props.openModalMessage("success", "Juego/s actualizado/s correctamente.");
        }
        catch (error) {
            props.openModalMessage("error", "Ha ocurrido un error al actualizar el/los juego/s.");
            console.error(error);
        }
    };

    const handleDeleteGame = async (selectedRows: MUIDataTableIsRowCheck) => {
        try {
            for (const row of selectedRows.data) {
                const index = row.dataIndex;

                await deleteGameById(gamesData[index].id, tokens?.access_token ?? "");
            }
            fetchData();
            props.openModalMessage("success", "Juego/s eliminado/s correctamente.");
        }
        catch (error) {
            props.openModalMessage("error", "Ha ocurrido un error al eliminar el/los juego/s.");
            console.error(error);
        }
    };

    // Métodos extra para cambiar el contenido del modal por el
    // componente de creación de juego
    const setAddGameModal = () => {
        props.setModalAttr({
            ...props.modalAttr,
            openModal: true,
            title: "Añadir Juego",
            children: (<><CreateGamePanel
                openModalMessage={props.openModalMessage}
                closeModal={props.modalAttr.handleCloseModal}
                updateGamesData={fetchData}
            /></>),
        });
    }

    const setModifyGameModal = (selectedRows: MUIDataTableIsRowCheck) => {
        if (selectedRows.data.length !== 1) {
            props.openModalMessage("error", "Solo debes seleccionar un juego para modificarlo.");
            return;
        }
        const index = selectedRows.data[0].dataIndex;
        const game = gamesData[index];

        const gameImage = findImageIdWithUrl(props.images, completeImageUrl(game.image ?? '') ?? '');

        props.setModalAttr({
            ...props.modalAttr,
            openModal: true,
            title: "Modificar Juego " + game.name,
            children: (<><ModifyGamePanel
                openModalMessage={props.openModalMessage}
                closeModal={props.modalAttr.handleCloseModal}
                updateGamesData={fetchData}
                gameId={game.id}
                prevName={game.name}
                prevShow={game.show}
                prevImageId={gameImage}
            /></>),
        });
    }

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <Box ref={ref} sx={{ margin: '1rem' }}>
            <MUIDataTable
                title={"Catálogo de Juegos"}
                data={gamesData}
                columns={gameColumns as MUIDataTableColumnDef[]}
                options={{
                    selectableRowsOnClick: true,
                    responsive: "simple",
                    rowsSelected: gamesSelected,
                    customToolbar: () => <Button variant='contained' color='success' onClick={setAddGameModal}>Añadir Juego</Button>,
                    customToolbarSelect: (selectedRows: object) =>
                        <>
                            <Stack id='game-options' direction="row">
                                <Tooltip title="Editar">
                                    <IconButton
                                        aria-label="edit"
                                        color="info"
                                        size="large"
                                        onClick={() => {
                                            setModifyGameModal(selectedRows as MUIDataTableIsRowCheck);
                                        }}
                                    >
                                        <Edit fontSize='inherit' />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Mostrar">
                                    <IconButton
                                        aria-label="show"
                                        color="inherit"
                                        size="large"
                                        onClick={() => {
                                            handleUpdateGame(selectedRows as MUIDataTableIsRowCheck, "show", true);
                                        }}
                                    >
                                        <Visibility fontSize='inherit' />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Ocultar">
                                    <IconButton
                                        aria-label="not-show"
                                        color="inherit"
                                        size="large"
                                        onClick={() => {
                                            handleUpdateGame(selectedRows as MUIDataTableIsRowCheck, "show", false);
                                        }}
                                    >
                                        <VisibilityOff fontSize='inherit' />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Borrar">
                                    <IconButton
                                        aria-label="delete"
                                        color="error"
                                        size="large"
                                        onClick={() => {
                                            handleDeleteGame(selectedRows as MUIDataTableIsRowCheck);
                                        }}
                                    >
                                        <Delete fontSize='inherit' />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </>,
                }}
            />
        </Box>
    )
});

export default GamesDataTable;
