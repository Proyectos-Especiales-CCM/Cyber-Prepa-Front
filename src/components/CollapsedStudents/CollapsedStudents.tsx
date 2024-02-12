import { CollapsedStudentItem } from "..";
import { useEffect, useMemo, useState } from "react";
import useWebSocket from 'react-use-websocket';
import { Game, Play } from "../../services/types";
import { readGameById, readPlayById } from "../../services";

interface CollapsedStudentProps {
  cardGame: Game;
}

const CollapsedStudents: React.FC<CollapsedStudentProps> = ({ cardGame }) => {
  const [socketUrl] = useState('ws://172.174.255.29/ws/updates/');
  const { lastMessage } = useWebSocket(socketUrl);
  const [playsData, setPlaysData] = useState<Play[] | number>(cardGame.plays);
  const [forceRender, setForceRender] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');

  useEffect(() => {
    const tokensString = localStorage.getItem('tokens');
    if (tokensString) {
      const tokens = JSON.parse(tokensString);
      setAccessToken(tokens.access_token);
    }
  }, []);
  
  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data);
      const message = data.message;

      if (message === 'Plays updated') {
        const gameId = data['info'];
        if (cardGame.id === gameId) {
          console.log("should only print once", gameId)

          readGameById(gameId, accessToken)
            .then((response) => {
              
              if (response.status === 200) {
                const newPlaysData = response.data[gameId];
                console.log(newPlaysData)
                
              }
            })
            .catch((error) => {
              console.error('Error updating game:', error);
            })
          
          setForceRender((prev) => !prev);
        }
      }
    }
  }, [lastMessage, playsData]);

  return (
    <div className="collapsed__students">
      <ul id={`cyber__student__list__${cardGame.id}`} className="container__dropzone">
        {typeof playsData === 'number' ? (
          <p>No plays data available</p>
        ) : (
          playsData.map((_player) => (
            <CollapsedStudentItem key={_player.id} player={_player} cardGameId={cardGame.id} />
          ))
        )}
      </ul>
    </div>
  );
};

export default CollapsedStudents;
