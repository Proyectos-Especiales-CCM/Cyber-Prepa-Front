import { Button, FormControl, FormHelperText, Grid, Input, InputLabel, MenuItem, Select, Tooltip } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { createOwedMaterial } from '../../../services/rental/createOwedMaterial';
import { useAppContext } from '../../../store/appContext/useAppContext';
import { useGamesContext } from '../../../store/gamesContext/useGamesContext';
import { Help } from '@mui/icons-material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

interface CreateOwedMaterialPanelProps {
  openModalMessage: (severity: string, message: string) => void;
  closeModal: () => void;
  updateMaterialsData: () => Promise<void>;
}

export const CreateOwedMaterialPanel: React.FC<CreateOwedMaterialPanelProps> = ({ openModalMessage, closeModal, updateMaterialsData }) => {
  const { tokens, admin } = useAppContext();
  const { materials } = useGamesContext();

  const [materialId, setMaterialId] = useState<number>(0);
  const [amount, setAmount] = useState(0);
  const [studentId, setStudentId] = useState('');
  const [deliveryDeadline, setDeliveryDeadline] = useState<Dayjs | null>(null);

  // Checa si la fecha límite de entrega es válida
  const isDeadlineValid = () => {
    return deliveryDeadline && deliveryDeadline.isAfter(dayjs());
  };

  // funcion para mostrar feedback sobre la validez de la matrícula
  const displayHelperTextStudent = () => {
    if (studentId && !studentId.match(/^[Aa]\d{8}$/)) {
      return 'Matrícula inválida';
    }
    return '';
  };

  // funcion para mostrar feedback sobre la fecha límite de entrega
  const displayHelperTextDeadline = () => {
    if (deliveryDeadline && !isDeadlineValid()) {
      return 'Fecha límite de entrega inválida';
    }
    return '';
  };

  // Handle submit
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!admin) {
      openModalMessage('error', 'No tienes permiso para realizar esta acción.');
      return;
    }

    if (!materialId) {
      openModalMessage('error', 'Por favor, selecciona un material.');
      return;
    }

    if (amount <= 0) {
      openModalMessage('error', 'Por favor, ingresa una cantidad válida. (Mayor a 0)');
      return
    }

    if (deliveryDeadline && !isDeadlineValid()) {
      openModalMessage('error', 'Fecha límite de entrega inválida.');
      return;
    }

    if (!studentId) {
      openModalMessage('error', 'Por favor, ingresa una matrícula.');
      return;
    } else {
      if (!studentId.match(/^[Aa]\d{8}$/)) {
        openModalMessage('error', 'Matrícula inválida.');
        return;
      }
    }


    try {
      // Mandar request para crear el usuario
      await createOwedMaterial(materialId, amount, studentId.toLowerCase(), tokens?.access_token || '', deliveryDeadline?.toJSON());
      // Cerrar modal y mostrar mensaje de éxito
      await updateMaterialsData();
      closeModal();
      openModalMessage('success', 'Adeudo de Material creado exitosamente.');
    } catch (error) {
      // Handle errors
      openModalMessage('error', 'Lo sentimos, ha ocurrido un error al crear el Adeudo de material.');
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
                <InputLabel htmlFor="materialId">Material</InputLabel>
                <Select
                  labelId="materialId-label"
                  id="selected-materialId"
                  value={materialId}
                  onChange={(e) => setMaterialId(Number(e.target.value))}
                  label="materialId"
                >
                  {materials.map((material) => (
                    <MenuItem value={material.id} key={material.id}>
                      <span>{material.name}</span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="amount">Cantidad adeudada</InputLabel>
                <Input
                  id="amount"
                  type='number'
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </FormControl>
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="student">Matrícula del estudiante</InputLabel>
                <Input
                  id="student"
                  type='text'
                  autoComplete="off"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
                <FormHelperText error id="student-helper-text">{displayHelperTextStudent()}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={6} container alignItems="center" justifyContent="center">
              <FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    label="Fecha límite de entrega"
                    value={deliveryDeadline}
                    format='DD/MM/YYYY'
                    onChange={(newValue) => setDeliveryDeadline(newValue)}
                  />
                </LocalizationProvider>
                <FormHelperText error id="end-time-helper-text">{displayHelperTextDeadline()}</FormHelperText>
              </FormControl>
              <Tooltip title="Este día se sancionará al estudiante si no ha entregado el material el día anterior." arrow>
                <Help />
              </Tooltip>
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
