import { initCardsFunctionality } from './initCardsFunctionality';
import { UserObject } from '../../store/appContext/types';
import React, { useEffect, useRef } from 'react'
import { initCountdown } from './initCountdown';
import { CardExpander } from '..';
import './Card.css';
import { ImageCell } from '../Tables/CustomBodyCells';
import { Game } from '../../services/types';

interface CardProps {
     cardGame: Game;
     user: UserObject | undefined;
}

const Card: React.FC<CardProps> = ({ cardGame, user}) => {

     const cardsRef = useRef<HTMLDivElement>(null);
     const countdownRef = useRef<HTMLDivElement>(null);
     
     useEffect(() => {
          if (user !== undefined) {
               initCardsFunctionality(cardsRef)
          }
     }, [user]);

     useEffect(() => {
          initCountdown(cardGame, countdownRef);
     }, [])
     
     return (
     
          <div key={cardGame.id} className="cyber__card [ is-collapsed ]">
               
               <div ref={cardsRef} id={cardGame.name} className="cyber__card__inner [ js-expander ]">

                    <span>{cardGame.name}</span><br />

                    <div id={`cyber__game__players__count__${cardGame.id}`}>

                         <span>
                              {Array.isArray(cardGame.plays) ? 
                                   (cardGame.plays.length == 1 ? `1 jugador` : `${cardGame.plays.length} jugadorxs`)  :
                                   (cardGame.plays == 1 ? `1 jugador` : `${cardGame.plays} jugadorxs`)
                              }
                         </span><br />
                         
                         <ImageCell
                              value={cardGame.image ? `${cardGame.image}` : "/media/images/game.png"}
                              style={{ width: '150px', height: 'auto' }}
                         />
                         
                         <div className="remaining__time">
                              <p ref={countdownRef} id={`cyber__countdown__${cardGame.id}`}></p>
                         </div>
                    </div>
               </div>

               {user !== undefined ? (
                    <CardExpander cardGame={cardGame}/>
               ) : null}
          </div>
     
     )
}

export default Card;
