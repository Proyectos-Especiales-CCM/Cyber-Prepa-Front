import { AddStudentButton, CollapsedStudents } from ".."
import { Game } from "../../services/types";
import { ButtonGroupRow } from "../ButtonGroupRow";
import { EndPlayForAllButton } from "../EndPlayForAllButton";
import './CardExpander.css';
interface CardExpanderProps {
  cardGame: Game;
  shouldUpdate: boolean;
  onUpdated(): void,
}

const CardExpander: React.FC<CardExpanderProps> = ({ cardGame, shouldUpdate, onUpdated }) => {
  
  const showEndPlayForAllButton = Array.isArray(cardGame.plays) && cardGame.plays.length >= 1;

  return (
     <div className="cyber__card__expander">

          <i className="fa fa-close [ js-collapser ]"></i>

          <ButtonGroupRow>
            
            <AddStudentButton cardGame={cardGame}/>

            {showEndPlayForAllButton && (
              
              <EndPlayForAllButton cardGame={cardGame} />
              
            )}
            
          </ButtonGroupRow>
          
          <CollapsedStudents
            cardGame={cardGame}
            shouldUpdate={shouldUpdate}
            onUpdated={() => onUpdated}
          />
     </div>
  )
}

export default CardExpander
