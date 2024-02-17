import { initCardsFunctionality } from './initCardsFunctionality';
import { UserObject } from '../../store/appContext/types';
import React, { useEffect, useRef, useState } from 'react'
import { initCountdown } from './initCountdown';
import { CardExpander } from '..';
import { ImageCell } from '../Tables/CustomBodyCells';
import { Game } from '../../services/types';
import { readGameById } from '../../services';
import { SnackbarComponent } from '../SnackbarComponent';
import './Card.css';

interface CardProps {
     cardGame: Game;
     user: UserObject | undefined;
     shouldUpdate: boolean,
     onUpdated(): void,
}

const Card: React.FC<CardProps> = ({ cardGame, user, shouldUpdate, onUpdated }) => {
     
     const [gameData, setGameData] = useState<Game>(cardGame);
     const [accessToken, setAccessToken] = useState<string>('');
     const cardsRef = useRef<HTMLDivElement>(null);
     const countdownRef = useRef<HTMLDivElement>(null);
     const [open, setOpen] = useState(false);
     const [alertMessage, setAlertMessage] = useState('');

     useEffect(() => {
       const tokensString = localStorage.getItem('tokens');
       if (tokensString) {
         const tokens = JSON.parse(tokensString);
         setAccessToken(tokens.access_token);
       }
     }, []);
     
     useEffect(() => {
          if (user !== undefined) {
               initCardsFunctionality(cardsRef)
          }
     }, [user]);
     
     useEffect(() => {
          initCountdown(cardGame, countdownRef);
     }, [cardGame])

     useEffect(() => {
          const fetchUpdatedGame = async () => {
               if (shouldUpdate) {
                    try {
                         const res = await readGameById(gameData.id, accessToken)
                         if (res && res.data) { 
                              setGameData(res.data);
                         }
                         onUpdated()
                    } catch (error) {
                         // console.error("Error: ", error)
                         setAlertMessage('Error actualizando la data del juego, porfavor refresca la página');
                         setOpen(true);
                    }
               }
          }
          if (shouldUpdate) {
               fetchUpdatedGame()
          }
     }, [shouldUpdate, cardGame.id, accessToken, onUpdated, gameData.id])

     const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
          if (reason === 'clickaway') {
            return;
          }
          setOpen(false);
     };
     
     return (
     
          <div key={gameData.id} className="cyber__card [ is-collapsed ]">
               
               <div ref={cardsRef} id={gameData.name} className="cyber__card__inner [ js-expander ]">

                    <span>{gameData.name}</span><br />

                    <div id={`cyber__game__players__count__${gameData.id}`}>

                         <span>
                              {Array.isArray(gameData.plays) ? 
                                   (gameData.plays.length == 1 ? `1 jugador` : `${gameData.plays.length} jugadores`)  :
                                   (gameData.plays == 1 ? `1 jugador` : `${gameData.plays} jugadores`)
                              }
                         </span><br />
                         
                         <ImageCell
                              value={gameData.image ? `${gameData.image}` : "/media/images/game.png"}
                              style={{ width: '150px', height: 'auto' }}
                         />
                         
                         <div className="remaining__time">
                              <p ref={countdownRef} id={`cyber__countdown__${gameData.id}`}></p>
                         </div>
                    </div>
               </div>

               {user !== undefined ? (
                    <CardExpander cardGame={gameData}/>
               ) : null}

               <SnackbarComponent
                    open={open}
                    onClose={handleClose}
                    severity="warning"
                    message={alertMessage}
               />
          </div>    
     )
}

export default Card;
