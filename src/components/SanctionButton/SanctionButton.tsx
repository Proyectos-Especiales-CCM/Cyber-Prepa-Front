import React, { useEffect, useState } from "react";
import "dayjs/locale/es";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { createSanction, patchPlayById } from "../../services";
import { Play } from "../../services/types";
import { FormControl, FormHelperText, Grid2 as Grid, TextField } from "@mui/material";
import { createTheme } from '@mui/material/styles'
import CustomModal from "../Modal/Modal";
import { blue } from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


interface SanctionButtonProps {
  player: Play;
  cardGameId: number;
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF5733',
    },
    secondary: {
      main: blue[300],
    },
  },
})

const SanctionButton: React.FC<SanctionButtonProps> = ({ player }) => {
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [cause, setCause] = useState<string>("");

  // Checa si la fecha de fin de sanción es válida
  const isEndTimeValid = () => {
    return endTime && endTime.isAfter(dayjs());
  };

  // funcion para mostrar feedback sobre la fecha de fin de sanción
  const displayHelperTextEndTime = isEndTimeValid() ? '' : 'Fecha de fin de sanción inválida.';

  // Checa si la causa de la sanción es válida
  const isCauseValid = () => {
    return cause && cause.length > 0;
  };

  // funcion para mostrar feedback sobre la causa de la sanción
  const displayHelperTextCause = isCauseValid() ? '' : 'La causa de la sanción no puede estar vacía.';

  const handleSanction = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const tokensString = localStorage.getItem("tokens");
    if (tokensString) {
      const tokens = JSON.parse(tokensString);
      setAccessToken(tokens.access_token);
    }
  }, []);

  const handlePerformSanction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!cause || cause.length === 0) {
      setAlertMessage('La causa de la sanción no puede estar vacía.');
      setOpen(true);
      return;
    }

    if (!endTime || endTime.isBefore(dayjs())) {
      setAlertMessage('Fecha de fin de sanción inválida.');
      setOpen(true);
      return;
    }
    
    try {
      if (!accessToken) {
        throw new Error("No access token found");
      }
      
      await createSanction(
        accessToken,
        cause ?? "",
        endTime.toJSON(),
        player.student,
        player.id,
      );
      await patchPlayById(player.id, accessToken, { ended: true });
      setAlertMessage(`Jugador ${player.id} sancionado exitosamente.`);
      setOpen(true);
    } catch (error) {
      console.log(error);
      setAlertMessage(`Error al sancionar jugador.`);
      setOpen(true);
    } finally {
      setModalOpen(false);
    }
  };

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <div className="sanction-form" id={`sanction-form-${player.id}`}>
          <input type="hidden" name="student_id" value={`${player.id}`} />

          <Button variant="contained"
            color="primary"
            onClick={handleSanction}
            sx={{ width: 120 }}>
            Sancionar jugador
          </Button>

          <CustomModal
            openModal={modalOpen}
            handleCloseModal={handleCloseModal}
            title={`Llenar detalles de la sanción para ${player.student}`}
          >
            <form onSubmit={handlePerformSanction} id='createSanctionPanel'>
              <Grid container direction='column' spacing={2} padding={'1rem'}>
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
                    <FormHelperText error id="end-time-helper-text">{displayHelperTextEndTime}</FormHelperText>
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
                <Grid size={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" color="error" type="submit">Sancionar</Button>
                </Grid>
              </Grid>
            </form>
          </CustomModal>

          <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
              {alertMessage}
            </Alert>
          </Snackbar>
        </div>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default SanctionButton;
