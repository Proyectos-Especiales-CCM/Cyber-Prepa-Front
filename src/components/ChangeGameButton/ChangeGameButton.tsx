import { MoveUpOutlined } from '@mui/icons-material';
import { Alert, AlertColor, IconButton, Menu, MenuItem, Snackbar, Tooltip } from "@mui/material";
import { useState } from "react";
import { patchPlayById } from "../../services";
import { Play } from "../../services/types";
import { useAppContext } from "../../store/appContext/useAppContext";
import { useGamesContext } from "../../store/gamesContext/useGamesContext";

function ChangeButton({ handleClick }: { handleClick: React.MouseEventHandler<HTMLButtonElement> }) {
  return (
    <Tooltip title="Cambiar de juego">
      <IconButton
        size='medium'
        onClick={handleClick}
        sx={{ bgcolor: 'secondary.main' }}
      >
        <MoveUpOutlined />
      </IconButton>
    </Tooltip>
  )
}

interface ChangeGameButtonProps {
  player: Play
}

export default function ChangeGameButton({ player }: ChangeGameButtonProps) {
  const { games } = useGamesContext();
  const { tokens } = useAppContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [alertMessage, setAlertMessage] = useState<string>("");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const showAlert = (message: string, severityLevel: AlertColor) => {
    setAlertMessage(message);
    setSeverity(severityLevel);
    setOpenSnackbar(true);
  };

  const handleChangeGamePlay = async (newGame: number) => {
    try {
      if (!tokens?.access_token) {
        showAlert(`Se agotó el tiempo de la sesión del usuario.`, "error");
        return;
      }
      await patchPlayById(player.id, tokens.access_token ?? '', { game: newGame });
      showAlert(`Juego del estudiante ${player.student} cambiado de juego exitosamente.`, "success");
    } catch (error) {
      showAlert(`Error cambiando el juego.`, "warning");
    }
  };

  const handleCloseSuccess = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <ChangeButton handleClick={handleClick} />

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {games
          .filter((game) => game.id !== player.game)
          .map((game) => (
            <MenuItem key={game.id} onClick={() => {
              handleChangeGamePlay(game.id);
              handleClose();
            }}>
              {game.name}
            </MenuItem>
          ))}
      </Menu>

      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={handleCloseSuccess}>
        <Alert
          onClose={handleCloseSuccess}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
