import { initCardsFunctionality } from './initCardsFunctionality';
import { UserObject } from '../../store/appContext/types';
import React, { useEffect, useRef, useState } from 'react'
import { initCountdown } from './initCountdown';
import { game } from '../../pages/Home/types'
import { CardExpander } from '..';
import './Card.css';

interface CardProps {
     cardGame: game;
     user: UserObject | undefined;
}

const Card: React.FC<CardProps> = ({ cardGame, user }) => {

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
                         
                         <img className="cyber__image" src={`/static/${cardGame.file_route}`} alt={`${cardGame.name}`} />
                         
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
