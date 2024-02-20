import { EndPlayButton, SanctionButton } from '..';
import { useState } from 'react';
import { Play } from '../../services/types';

interface CollapsedStudentItemProps {
  player: Play;
  cardGameId: number;
}

const CollapsedStudentItem: React.FC<CollapsedStudentItemProps> = ({ player, cardGameId }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    
    const dragData = {
      playerId: player.id,
      playerName: player.student,
    };

    const dragDataString = JSON.stringify(dragData)

    e.dataTransfer.setData("application/json", dragDataString);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false);
  };

  return (
    <div
      id={`${player.id}`}
      data-gameid={`${cardGameId}`}
      className={`student draggable ${isDragging ? 'dragging' : ''}`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <li>{player.student}</li>
      <EndPlayButton player={player} cardGameId={cardGameId} />
      <SanctionButton player={player} cardGameId={cardGameId} />
    </div>
  );
};

export default CollapsedStudentItem;