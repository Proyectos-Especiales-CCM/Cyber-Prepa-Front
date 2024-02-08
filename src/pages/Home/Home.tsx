import { useAppContext } from "../../store/appContext/appContext";
import React, { useState, useCallback, useEffect } from 'react';
import { getGamesData } from "./getGames";
import { Card } from "../../components";
import { Game } from "../../services/types";
import './Home.css';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const Home = () => {
  const { user, tokens } = useAppContext();
  const [gamesData, setGamesData] = useState<Game[] | undefined>([]);
  const [forceRender, setForceRender] = useState(false);
  const [socketUrl, setSocketUrl] = useState('ws://172.174.255.29/ws/updates/');
  const [messageHistory, setMessageHistory] = useState([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));

      const data = JSON.parse(lastMessage.data);
      const message = data.message;
      const sender = data.sender;

      if (sender !== user && message === 'Games updated') {
        setForceRender((prev) => !prev);
      }
    }
  }, [lastMessage, setMessageHistory, user]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGamesData(user, tokens);
        setGamesData(data);
      } catch (error) {
        console.error("Error fetching games: ", error);
      }
    };

    fetchData();
  }, [user, tokens, forceRender]);


  // ------------- MAIN RENDER ------------- //
  return (
    <div className="cyber__wrapper">
      <div className="cyber__cards" id="cyberCards">
        
        {Array.isArray(gamesData)
          ? gamesData.map((game) => (
            <Card key={game.id} cardGame={game} user={user} />
          ))
          : null
        }

      </div>
    </div>
  );
}

export default Home;
