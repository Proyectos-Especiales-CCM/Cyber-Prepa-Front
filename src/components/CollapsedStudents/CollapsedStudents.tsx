import { CollapsedStudentItem } from "..";
import { useState } from "react";
import { Game, Play } from "../../services/types";

interface CollapsedStudentProps {
  cardGame: Game;
}

const CollapsedStudents: React.FC<CollapsedStudentProps> = ({ cardGame }) => {
  const [playsData, setPlaysData] = useState<Play[] | number>(cardGame.plays);

  return (
    <div className="collapsed__students">
      <ul id={`cyber__student__list__${cardGame.id}`} className="container__dropzone">
        {typeof playsData === 'number' ? (
          <p>No plays data available</p>
        ) : (
          playsData.map((_player) => (
            <CollapsedStudentItem key={_player.id} player={_player} cardGameId={cardGame.id} />
          ))
        )}
      </ul>
    </div>
  );
};

export default CollapsedStudents;
