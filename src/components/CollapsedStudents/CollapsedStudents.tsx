import { CollapsedStudentItem } from "..";
import { Game } from "../../services/types";

interface CollapsedStudentProps {
  cardGame: Game;
  isGameActive: boolean;
}

const CollapsedStudents: React.FC<CollapsedStudentProps> = ({ cardGame, isGameActive }) => {

  return (
    <div className="collapsed__students">
      
      <ul id={`cyber__student__list__${cardGame.id}`} className="container__dropzone">
        {typeof cardGame.plays === 'number' ? (
          <p>No estás autorizado para ver la data de los {cardGame.plays} jugadores</p>
        ) : (
          cardGame.plays.map((player) => (
            <CollapsedStudentItem key={player.id} player={player} cardGameId={cardGame.id} isGameActive={isGameActive} notices={player.notices} owedMaterials={player.owed_materials}/>
          ))
        )}
      </ul>

    </div>
  );
};

export default CollapsedStudents;
