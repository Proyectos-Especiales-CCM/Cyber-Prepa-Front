import { EndPlayButton, SanctionButton } from "..";
import { useState } from "react";
import { Play } from "../../services/types";
import { Stack } from "@mui/material";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import copy from "copy-to-clipboard";

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
      <Stack direction="row" spacing={1}>
        <li>{player.student}</li>
        <button onClick={() => copy(player.student)}>
          <ContentPasteIcon />
        </button>
      </Stack>
      <EndPlayButton player={player} cardGameId={cardGameId} isGameActive={isGameActive} />
      <SanctionButton player={player} cardGameId={cardGameId} />
    </div>
  );
};

export default CollapsedStudentItem;
