import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import { createSanction } from "../../services";
import { Player } from "../../services/types";
import { useEffect, useState } from "react";
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

  const handleSanction = async () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
     const tokensString = localStorage.getItem('tokens');
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
        accessToken,
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
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div className="sanction-form" id={`sanction-form-${player.id}`}>
      <input type="hidden" name="student_id" value={`${player.id}`} />

      <Button variant="contained" onClick={handleSanction}>
        Sancionar jugador
      </Button>

      <CustomModal
        openModal={modalOpen}
        handleCloseModal={handleCloseModal}
        title="Llenar detalles de la sanción"
      >
        <input
          type="text"
          placeholder="Cause"
          value={cause}
          onChange={(e) => setCause(e.target.value)}
        />
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(new Date(e.target.value))}
        />
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(new Date(e.target.value))}
        />

        <Button variant="contained" onClick={handlePerformSanction}>
          Confirmar sanción
        </Button>
      </CustomModal>

      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}


export default SanctionButton;