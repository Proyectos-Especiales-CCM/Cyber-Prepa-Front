import { initCardsFunctionality } from './initCardsFunctionality';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { initCountdown } from './initCountdown';
import { CardExpander } from '..';
import { Game } from '../../services/types';
import { completeImageUrl, patchPlayById, readGameById } from '../../services';
import { SnackbarComponent } from '../SnackbarComponent';
import './Card.css';
import { useAppContext } from '../../store/appContext/useAppContext';

interface CardProps {
     cardGame: Game;
     onUpdate(): void;
     sendMessage(cardGameId: number): void,
}

const Card: React.FC<CardProps> = ({ cardGame, onUpdate, sendMessage }) => {
     
     const { tokens, user } = useAppContext();
     const [gameData, setGameData] = useState<Game>(cardGame);
     const cardsRef = useRef<HTMLDivElement>(null);
     const countdownRef = useRef<HTMLDivElement>(null);
     const [open, setOpen] = useState(false);
     const [alertMessage, setAlertMessage] = useState('');
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
     const [isDragOver, setIsDragOver] = useState(false);
     // Countdown status [AGOTADO,LIBRE,COUNTING]
     const [countdownStatus, setCountdownStatus] = useState('');
     // cardRef to insert inline styles to avoid CSS conflicts with driver.js
     const cardRef = useRef<HTMLDivElement>(null);

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

     const fetchUpdatedGame = useCallback(async () => {
          try {
               const res = await readGameById(cardGame.id, tokens?.access_token);
               if (res && res.data) {
                    setGameData(res.data);
               } else {
                    throw new Error("Invalid response");
               }
          } catch (err) {
               setAlertMessage(
                    "Error actualizando la data del juego, por favor refresca la página"
               );
               setOpen(true);
          }
     }, [cardGame.id, tokens]);

     useEffect(() => {
          if (!cardGame.needsUpdate) return;
          fetchUpdatedGame();
          onUpdate()
     }, [fetchUpdatedGame, cardGame.needsUpdate]);        

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
                    await patchPlayById(parseInt(dragData.playerId), tokens?.access_token || '', { game: parseInt(cardGameId) });
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
               ref={cardRef}
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
                         
                         <img src={completeImageUrl(gameData.image ?? '')} alt={gameData.name} width="150" height="auto" />
                         
                         <div className="remaining__time">
                              <p ref={countdownRef} id={`cyber__countdown__${gameData.id}`}></p>
                         </div>
                    </div>
               </div>

               {user !== undefined ? (
                    <CardExpander
                         cardGame={gameData}
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
