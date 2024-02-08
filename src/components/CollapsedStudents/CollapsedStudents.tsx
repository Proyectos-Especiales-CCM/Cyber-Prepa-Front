import { useAppContext } from "../../store/appContext/appContext";
import { CollapsedStudentItem, ScrollButtons } from "..";
import { readGameById } from "../../services";
import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Game, Play, Player } from "../../services/types";

interface CollapsedStudentProps {
  cardGame: Game;
}

const CollapsedStudents: React.FC<CollapsedStudentProps> = ({ cardGame }) => {
  const [socketUrl] = useState('ws://172.174.255.29/ws/updates/');
  const { user, tokens } = useAppContext();
  const [playsData, setPlaysData] = useState<Play[] | number>(cardGame.plays);
  const { lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      console.log('hello')
    }
  }, [readyState]);

  useEffect(() => {
    const fetchData = async() => {    
      if (lastMessage !== null) {
        const data = JSON.parse(lastMessage.data);
        const message = data['message'];
        const sender = data['sender'];

        if (sender !== user) {
          console.log('a')
          if (user !== undefined) {
            console.log('b')
            if (message === 'Plays updated') {
              console.log('c')
              const updateData = await readGameById(data['info'], tokens?.access_token);
              setPlaysData(updateData.data[0].plays);
            }
          }
        }
      }
    }
    fetchData()
  }, [lastMessage, user, tokens]);

  useEffect(() => {
    setPlaysData(cardGame.plays);
  }, [cardGame.plays]);

  return (
    <div className="collapsed__students">
      <ul id={`cyber__student__list__${cardGame.id}`} className="container__dropzone">
        {Array.isArray(playsData)
          ? playsData.map((_player) => (
              <CollapsedStudentItem key={_player.id} player={_player} cardGameId={cardGame.id} />
            ))
          : null}
      </ul>
      <ScrollButtons />
    </div>
  );
};

export default CollapsedStudents;
