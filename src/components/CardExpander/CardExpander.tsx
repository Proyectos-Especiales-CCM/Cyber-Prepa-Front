import { AddStudentButton, CollapsedStudents } from ".."
import { game } from "../../pages/Home/types";
import './CardExpander.css';

interface CardExpanderProps {
  cardGame: game;
}

const CardExpander: React.FC<CardExpanderProps> = ({ cardGame }) => {
  return (
     <div className="cyber__card__expander">

          <i className="fa fa-close [ js-collapser ]"></i>
          
          <AddStudentButton cardGame={cardGame}/>

          <CollapsedStudents cardGame={cardGame}/>
     </div>
  )
}

export default CardExpander
