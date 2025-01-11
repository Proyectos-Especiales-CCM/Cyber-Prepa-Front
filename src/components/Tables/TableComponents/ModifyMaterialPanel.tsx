import { Button, FormControl, Grid2 as Grid, Input, InputLabel, TextareaAutosize } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { patchMaterialById } from '../../../services/rental/patchMaterialById';
import { useAppContext } from '../../../store/appContext/useAppContext';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

interface ModifyUserPanelProps {
  openModalMessage: (severity: string, message: string) => void;
  closeModal: () => void;
  updateUsersData: () => Promise<void>;
  materialId: number;
  prevName: string;
  prevAmount: number;
  prevDescrip?: string;
}

export const ModifyMaterialPanel: React.FC<ModifyUserPanelProps> = ({ openModalMessage, closeModal, updateUsersData, materialId, prevName, prevAmount, prevDescrip }) => {
  const { tokens, admin } = useAppContext();
  const [name, setName] = useState(prevName);
  const [amount, setAmount] = useState(prevAmount);
  const [description, setDescription] = useState(prevDescrip);

  // Handle submit
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!admin) {
      openModalMessage('error', 'No tienes permiso para realizar esta acción.');
      return;
    }

    // Create request body
    const requestBody = {
      ...(name !== prevName && { name: name }),
      ...(amount !== prevAmount && { amount: amount }),
      ...(description !== prevDescrip && { description: description }),
    };


    try {
      // Mandar request para crear el usuario
      await patchMaterialById(materialId, tokens?.access_token || '', requestBody);
      // Cerrar modal y mostrar mensaje de éxito
      await updateUsersData();
      closeModal();
      openModalMessage('success', 'Material actualizado exitosamente.');
    } catch (error) {
      // Handle errors
      openModalMessage('error', 'Lo sentimos, ha ocurrido un error al actualizar el material.');
      console.error('Error:', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} id='createMaterialPanel'>
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
