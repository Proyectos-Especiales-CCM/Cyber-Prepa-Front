import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { createSanction } from "../../services";
import { Player } from "../../services/types";
import { DateTimePicker } from "@mui/lab";
import { Box, Typography } from "@mui/material";
import CustomModal from "../Modal/Modal";

interface SanctionButtonProps {
  player: Player;
  cardGameId: number;
}

const SanctionButton: React.FC<SanctionButtonProps> = ({ player, cardGameId }) => {
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [cause, setCause] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

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
        startTime as Date,
        endTime as Date,
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
    <div className="sanction-form" id={`sanction-form-${player.id}`}>
      <input type="hidden" name="student_id" value={`${player.id}`} />

      <Button variant="contained" onClick={handleSanction} sx={{ width: 120 }}>
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
            style={{ width: "100%", padding: "8px", boxSizing: "border-box", mt: 1 }}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Fecha y hora de inicio:</Typography>
          <DateTimePicker
            value={startTime}
            onChange={(newValue) => setStartTime(newValue)}
            renderInput={(params) => <input {...params} style={{ width: "100%", padding: "8px", boxSizing: "border-box", mt: 1 }} />}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Fecha y hora de fin:</Typography>
          <DateTimePicker
            value={endTime}
            onChange={(newValue) => setEndTime(newValue)}
            renderInput={(params) => <input {...params} style={{ width: "100%", padding: "8px", boxSizing: "border-box", mt: 1 }} />}
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
  );
};

export default SanctionButton;
