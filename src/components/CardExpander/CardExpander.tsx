import { AddStudentButton, CollapsedStudents } from ".."
import { Game } from "../../services/types";
import './CardExpander.css';

interface CardExpanderProps {
  cardGame: Game;
}

const CardExpander: React.FC<CardExpanderProps> = ({ cardGame }) => {
  return (
     <div className="cyber__card__expander">

          <i className="fa fa-close [ js-collapser ]"></i>
          
          <AddStudentButton cardGame={cardGame}/>
          
          <CollapsedStudents cardGame={cardGame} />
          
     </div>
  )
}

export default CardExpander
