import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import "dayjs/locale/es";
import { Button, Grid, FormControl, InputLabel, Input, FormHelperText, TextField } from '@mui/material';
import { useAppContext } from "../../store/appContext/useAppContext";
import { createSanction } from '../../services';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

interface CreateSanctionPanelProps {
  openModalMessage: (severity: string, message: string) => void;
  closeModal: () => void;
  updateSanctionsData: () => Promise<void>;
}

const CreateSanctionPanel: React.FC<CreateSanctionPanelProps> = ({ openModalMessage, closeModal, updateSanctionsData }) => {
  const { tokens } = useAppContext();
  const [cause, setCause] = useState<string>('');
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [student, setStudent] = useState<string>('');

  // Checa si la matrícula es válida
  const studentRegex = /^[Aa]\d{8}$/;
  const isStudentValid = () => {
    return studentRegex.test(student);
  };

  // funcion para mostrar feedback sobre el correo electrónico
  const displayHelperTextStudent = () => {
    if (student && !isStudentValid()) {
      return 'Matrícula inválida';
    }
    return '';
  };

  // Checa si la fecha de fin de sanción es válida
  const isEndTimeValid = () => {
    return endTime && endTime.isAfter(dayjs());
  };

  // funcion para mostrar feedback sobre la fecha de fin de sanción
  const displayHelperTextEndTime = () => {
    if (endTime && !isEndTimeValid()) {
      return 'Fecha de fin de sanción inválida';
    }
    return '';
  };

  // Checa si la causa de la sanción es válida
  const isCauseValid = () => {
    return cause && cause.length > 0;
  };

  // funcion para mostrar feedback sobre la causa de la sanción
  const displayHelperTextCause = isCauseValid() ? '' : 'La causa de la sanción no puede estar vacía.';

  // Handle submit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isStudentValid()) {
      openModalMessage('error', 'Matrícula inválida.');
      return;
    } else if (!endTime || endTime.isBefore(dayjs())) {
      openModalMessage('error', 'Fecha de fin de sanción inválida.');
      return;
    } else if (!isCauseValid()) {
      openModalMessage('error', 'La causa de la sanción no puede estar vacía.');
      return;
    }

    try {
      await createSanction(tokens?.access_token ?? "", cause, endTime?.toJSON(), student.toLowerCase(),);
      updateSanctionsData();
      openModalMessage('success', 'Sanción creada exitosamente.');
      closeModal();
    } catch (error) {
      openModalMessage('error', 'No se pudo crear la sanción.');
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} id='createSanctionAdminPanel'>
        <ThemeProvider theme={darkTheme}>
          <Grid container direction='column' spacing={2} padding={'1rem'}>
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="student">Matrícula</InputLabel>
                <Input
                  id="student"
                  aria-describedby="student-helper-text"
                  type='text'
                  autoComplete="off"
                  value={student}
                  onChange={(e) => setStudent(e.target.value)}
                />
                <FormHelperText error id="student-helper-text">{displayHelperTextStudent()}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth>
                <TextField
                  id="cause-outlined-multiline-static"
                  label="Causa de la sanción"
                  multiline
                  rows={4}
                  value={cause}
                  onChange={(e) => setCause(e.target.value)}
                />
                <FormHelperText error id="cause-helper-text">{displayHelperTextCause}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    label="Fecha de fin de la sanción (Este día termina la sanción)"
                    value={endTime}
                    format='DD/MM/YYYY'
                    onChange={(newValue) => setEndTime(newValue)}
                  />
                </LocalizationProvider>
                <FormHelperText error id="end-time-helper-text">{displayHelperTextEndTime()}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="error" type="submit">Sancionar</Button>
            </Grid>
          </Grid>
        </ThemeProvider>
      </form>
    </>
  )
}
export default CreateSanctionPanel;
