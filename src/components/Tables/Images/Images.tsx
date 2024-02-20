import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from "../../../store/appContext/useAppContext";
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableIsRowCheck } from "mui-datatables";
import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import { ImageCell } from '../CustomBodyCells';
import { CreateImagePanel, ModalMessage, Modal } from '../..';
import { Image } from '../../../services/types';
import { readImages, deleteImageById } from '../../../services';
import { Upload, Delete } from '@mui/icons-material';

const imageColumns = [
    {
        name: 'id',
        label: 'ID',
        options: {
            filter: false,
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
 * Images MUI DataTable component.
 * 
 * Allows to display, and delete images.
 * 
 * @example
 * const ref = useRef();
 * 
 * return (
 *   <ImagesDataTable ref={ref} />
 * );
 * 
 * @component
 * @param {React.ForwardedRef} ref Ref to allow quick navigation.
 * 
 * @property imagesData: <Image[]> - List of images fetched from the API.
 * @property imagesSelected: <[]> - Rows selected in the table.
 * @property modalMessageAttr: <{openModal: boolean, severity: string, message: string}> - Attributes for the modal message.
 * @property modalAttr: <{openModal: boolean, title: string, children: React.ReactNode}> - Attributes for the modal.
 * 
 * @author Diego Jacobo Mtz. [Github](https://github.com/Djmr5)
 */
const ImagesDataTable = React.forwardRef((_props, ref) => {

    const { tokens } = useAppContext();
    const [imagesData, setImagesData] = useState<Image[]>([]);
    const [imagesSelected] = useState([]);

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
            const imageResponse = await readImages(tokens?.access_token ?? "");
            setImagesData(imageResponse?.data);
        } catch (error) {
            openModalMessage("error", "Ha ocurrido un error al cargar las imágenes.");
            console.error(error);
        }
    }, [tokens, openModalMessage]);

    /**
     * Handles the deletion of selected images.
     * @function
     * @async
     * @param {MUIDataTableIsRowCheck} selectedRows - Selected rows in the table.
     * @returns {Promise<void>}
     */
    const handleDeleteImage = async (selectedRows: MUIDataTableIsRowCheck): Promise<void> => {
        try {
            for (const row of selectedRows.data) {
                const index = row.dataIndex;
                await deleteImageById(imagesData[index].id, tokens?.access_token ?? "");
            }
            fetchData();
            openModalMessage("success", "Imagen/es eliminada/s correctamente.");
        }
        catch (error) {
            openModalMessage("error", "Ha ocurrido un error al eliminar la/s imagen/es.");
            console.error(error);
        }
    };

    // Métodos extra para cambiar el contenido del modal por el
    // componente de creación o modificación de imágenes
    const setCreateImageModal = () => {
        setModalAttr({
            openModal: true,
            title: "Agregar imagen",
            children: (<>
                <CreateImagePanel
                    openModalMessage={openModalMessage}
                    closeModal={handleCloseModal}
                    fetchData={fetchData}
                />
            </>),
        });
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            <Box ref={ref} sx={{ margin: '1rem' }}>
                <MUIDataTable
                    title={"Imágenes"}
                    data={imagesData}
                    columns={imageColumns as MUIDataTableColumnDef[]}
                    options={{
                        selectableRowsOnClick: true,
                        responsive: 'simple',
                        rowsSelected: imagesSelected,
                        customToolbar: () =>
                            <Tooltip title="Subir imagen">
                                <IconButton
                                    aria-label="edit"
                                    color="info"
                                    size="large"
                                    onClick={() => {
                                        setCreateImageModal();
                                    }}
                                >
                                    <Upload fontSize='inherit' />
                                </IconButton>
                            </Tooltip>,
                        customToolbarSelect: (selectedRows: object) =>
                            <>
                                <Stack id='game-options' direction="row">
                                    <Tooltip title="Borrar">
                                        <IconButton
                                            aria-label="delete"
                                            color="error"
                                            size="large"
                                            onClick={() => {
                                                handleDeleteImage(selectedRows as MUIDataTableIsRowCheck);
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

export default ImagesDataTable;