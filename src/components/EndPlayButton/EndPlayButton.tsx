import Button from "@mui/material/Button";
import { patchPlayById } from "../../services";
import { Play } from "../../services/types";
import { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface EndPlayButtonProps {
  player: Play;
  cardGameId: number;
  isGameActive: boolean;
}


const EndPlayButton: React.FC<EndPlayButtonProps> = ({ player, cardGameId, isGameActive }) => {

  const [open, setOpen] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  useEffect(() => {
     const tokensString = localStorage.getItem('tokens');
     if (tokensString) {
       const tokens = JSON.parse(tokensString);
       setAccessToken(tokens.access_token);
     }
   }, []);
  
  useEffect(() => {
     const tokensString = localStorage.getItem('tokens');
     if (tokensString) {
       const tokens = JSON.parse(tokensString);
       setAccessToken(tokens.access_token);
     }
   }, []);

  const handleEndPlay = async () => {
    try {
      await patchPlayById(player.id, accessToken ?? '', { ended: true });
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


      <Button 
        variant="contained" 
        onClick={handleEndPlay} 
        sx={{ width: 120 }} 
        disabled={!isGameActive}
      >
        Finalizar juego
      </Button>

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
