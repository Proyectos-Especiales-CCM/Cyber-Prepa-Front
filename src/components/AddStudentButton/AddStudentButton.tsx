import { game } from "../../pages/Home/types";

interface AddStudentProps {
     cardGame: game;
}

const AddStudentButton: React.FC<AddStudentProps> = ({ cardGame }) => {
  return (
     <form className="" id={`add-student-game-${cardGame.id}`}>
          
          <input type="hidden" name="game_id" value={`${cardGame.id}`} />

          <input type="text" className="" name="student_id" placeholder="ID estudiante" aria-label="ID estudiante" aria-describedby="basic-addon2" />

          <div className="">

               <button className="" 
                    type="submit">Agregar estudiante
               </button>
          </div>
     </form>
  )
}

export default AddStudentButton
