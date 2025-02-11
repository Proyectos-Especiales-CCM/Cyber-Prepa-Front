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
    SelectChangeEvent
} from '@mui/material';
import { useAppContext } from "../../store/appContext/useAppContext";
import { patchGameById, readImages, createImage } from '../../services';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Image } from '../../services/types';
import { SelectOrUploadImage } from '..';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});


interface ModifyGamePanelProps {
    openModalMessage: (severity: string, message: string) => void;
    closeModal: () => void;
    updateGamesData: () => Promise<void>;
    gameId: number;
    prevName: string;
    prevShow: boolean;
    prevImageId: number | undefined;
}

const ModifyGamePanel: React.FC<ModifyGamePanelProps> = ({ openModalMessage, closeModal, updateGamesData, gameId, prevName, prevShow, prevImageId }) => {
    const { tokens, admin } = useAppContext();
    const [name, setName] = useState<string>(prevName);
    const [show, setShow] = useState<boolean>(prevShow);
    const [imageId, setImageId] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [images, setImages] = useState<Image[]>([]);
    const [uploadImage, setUploadImage] = useState<boolean>(false);

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

        let imageIdAsNumber = imageId === '' ? prevImageId : parseInt(imageId);
        if (uploadImage) {
            if (imageFile === null) return;
            const response = await createImage(tokens?.access_token || '', imageFile);
            imageIdAsNumber = response.data.id;
        }

        // Request body
        const requestBody = {
            ...(name !== prevName && { name: name }),
            ...(show !== prevShow && { show: show }),
            ...(uploadImage === true || prevImageId !== imageIdAsNumber ? { image: imageIdAsNumber } : {}),
        }

        try {
            // Mandar request para crear el juego
            await patchGameById(gameId, tokens?.access_token || '', requestBody);
            // Cerrar modal y mostrar mensaje de éxito
            await updateGamesData();
            closeModal();
            openModalMessage('success', 'Juego actualizado exitosamente.');
        } catch (error) {
            // Handle errors
            openModalMessage('error', 'Lo sentimos, ha ocurrido un error al actualizar el juego.');
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
    }, [prevImageId, tokens]);

    return (
        <>
            <form onSubmit={handleSubmit} id='createUserPanel'>
                <ThemeProvider theme={darkTheme}>
                    <Grid container direction='column' spacing={2} padding={'1rem'}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="name">Nombre</InputLabel>
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
                            <Button id='submit-mod-game' variant="contained" color="success" type="submit">Actualizar</Button>
                        </Grid>
                    </Grid>
                </ThemeProvider>
            </form>
        </>
    )
}
export default ModifyGamePanel;
