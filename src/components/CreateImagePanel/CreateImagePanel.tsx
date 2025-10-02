import { useState } from "react";
import { Button, Grid, Tooltip, Typography } from "@mui/material";
import { useAppContext } from "../../store/appContext/useAppContext";
import { createImage } from "../../services";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Upload } from "@mui/icons-material";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

interface CreateImagePanelProps {
    openModalMessage: (severity: string, message: string) => void;
    closeModal: () => void;
    fetchData: () => void;
}

const CreateImagePanel: React.FC<CreateImagePanelProps> = ({ openModalMessage, closeModal, fetchData }) => {

    const { tokens } = useAppContext();
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImageFile(event.target.files?.item(0) || null);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (imageFile === null) return;
            await createImage(tokens?.access_token ?? "", imageFile);
            fetchData();
            openModalMessage('success', 'Imagen subida exitosamente.');
            closeModal();
        } catch (error) {
            openModalMessage('error', 'No se pudo subir la imagen.');
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} id='createUserPanel'>
            <ThemeProvider theme={darkTheme}>
                <Grid container direction='column' spacing={2} padding={'1rem'}>
                    <Grid size={12}>
                        <Typography>Seleccione una imagen desde su dispositivo</Typography>
                        <input type="file" accept='image/*' onChange={handleImageFileChange} />
                    </Grid>
                    <Grid size={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title={"Subir imagen"}>
                            <Button variant="contained" color="success" type="submit">
                                <Upload fontSize='inherit' />
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </form >
    )
}

export default CreateImagePanel;