import { Rule } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";
import { patchPlayById } from "../../services";
import { Play } from "../../services/types";
import { useAppContext } from "../../store/appContext/useAppContext";

interface EndPlayButtonProps {
  player: Play;
  cardGameId: number;
  isGameActive: boolean;
}


const EndPlayButton: React.FC<EndPlayButtonProps> = ({ player, cardGameId, isGameActive }) => {

  const { tokens } = useAppContext();
  const [open, setOpen] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleEndPlay = async () => {
    try {
      await patchPlayById(player.id, tokens?.access_token || '', { ended: true });
      setAlertMessage(`Juego del estudiante ${player.student} terminado exitosamente.`);
      setOpenSuccess(true);
    } catch (error) {
      setAlertMessage(`Error terminando el juego.`);
      setOpen(true);
    }
  };

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleCloseSuccess = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccess(false);
  };


  return (
    <div className="end-play-form" id={`end-play-form-${player.id}`}>

      <input type="hidden" name="student_id" value={`${player.id}`} />
      <input type="hidden" name="game_id" value={`${cardGameId}`} />


      <Tooltip title="Terminar juego para el jugador">
        <IconButton
          size="large"
          onClick={handleEndPlay}
          disabled={!isGameActive}
          sx={{ bgcolor: 'primary.main' }}
        >
          <Rule />
        </IconButton>
      </Tooltip>

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

      <Snackbar open={openSuccess} autoHideDuration={4000} onClose={handleCloseSuccess}>
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default EndPlayButton
