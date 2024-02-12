import { useAppContext } from "../../store/appContext/appContext";
import { useState, useEffect, useMemo } from 'react';
import { getGamesData } from "./getGames";
import { Card } from "../../components";
import { Game } from "../../services/types";
import './Home.css';
import useWebSocket from 'react-use-websocket';

const Home = () => {
  const { user, tokens } = useAppContext();
  const [gamesData, setGamesData] = useState<Game[]>([]);
  const [forceRender, setForceRender] = useState(false);
  const [socketUrl] = useState('ws://172.174.255.29/ws/updates/');
  const { lastMessage } = useWebSocket(socketUrl);

  const updatedGamesData = useMemo(() => {
    if (!lastMessage) return gamesData;
    const data = JSON.parse(lastMessage.data);
    const message = data.message;
  
    if (message === 'Games updated') {
      setForceRender((prev) => !prev);
      return gamesData;
    }
  
    if (message === 'Plays updated') {
      console.log('changed: ', data['info'])
      const gameId = data['info'];
      return gamesData.map((game) => {
        if (game.id === gameId) {
          return {
            ...game,
          };
        }
        return game;
      });
    }
  
    return gamesData;
  }, [lastMessage]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGamesData(user, tokens);
        if (data) {
          setGamesData(data);
        }
      } catch (error) {
        console.error("Error fetching games: ", error);
      }
    };

    fetchData();
  }, [user, tokens, forceRender]);

  useEffect(() => {
    setGamesData(updatedGamesData);
  }, [updatedGamesData]);


  return (
    <div className="cyber__wrapper">
      <div className="cyber__cards" id="cyberCards">
        
        {Array.isArray(gamesData)
          ? gamesData.map((game) => (
            <Card key={game.id} cardGame={game} user={user} />
          ))
          : "No hay juegos registrados."
        }

      </div>
    </div>
  );
}

export default Home;
