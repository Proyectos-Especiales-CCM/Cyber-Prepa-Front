import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import copy from "copy-to-clipboard";
import { useState } from "react";
import { EndPlayButton, SanctionButton } from "..";
import { Play } from "../../services/types";
import ChangeGameButton from "../ChangeGameButton/ChangeGameButton";
import { blue, purple } from "@mui/material/colors";

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
}

const CollapsedStudentItem: React.FC<CollapsedStudentItemProps> = ({ player, cardGameId, isGameActive }) => {
  const [isDragging, setIsDragging] = useState(false);

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
        <EndPlayButton player={player} cardGameId={cardGameId} isGameActive={isGameActive} />
        <SanctionButton player={player} cardGameId={cardGameId} />
        <ChangeGameButton player={player} />
      </ThemeProvider>
    </div>
  );
};

export default CollapsedStudentItem;
