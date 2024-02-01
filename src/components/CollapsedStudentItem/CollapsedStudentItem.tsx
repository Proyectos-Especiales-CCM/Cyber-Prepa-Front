import { EndPlayButton, SanctionButton } from '..'
import { game } from '../../pages/Home/types';

interface CollapsedStudentItemProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  player: any,
  cardGameId: number;
}

const CollapsedStudentItem: React.FC<CollapsedStudentItemProps> = ({ player, cardGameId }) => {
  return (
     <div id={`${player.id}`} data-gameid={`${cardGameId}`} className="student draggable" draggable="true">
          <li>{player.name}</li>
          <EndPlayButton player={player} cardGameId={cardGameId}/>
          <SanctionButton player={player}/>
     </div>
  )
}

export default CollapsedStudentItem
