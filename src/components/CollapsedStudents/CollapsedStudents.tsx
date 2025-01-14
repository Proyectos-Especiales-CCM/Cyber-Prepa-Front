import { useEffect, useState } from "react";
import { CollapsedStudentItem } from "..";
import { readGameById } from "../../services";
import { Game, Play } from "../../services/types";
import { SnackbarComponent } from "../SnackbarComponent";

interface CollapsedStudentProps {
  cardGame: Game;
  shouldUpdate: boolean;
  onUpdated(): void;
  isGameActive: boolean;
}

const CollapsedStudents: React.FC<CollapsedStudentProps> = ({ cardGame, shouldUpdate, onUpdated, isGameActive }) => {

  const [studentsData, setStudentsData] = useState<Play[] | number>(cardGame.plays);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [accessToken, setAccessToken] = useState<string>('');

  useEffect(() => {
    const tokensString = localStorage.getItem('tokens');
    if (tokensString) {
      const tokens = JSON.parse(tokensString);
      setAccessToken(tokens.access_token);
    }
  }, []);

  useEffect(() => {
    const fetchUpdatedGame = async () => {
      if (shouldUpdate) {
        try {
          const res = await readGameById(cardGame.id, accessToken)
          if (res && res.data) {
            setStudentsData(res.data.plays);
            onUpdated()
          }
        } catch (error) {
          setAlertMessage('Error actualizando la data del juego, porfavor refresca la página');
          setOpen(true);
        }
      }
    }
    if (shouldUpdate) {
      fetchUpdatedGame()
    }
  }, [shouldUpdate, cardGame.id, accessToken, onUpdated])

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div className="collapsed__students">
      
      <ul id={`cyber__student__list__${cardGame.id}`} className="container__dropzone">
        {typeof studentsData === 'number' ? (
          <p>No estás autorizado para ver la data de los {studentsData} jugadores</p>
        ) : (
          studentsData.map((player) => (
            <CollapsedStudentItem key={player.id} player={player} cardGameId={cardGame.id} isGameActive={isGameActive} notices={player.notices} owedMaterials={player.owed_materials}/>
          ))
        )}
      </ul>

      <SnackbarComponent
        open={open}
        onClose={handleClose}
        severity="warning"
        message={alertMessage}
      />
    </div>
  );
};

export default CollapsedStudents;
