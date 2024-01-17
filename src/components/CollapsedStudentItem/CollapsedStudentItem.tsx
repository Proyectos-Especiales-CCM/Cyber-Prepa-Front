import { EndPlayButton, SanctionButton } from '..'
import { game } from '../../pages/Home/types';

interface CollapsedStudentItemProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  player: any,
  cardGame: game;
}

const CollapsedStudentItem: React.FC<CollapsedStudentItemProps> = ({ player, cardGame }) => {
  return (
     <div id={`${player.id}`} data-gameid={`${cardGame.id}`} className="student draggable" draggable="true">
          <li>{player.name}</li>
          <EndPlayButton player={player} cardGame={cardGame}/>
          <SanctionButton player={player}/>
     </div>
  )
}

export default CollapsedStudentItem
