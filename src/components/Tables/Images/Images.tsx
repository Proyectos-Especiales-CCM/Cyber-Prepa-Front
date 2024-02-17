import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from "../../../store/appContext/appContext";
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableIsRowCheck } from "mui-datatables";
import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import { ImageCell } from '../CustomBodyCells';
import { CreateImagePanel } from '../..';
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

interface ImagesDataTableProps {
    modalAttr: { openModal: boolean; handleCloseModal: () => void; title: string; children: JSX.Element; };
    setModalAttr: (value: React.SetStateAction<{ openModal: boolean; handleCloseModal: () => void; title: string; children: JSX.Element; }>) => void;
    openModalMessage: (severity: string, message: string) => void;
}

const ImagesDataTable = React.forwardRef((props: ImagesDataTableProps, ref) => {

    const { tokens } = useAppContext();
    const [imagesData, setImagesData] = useState<Image[]>([]);
    const [imagesSelected] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const imageResponse = await readImages(tokens?.access_token ?? "");
            setImagesData(imageResponse?.data);
        } catch (error) {
            console.error(error);
        }
    }, [tokens]);

    const handleDeleteImage = async (selectedRows: MUIDataTableIsRowCheck) => {
        try {
            for (const row of selectedRows.data) {
                const index = row.dataIndex;
                await deleteImageById(imagesData[index].id, tokens?.access_token ?? "");
            }
            fetchData();
            props.openModalMessage("success", "Imagen/es eliminada/s correctamente.");
        }
        catch (error) {
            props.openModalMessage("error", "Ha ocurrido un error al eliminar la/s imagen/es.");
            console.error(error);
        }
    };

    // Métodos extra para cambiar el contenido del modal por el
    // componente de creación o modificación de imágenes
    const setCreateImageModal = () => {
        props.setModalAttr({
            ...props.modalAttr,
            openModal: true,
            title: "Agregar imagen",
            children: (<>
                <CreateImagePanel
                    openModalMessage={props.openModalMessage}
                    closeModal={props.modalAttr.handleCloseModal}
                    fetchData={fetchData}
                />
            </>),
        });
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
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
    )
});

export default ImagesDataTable;