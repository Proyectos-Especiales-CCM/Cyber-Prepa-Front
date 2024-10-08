import { initCardsFunctionality } from './initCardsFunctionality';
import { UserObject } from '../../store/appContext/types';
import React, { useEffect, useRef, useState } from 'react'
import { initCountdown } from './initCountdown';
import { CardExpander } from '..';
import { ImageCell } from '../Tables/CustomBodyCells';
import { Game } from '../../services/types';
import { patchPlayById, readGameById } from '../../services';
import { SnackbarComponent } from '../SnackbarComponent';
import './Card.css';

interface CardProps {
     cardGame: Game;
     user: UserObject | undefined;
     shouldUpdate: boolean,
     onUpdated(): void,
     sendMessage(cardGameId: number): void,
}

const Card: React.FC<CardProps> = ({ cardGame, user, shouldUpdate, onUpdated, sendMessage }) => {
     
     const [gameData, setGameData] = useState<Game>(cardGame);
     const [accessToken, setAccessToken] = useState<string>('');
     const cardsRef = useRef<HTMLDivElement>(null);
     const countdownRef = useRef<HTMLDivElement>(null);
     const [open, setOpen] = useState(false);
     const [alertMessage, setAlertMessage] = useState('');
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
     const [isDragOver, setIsDragOver] = useState(false);
     // Countdown status [AGOTADO,LIBRE,COUNTING]
     const [countdownStatus, setCountdownStatus] = useState('');


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
          const intervalId = initCountdown(gameData, countdownRef, setCountdownStatus);
      
          return () => {
               if (intervalId !== null) {
                    clearInterval(intervalId);
               }
          };
      }, [gameData]);

     useEffect(() => {
          const fetchUpdatedGame = async () => {
               if (shouldUpdate) {
                    try {
                         const res = await readGameById(gameData.id, accessToken)
                         if (res && res.data) { 
                              setGameData(res.data);
                         } else {
                              throw 401
                         }
                    } catch (err) {
                         setAlertMessage('Error actualizando la data del juego, porfavor refresca la página');
                         setOpen(true);
                    }
               }
          }
          
          if (shouldUpdate) {
               fetchUpdatedGame()
          }
     }, [shouldUpdate, cardGame.id, accessToken, gameData.id, user, onUpdated])

     const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
          if (reason === 'clickaway') {
            return;
          }
          setOpen(false);
     };

     const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          setIsDragOver(true)
     }

     const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault()
          setIsDragOver(false)
     }

     const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          setIsDragOver(false)
          const cardGameId = e.currentTarget.getAttribute('data-cardgameid')
          const dragDataString = e.dataTransfer.getData("application/json");
          const dragData = JSON.parse(dragDataString)
          try {
               if (cardGameId) {
                    await patchPlayById(parseInt(dragData.playerId), accessToken, { game: parseInt(cardGameId) });
                    //await deletePlayById(parseInt(dragData.playerId), accessToken);
                    // Check if not the same cardGameId as the origin drag student
                    // Check if new cardGame has expired students, else, end-game-for-all for that cardGame, then createPlay
                    //await createPlay(false, String(dragData.playerName), parseInt(cardGameId), accessToken);
                    sendMessage(parseInt(cardGameId))
               }
          } catch (error) {
               setAlertMessage('Error moviendo jugador, porfavor intenta de nuevo');
               setOpen(true);
          }
     }

     const getStatusClassName = (status: string) => {
          switch (status) {
            case 'AGOTADO':
              return 'agotado';
            case 'LIBRE':
              return 'libre';
            case 'ALMOST':
              return 'almost';
            default:
              return 'counting';
          }
     };

     return (
     
          <div 
               key = {gameData.id} 
               data-cardgameid={gameData.id}
               className={`cyber__card [ is-collapsed ] ${isDragOver ? 'card-highlight' : ''}`}
               onDragOver = {handleDragOver}
               onDragLeave = {handleDragLeave}
               onDrop = {handleDrop}
          >
               
               <div 
                    ref={cardsRef} 
                    id={gameData.name}
                    className={`cyber__card__inner [ js-expander ] ${countdownStatus} ${getStatusClassName(countdownStatus)}`} 
               >
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
                    <CardExpander
                         cardGame={gameData}
                         shouldUpdate={shouldUpdate}
                         onUpdated={() => onUpdated}
                         countdownStatus={countdownStatus}
                    />
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
