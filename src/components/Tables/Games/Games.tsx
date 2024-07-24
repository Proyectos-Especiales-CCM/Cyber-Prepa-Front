import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from "../../../store/appContext/useAppContext";
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableIsRowCheck } from "mui-datatables";
import { Box, Stack, Tooltip, IconButton, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { Edit, Visibility, VisibilityOff, Delete } from '@mui/icons-material';
import { BooleanCell, DateCell, ImageCell } from "../CustomBodyCells";
import { CreateGamePanel, Modal, ModalMessage, ModifyGamePanel } from '../..';
import { Game, Image } from '../../../services/types';
import { readGames, readImages, deleteGameById, patchGameById, findImageIdWithUrl, completeImageUrl } from '../../../services/';

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
        name: 'category',
        label: 'Categoría',
        options: {
            filter: true,
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

const GamesDataTable = React.forwardRef((_props, ref) => {
    const { tokens } = useAppContext();
    const [images, setImages] = useState<Image[]>([]);
    const [gamesData, setGamesData] = useState<Game[]>([]);
    const [gamesSelected] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const [modalMessageAttr, setModalMessageAttr] = useState({
        openModal: false,
        severity: "info",
        message: "Sample Message",
    });

    const closeModalMessage = useCallback((): void => {
        setModalMessageAttr({
            openModal: false,
            severity: "info",
            message: "Sample Message",
        });
    }, []);

    const openModalMessage = useCallback((severity: string, message: string): void => {
        setModalMessageAttr({
            openModal: true,
            severity: severity,
            message: message,
        });
    }, []);

    const [modalAttr, setModalAttr] = useState({
        openModal: false,
        title: "Hello, I'm a Modal",
        children: (<><p>Sample Content</p></>),
    });

    const handleCloseModal = useCallback((): void => {
        setModalAttr({
            openModal: false,
            title: "Hello, I'm a Modal",
            children: (<><p>Sample Content</p></>),
        });
    }, []);

    const fetchData = useCallback(async (): Promise<void> => {
        try {
            const gameResponse = await readGames();
            setGamesData(gameResponse.data);
            const imageResponse = await readImages(tokens?.access_token ?? "");
            setImages(imageResponse?.data);
        } catch (error) {
            openModalMessage("error", "Ha ocurrido un error al cargar los juegos.");
            console.error(error);
        }
    }, [tokens, openModalMessage]);

    const handleUpdateGame = async (selectedRows: MUIDataTableIsRowCheck, field: string, value: boolean | string): Promise<void> => {
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
            openModalMessage("success", "Juego/s actualizado/s correctamente.");
        }
        catch (error) {
            openModalMessage("error", "Ha ocurrido un error al actualizar el/los juego/s.");
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
            openModalMessage("success", "Juego/s eliminado/s correctamente.");
        }
        catch (error) {
            openModalMessage("error", "Ha ocurrido un error al eliminar el/los juego/s.");
            console.error(error);
        }
    };

    const setAddGameModal = () => {
        setModalAttr({
            openModal: true,
            title: "Añadir Juego",
            children: (<><CreateGamePanel
                openModalMessage={openModalMessage}
                closeModal={handleCloseModal}
                updateGamesData={fetchData}
            /></>),
        });
    }

    const setModifyGameModal = (selectedRows: MUIDataTableIsRowCheck) => {
        if (selectedRows.data.length !== 1) {
            openModalMessage("error", "Solo debes seleccionar un juego para modificarlo.");
            return;
        }
        const index = selectedRows.data[0].dataIndex;
        const game = gamesData[index];

        const gameImage = findImageIdWithUrl(images, completeImageUrl(game.image ?? '') ?? '');

        setModalAttr({
            ...modalAttr,
            openModal: true,
            title: "Modificar Juego " + game.name,
            children: (<><ModifyGamePanel
                openModalMessage={openModalMessage}
                closeModal={handleCloseModal}
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

    const filteredGamesData = selectedCategory
        ? gamesData.filter(game => game.category === selectedCategory)
        : gamesData;

    return (
        <>
            <Box ref={ref} sx={{ margin: '1rem' }}>
                <FormControl sx={{ marginBottom: '1rem', minWidth: 120 }}>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                        value={selectedCategory}
                        label="Categoría"
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <MenuItem value="">
                            <em>All</em>
                        </MenuItem>
                        {Array.from(new Set(gamesData.map(game => game.category))).map(category => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <MUIDataTable
                    title={"Catálogo de Juegos"}
                    data={filteredGamesData}
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
            <ModalMessage handleCloseModal={closeModalMessage} {...modalMessageAttr} />
            <Modal handleCloseModal={handleCloseModal} {...modalAttr} />
        </>
    )
});

export default GamesDataTable;
