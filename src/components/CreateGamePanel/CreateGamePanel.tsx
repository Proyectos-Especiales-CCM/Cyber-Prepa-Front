import { useState, useEffect } from 'react';
import {
    Button,
    Grid,
    FormControl,
    InputLabel,
    Input,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Typography,
    SelectChangeEvent,
} from '@mui/material';
import { useAppContext } from "../../store/appContext/useAppContext";
import { createGame, readImages, createImage } from '../../services';
import { Image } from '../../services/types';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SelectOrUploadImage } from '..';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});


interface CreateGamePanelProps {
    openModalMessage: (severity: string, message: string) => void;
    closeModal: () => void;
    updateGamesData: () => Promise<void>;
}

const CreateGamePanel: React.FC<CreateGamePanelProps> = ({ openModalMessage, closeModal, updateGamesData }) => {
    const { tokens, admin } = useAppContext();
    const [name, setName] = useState<string>('');
    const [show, setShow] = useState<boolean>(false);
    const [uploadImage, setUploadImage] = useState<boolean>(false);
    const [imageId, setImageId] = useState<string>('');
    const [images, setImages] = useState<Image[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Handle changes
    const handleShowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShow(event.target.checked);
    };
    const handleSelectOrUploadImageChange = () => {
        setUploadImage(!uploadImage);
    }
    const handleImageIdChange = (event: SelectChangeEvent) => {
        setImageId(event.target.value);
    };
    const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImageFile(event.target.files?.item(0) || null);
    };

    // Handle submit
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (!admin) {
            openModalMessage('error', 'No tienes permiso para realizar esta acción.');
            return;
        }

        try {
            // Si se seleccionó subir una imagen, mandar request para subir la imagen
            let imageIdToSend = imageId !== '' ? parseInt(imageId) : undefined;
            if (uploadImage) {
                if (imageFile === null) return;
                const response = await createImage(tokens?.access_token || '', imageFile);
                imageIdToSend = response.data.id;
            }

            // Mandar request para crear el juego
            const res = await createGame(name, show, tokens?.access_token || '', imageIdToSend || undefined);
            console.log(res);
            // Cerrar modal y mostrar mensaje de éxito
            await updateGamesData();
            closeModal();
            openModalMessage('success', 'Juego creado exitosamente.');
        } catch (error) {
            // Handle errors
            openModalMessage('error', 'Lo sentimos, ha ocurrido un error al crear el juego.');
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await readImages(tokens?.access_token || '');
                setImages(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        }
        fetchImages();
    }, [tokens]);

    return (
        <>
            <form onSubmit={handleSubmit} id='createUserPanel'>
                <ThemeProvider theme={darkTheme}>
                    <Grid container direction='column' spacing={2} padding={'1rem'}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="name">Nombre del nuevo Juego</InputLabel>
                                <Input
                                    id="name"
                                    aria-describedby="name-helper-text"
                                    type='text'
                                    autoComplete="off"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{ m: 1 }}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={show} onChange={handleShowChange} name="show" />
                                        }
                                        label="Mostrar"
                                    />
                                </FormGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                {uploadImage ? 'Suba una imagen para el juego' : 'Seleccione una imagen para el juego'}
                            </Typography>
                            <SelectOrUploadImage
                                uploadImage={uploadImage}
                                imageId={imageId}
                                handleImageIdChange={handleImageIdChange}
                                handleImageFileChange={handleImageFileChange}
                                handleSelectOrUploadImageChange={handleSelectOrUploadImageChange}
                                images={images}>
                            </SelectOrUploadImage>
                        </Grid>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" color="success" type="submit">Añadir</Button>
                        </Grid>
                    </Grid>
                </ThemeProvider>
            </form>
        </>
    )
}
export default CreateGamePanel;
