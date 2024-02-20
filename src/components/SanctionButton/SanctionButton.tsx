import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { createSanction } from "../../services";
import { Player } from "../../services/types";
import { Box, Typography } from "@mui/material";
import { createTheme } from '@mui/material/styles'
import CustomModal from "../Modal/Modal";
import { blue } from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


interface SanctionButtonProps {
  player: Player;
  cardGameId: number;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5733',
    },
    secondary: {
      main: blue[300],
    },
  },
})

const SanctionButton: React.FC<SanctionButtonProps> = ({ player, cardGameId }) => {
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs(Date.now()));
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs(Date.now()));
  const [cause, setCause] = useState("");


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

  const handlePerformSanction = async () => {
    try {
      await createSanction(
        player.id,
        cause,
        startTime,
        endTime,
        player.student,
        cardGameId,
        accessToken
      );
      setAlertMessage(`Jugador ${player.id} sancionado exitosamente.`);
      setOpen(true);
    } catch (error) {
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
            title="Llenar detalles de la sanción"
          >
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Causa de la sanción:</Typography>
              <input
                type="text"
                placeholder="Causa"
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Fecha y hora de inicio:</Typography>
              <DatePicker
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 2,
                }}
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Fecha y hora de fin:</Typography>
              <DatePicker
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 2,
                }}
                defaultValue={startTime}
                onChange={(newValue) => setStartTime(newValue)}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handlePerformSanction}>
                Confirmar sanción
              </Button>
            </Box>
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
