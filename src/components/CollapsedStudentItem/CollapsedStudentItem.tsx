import { Check, NotificationImportant, PriorityHigh, SportsBaseball } from "@mui/icons-material";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { IconButton, Input, Popover, Stack, Tooltip, Typography } from "@mui/material";
import { blue, purple } from "@mui/material/colors";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import copy from "copy-to-clipboard";
import { useCallback, useState } from "react";
import { EndPlayButton, SanctionButton } from "..";
import { returnOwedMaterial } from "../../services/rental/returnOwedMaterials";
import { Notice, OwedMaterial, Play } from "../../services/types";
import { useAppContext } from "../../store/appContext/useAppContext";
import ChangeGameButton from "../ChangeGameButton/ChangeGameButton";
import { SnackbarComponent } from "../SnackbarComponent";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: blue[700]
    },
    secondary: {
      main: purple[600]
    }
  },
});

interface CollapsedStudentItemProps {
  player: Play;
  cardGameId: number;
  isGameActive: boolean;
  notices: Notice[];
  owedMaterials: OwedMaterial[];
}

const CollapsedStudentItem: React.FC<CollapsedStudentItemProps> = ({ player, cardGameId, isGameActive, notices, owedMaterials }) => {
  const { tokens } = useAppContext();

  const [isDragging, setIsDragging] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severitySnackbar, setSeveritySnackbar] = useState<'success' | 'error'>('success');

  const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);

    const dragData = {
      playerId: player.id,
      playerName: player.student,
    };

    const dragDataString = JSON.stringify(dragData);

    e.dataTransfer.setData("application/json", dragDataString);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const owedMaterialId = formData.get('owed-material-id');
    const materialAmount = formData.get('material-amount');

    returnOwedMaterial(Number(owedMaterialId), Number(materialAmount), tokens?.access_token ?? '')
      .then(() => {
        setSeveritySnackbar('success');
        setAlertMessage('Material entregado con éxito');
        setOpenSnackbar(true);
      })
      .catch((error) => {
        console.error(error);
        setSeveritySnackbar('error');
        setAlertMessage('Error al entregar el material');
        setOpenSnackbar(true);
      });
  }, []);

  return (
    <div
      id={`${player.id}`}
      data-gameid={`${cardGameId}`}
      className={`student draggable ${isDragging ? "dragging" : ""}`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <ThemeProvider theme={darkTheme}>
        <Stack paddingLeft={1} direction="row" alignItems="center">
          <li style={{ textTransform: "capitalize" }}>{player.student}</li>
          <Tooltip title="Copiar">
            <IconButton onClick={() => copy(player.student)} size="small">
              <ContentPasteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <EndPlayButton player={player} cardGameId={cardGameId} isGameActive={isGameActive} />
          <SanctionButton player={player} cardGameId={cardGameId} />
          <ChangeGameButton player={player} />
        </Stack>
        {notices && notices.length > 0 || owedMaterials && owedMaterials.length > 0 ? (
          <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%" paddingX={1}>
            <Tooltip title="Existe una alerta para este jugador">
              <PriorityHigh color="warning" />
            </Tooltip>
            <Stack direction="row" spacing={1} alignItems="center">
              {owedMaterials.length > 0 &&
                <>
                  <IconButton aria-describedby={id} onClick={handleClick} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} size="small">
                    <SportsBaseball color="warning" />
                  </IconButton>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <Stack spacing={1} sx={{ padding: 1 }}>
                      {owedMaterials.map((owedMaterial) => {
                        const remaining = owedMaterial.amount - owedMaterial.delivered;
                        if (remaining <= 0) return null;
                        return (
                          <Stack direction="row" justifyContent="space-between" alignItems="center" key={owedMaterial.id}>
                            <Stack direction="row">
                              <Typography key={owedMaterial.material_name} marginRight={1}>
                                {owedMaterial.material_name}
                              </Typography>
                              <Tooltip title="Sin Entregar">
                                <Typography color="error" fontWeight="bold" marginRight={1}>
                                  {remaining}
                                </Typography>
                              </Tooltip>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                              <form onSubmit={onSubmit}>
                                <input type="hidden" value={owedMaterial.id} name="owed-material-id" />
                                <input type="hidden" value={owedMaterial.material} name="material-id" />
                                <Tooltip title="Material a entregar">
                                  <Input sx={{ width: "35px" }} type="number" placeholder="0" name="material-amount" />
                                </Tooltip>
                                <Tooltip title="Entregar">
                                  <IconButton sx={{ backgroundColor: 'success.main' }} size="small" type="submit">
                                    <Check />
                                  </IconButton>
                                </Tooltip>
                              </form>
                            </Stack>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Popover>
                </>
              }
              {notices.length > 0 &&
                <Tooltip title={`Este jugador tiene ${notices.length} ${notices.length > 1 ? 'llamadas' : 'llamada'} de atención`}>
                  <NotificationImportant color="warning" />
                </Tooltip>
              }
            </Stack>
          </Stack>
        ) : null}
        <SnackbarComponent
          open={openSnackbar}
          onClose={handleCloseSnackbar}
          severity={severitySnackbar}
          message={alertMessage}
        />
      </ThemeProvider>
    </div>
  );
};

export default CollapsedStudentItem;
