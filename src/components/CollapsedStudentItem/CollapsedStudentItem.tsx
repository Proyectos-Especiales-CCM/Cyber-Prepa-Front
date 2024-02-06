import { EndPlayButton, SanctionButton } from '..'
import { Player } from '../../services/types';

interface CollapsedStudentItemProps {
  player: Player,
  cardGameId: number;
}

const CollapsedStudentItem: React.FC<CollapsedStudentItemProps> = ({ player, cardGameId }) => {
  
  return (
     <div id={`${player.id}`} data-gameid={`${cardGameId}`} className="student draggable" draggable="true">
          <li>{player.student}</li>
          <EndPlayButton player={player} cardGameId={cardGameId}/>
          <SanctionButton player={player} cardGameId={cardGameId}/>
     </div>
  )
}

export default CollapsedStudentItem


