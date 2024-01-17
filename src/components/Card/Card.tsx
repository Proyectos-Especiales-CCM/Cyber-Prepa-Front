import { initCardsFunctionality } from './initCardsFunctionality';
import { UserObject } from '../../store/appContext/types';
import React, { useEffect, useRef } from 'react'
import { game } from '../../pages/Home/types'
import { CardExpander } from '..';
import './Card.css';

interface CardProps {
     cardGame: game;
     user: UserObject | undefined;
}

const Card: React.FC<CardProps> = ({ cardGame, user }) => {

     const cardsRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
          if (user !== undefined) {
               initCardsFunctionality(cardsRef)
          }
     }, [user]);

     return (
     
          <div key={cardGame.id} className="cyber__card [ is-collapsed ]">
               
               <div ref={cardsRef} id={cardGame.name} className="cyber__card__inner [ js-expander ]">

                    <span>{cardGame.name}</span><br />

                    <div id={`cyber__game__players__count__${cardGame.id}`}>

                         <span>
                              {Array.isArray(cardGame.plays) ? `${cardGame.plays.length} jugadores` : `${cardGame.plays} jugadores`}
                         </span><br />
                         
                         <img className="cyber__image" src={`/static/${cardGame.file_route}`} alt={`${cardGame.name}`} />
                         
                         <div className="remaining__time">
                              <p id={`cyber__countdown__${cardGame.id}`}>No data</p>
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
