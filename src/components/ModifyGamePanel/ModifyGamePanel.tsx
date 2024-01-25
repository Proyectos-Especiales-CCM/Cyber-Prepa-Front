import { useState } from 'react';
import { Button, Grid, FormControl, InputLabel, Input, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import { useAppContext } from "../../store/appContext/appContext";
import { patchGameById } from '../../services';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
    prevFileRoute: string;
}

const ModifyGamePanel: React.FC<ModifyGamePanelProps> = ({ openModalMessage, closeModal, updateGamesData, gameId, prevName, prevShow, prevFileRoute }) => {
    const { tokens, admin } = useAppContext();
    const [name, setName] = useState(prevName);
    const [show, setShow] = useState(prevShow);
    const [fileRoute, setFileRoute] = useState(prevFileRoute);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShow(event.target.checked);
    };

    // Handle submit
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (!admin) {
            openModalMessage('error', 'No tienes permiso para realizar esta acción.');
            return;
        }

        // Request body
        const requestBody = {
            ...(name !== prevName && { name: name }),
            ...(show !== prevShow && { show: show }),
            ...(fileRoute !== prevFileRoute && { fileRoute: fileRoute }),
        }

        try {
            // Mandar request para crear el usuario
            await patchGameById(gameId, tokens?.access_token || '', requestBody);
            // Cerrar modal y mostrar mensaje de éxito
            await updateGamesData();
            closeModal();
            openModalMessage('success', 'Usuario actualizado exitosamente.');
        } catch (error) {
            // Handle errors
            openModalMessage('error', 'Lo sentimos, ha ocurrido un error al actualizar el usuario.');
            console.error('Error:', error);
        }
    };

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
                            <FormControl fullWidth>
                                <InputLabel htmlFor="file-route">Nueva imagen</InputLabel>
                                <Input
                                    id="file-route"
                                    aria-describedby="file-route-helper-text"
                                    type='text'
                                    autoComplete="off"
                                    value={fileRoute}
                                    onChange={(e) => setFileRoute(e.target.value)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl
                                sx={{ m: 3 }}
                            >
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={show} onChange={handleChange} name="show" />
                                        }
                                        label="Mostrar"
                                    />
                                </FormGroup>
                            </FormControl>
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
export default ModifyGamePanel;
