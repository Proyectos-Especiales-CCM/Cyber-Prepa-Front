import { game } from "../../pages/Home/types";

interface EndPlayButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  player: any;
  cardGameId: number;
}

const EndPlayButton: React.FC<EndPlayButtonProps> = ({ player, cardGameId }) => {
  return (
    <form className="end-play-form" id={`end-play-form-${player.id}`}>
      <input type="hidden" name="student_id" value={`${player.id}`} />
      <input type="hidden" name="game_id" value={`${cardGameId}`} />
      <button type="submit" 
              className="btn btn-success">End Play
      </button>
    </form>
  )
}

export default EndPlayButton
