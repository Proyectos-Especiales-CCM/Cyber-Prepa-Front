import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from "../../../store/appContext/useAppContext";
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableIsRowCheck } from "mui-datatables";
import { Box, Stack, Tooltip, IconButton, Button } from "@mui/material";
import { Edit, Visibility, VisibilityOff, Delete } from '@mui/icons-material';
import { BooleanCell, DateCell, ImageCell } from "../CustomBodyCells";
import { CreateGamePanel, Modal, ModalMessage, ModifyGamePanel } from '../..';
import { Game, Image } from '../../../services/types'
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
        name: 'image',
        label: 'Imagen',
        options: {
            customBodyRender: (value: string | undefined) => ImageCell({ value, style: { width: '50px', height: 'auto' } }),
            filter: false,
        },
    },
];

/**
 * Games MUI DataTable component.
 * 
 * Allows to display, modify, create and delete games.
 * 
 * Allowed modifications:
 * - Change game's name.
 * - Change if the game is shown or not.
 * - Change game's image.
 * 
 * @example
 * const ref = useRef();
 * 
 * return (
 *   <GamesDataTable ref={ref} />
 * );
 * 
 * @component
 * @param {React.ForwardedRef} ref Ref to allow quick navigation.
 * 
 * @property gamesData: <Game[]> - List of games fetched from the API.
 * @property gamesSelected: <[]> - Rows selected in the table.
 * @property modalMessageAttr: <{openModal: boolean, severity: string, message: string}> - Attributes for the modal message.
 * @property modalAttr: <{openModal: boolean, title: string, children: React.ReactNode}> - Attributes for the modal.
 * 
 * @author Diego Jacobo Mtz. [Github](https://github.com/Djmr5)
 */
const GamesDataTable = React.forwardRef((_props, ref) => {

    const { tokens } = useAppContext();
    const [images, setImages] = useState<Image[]>([]);
    const [gamesData, setGamesData] = useState<Game[]>([]);
    const [gamesSelected] = useState([]);

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

    // Variables de atributos de los modales
    const [modalAttr, setModalAttr] = useState({
        openModal: false,
        title: "Hello, I'm a Modal",
        children: (<><p>Sample Content</p></>),
    });

    /**
     * Closes the modal and resets its attributes.
     * 
     * @function
     * 
     * @returns {void}
     */
    const handleCloseModal = useCallback((): void => {
        setModalAttr({
            openModal: false,
            title: "Hello, I'm a Modal",
            children: (<><p>Sample Content</p></>),
        });
    }, []);

    /**
     * Fetches images data from the server.
     * @function
     * @async
     * @returns {Promise<void>}
     */
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

    /**
     * Updates game's data in the server.
     * 
     * Can only update one field with the same value for all selected games at a time.
     * 
     * @function
     * @async
     * @param {MUIDataTableIsRowCheck} selectedRows Selected rows in the table.
     * @param {string} field Field to update.
     * @param {boolean | string} value New value for the field.
     * @returns {Promise<void>}
     */
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

    /**
     * Handles the deletion of selected images.
     * @function
     * @async
     * @param {MUIDataTableIsRowCheck} selectedRows - Selected rows in the table.
     * @returns {Promise<void>}
     */
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

    // Métodos extra para cambiar el contenido del modal por el
    // componente de creación de juego
    /**
     * Sets the modal attributes for creating a new game.
     * @function
     * @returns {void}
     */
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

    /**
     * Sets the modal attributes for modifying a game.
     * @function
     * @param {MUIDataTableIsRowCheck} selectedRows Selected rows in the table.
     * @returns {void}
     */
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

    return (
        <>
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
            <ModalMessage handleCloseModal={closeModalMessage} {...modalMessageAttr} />
            <Modal handleCloseModal={handleCloseModal} {...modalAttr} />
        </>
    )
});

export default GamesDataTable;
