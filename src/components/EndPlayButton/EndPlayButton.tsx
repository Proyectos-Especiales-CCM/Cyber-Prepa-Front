import { game } from "../../pages/Home/types";

interface EndPlayButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  player: any;
  cardGame: game;
}

const EndPlayButton: React.FC<EndPlayButtonProps> = ({ player, cardGame }) => {
  return (
    <form className="end-play-form" id={`end-play-form-${player.id}`}>
      <input type="hidden" name="student_id" value={`${player.id}`} />
      <input type="hidden" name="game_id" value={`${cardGame.id}`} />
      <button type="submit" 
              className="btn btn-success">End Play
      </button>
    </form>
  )
}

export default EndPlayButton
