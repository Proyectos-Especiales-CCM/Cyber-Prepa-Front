import { Button, FormControl, Grid, Input, InputLabel, TextareaAutosize } from '@mui/material';
import { useState } from 'react';
import { useAppContext } from '../../../store/appContext/useAppContext';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createMaterial } from '../../../services/rental/createMaterial';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

interface CreateUserPanelProps {
  openModalMessage: (severity: string, message: string) => void;
  closeModal: () => void;
  updateMaterialsData: () => Promise<void>;
}

export const CreateMaterialPanel: React.FC<CreateUserPanelProps> = ({ openModalMessage, closeModal, updateMaterialsData }) => {
  const { tokens, admin } = useAppContext();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');

  // Handle submit
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!admin) {
      openModalMessage('error', 'No tienes permiso para realizar esta acción.');
      return;
    }

    if (name === '') {
      openModalMessage('error', 'Por favor, ingresa un nombre para el material.');
      return;
    }

    if (amount <= 0) {
      openModalMessage('error', 'Por favor, ingresa una cantidad válida. (Mayor a 0)');
      return
    }

    try {
      // Mandar request para crear el usuario
      await createMaterial(name, amount, tokens?.access_token || '', description);
      // Cerrar modal y mostrar mensaje de éxito
      await updateMaterialsData();
      closeModal();
      openModalMessage('success', 'Material creado exitosamente.');
    } catch (error) {
      // Handle errors
      openModalMessage('error', 'Lo sentimos, ha ocurrido un error al crear el material.');
      console.error('Error:', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} id='createUserPanel'>
        <ThemeProvider theme={darkTheme}>
          <Grid container spacing={2}>
            <Grid size={8}>
              <FormControl fullWidth>
                <InputLabel htmlFor="name">Nombre del material</InputLabel>
                <Input
                  id="name"
                  type='text'
                  autoComplete="off"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid size={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="amount">Cantidad en existencia</InputLabel>
                <Input
                  id="amount"
                  type='number'
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </FormControl>
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth>
                <TextareaAutosize
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  minRows={3}
                  maxRows={6}
                  placeholder="Descripción del material (Opcional)"
                  style={{ fontFamily: 'inherit', padding: '8px 12px', lineHeight: '1.5', fontSize: '0.875rem' }}
                />
              </FormControl>
            </Grid>
            <Grid size={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="success" type="submit">Añadir</Button>
            </Grid>
          </Grid>
        </ThemeProvider>
      </form>
    </>
  )
}
