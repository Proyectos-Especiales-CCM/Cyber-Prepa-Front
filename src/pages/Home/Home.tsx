import { useAppContext } from "../../store/appContext/appContext";
import { useEffect, useState } from "react";
import { getGamesData } from "./getGames";
import { Card } from "../../components";
import './Home.css';
import { game } from "./types";
import { readPlays } from "../../services";

const Home = () => {


  // -------------- APP CONTEXT -------------- //
  const { user, tokens } = useAppContext();
  
  
  // --------------- USE STATES -------------- //
  const [gamesData, setGamesData] = useState<game[]>([]);
  const [forceRender, setForceRender] = useState(false);


  // -------------- USE EFFECTS -------------- //
  useEffect(() => {
    const fetchData = async() => {
      try {
        const data = await getGamesData(user, tokens);
        setGamesData(data)
      } catch (error) {
        console.error("Error fetching games: ", error);
      }
    }
    fetchData()
  }, [user, tokens]);

  useEffect(() => {

    // Initialize WebSocket Connection
    const updatesSocket = new WebSocket(`ws://${window.location.host}/ws/updates/`)

    // Handle messages received from the server
    updatesSocket.onmessage = function (e) {
         const data = JSON.parse(e.data);
         const message = data['message'];
         const sender = data['sender'];

         // Only update the UI if the message was sent by another user
         if (sender !== user) {
              
              // If user is authenticated, update the game cards and student list
              if (user !== undefined) {
                   if (message == 'Games updated') {
                      setForceRender((prev) => !prev); // We update a state to force the component to re-render
                   }
              } else { // If user not authenticated, only update game cards
                   if (message == 'Games updated') {
                      setForceRender((prev) => !prev);
                   }
              }
          }
      }
  }, [])



  return (
    <div className="cyber__wrapper">
      <div className="cyber__cards" id="cyberCards">
        {gamesData.map((game) => (
          <Card key={game.id} cardGame={game} user={user} />
        ))}
      </div>
    </div>
  );
}

export default Home;



// return (
//   <div className="cyber__wrapper">
//     <div className="cyber__cards" id="cyberCards">
//       {games.map((game) => (
//         // <Card cardGame=game/>
        

//         <div key={game.id} className="cyber__card [ is-collapsed ]">

//           <div id={game.name} className="cyber__card__inner [ js-expander ]">
//             <span>{game.name}</span><br />
//             <div id={`cyber__game__players__count__${game.id}`}>
//               <span>{game.plays} jugadores</span><br />
//               <img className="cyber__image" src={`/static/${game.file_route}`} alt={`${game.name}`} />
//               <div className="remaining__time">
//                   <p id={`cyber__countdown__${game.id}`}>No data</p>
//               </div>
//             </div>
//           </div>

//           {user !== undefined ? (
//             <div className="cyber__card__expander">
//                 <i className="fa fa-close [ js-collapser ]"></i>

//                 <form className="add-student-game mb-3" id={`add-student-game-${game.id}`}>
//                     <input type="hidden" name="game_id" value={`${game.id}`} />
//                     <input type="text" className="form-control" name="student_id" placeholder="ID estudiante" aria-label="ID estudiante" aria-describedby="basic-addon2" />
//                     <div className="input-group-append">
//                         <button className="btn btn-outline-secondary" 
//                                 type="submit">Agregar estudiante
//                         </button>
//                     </div>
//                 </form>

//                 <div className="collapsed__students">
//                     <ul id={`cyber__student__list__${game.id}`} className="container__dropzone">
//                         {game.plays.map((player) => (
//                           <div id={`${player.id}`} data-gameId="${game.id}" className="student draggable" draggable="true">
//                             <li>{player.id}</li>
//                             <form className="end-play-form" id={`end-play-form-${player.id}`}>
//                                 <input type="hidden" name="student_id" value={`${player.id}`} />
//                                 <input type="hidden" name="game_id" value={`${game.id}`} />
//                                 <button type="submit" 
//                                         className="btn btn-success">End Play
//                                 </button>
//                             </form>
//                             <button type="button" 
//                                     className="btn btn-primary" 
//                                     data-bs-toggle="modal" 
//                                     data-bs-target="#modalSanciones" 
//                                     data-bs-matricula={`${player.id}`}>Sancionar
//                             </button>
//                           </div>
//                         ))}
//                     </ul>

//                     <button className="scroll-button left">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left-square-fill" viewBox="0 0 16 16">
//                             <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm10.5 10V4a.5.5 0 0 0-.832-.374l-4.5 4a.5.5 0 0 0 0 .748l4.5 4A.5.5 0 0 0 10.5 12z"/>
//                         </svg>
//                     </button>
//                     <button className="scroll-button right">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right-square-fill" viewBox="0 0 16 16">
//                             <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.5 10a.5.5 0 0 0 .832.374l4.5-4a.5.5 0 0 0 0-.748l-4.5-4A.5.5 0 0 0 5.5 4v8z"/>
//                         </svg>
//                     </button>
//                 </div>
//             </div>
//           ) : null }
//         </div>
//       ))}
//     </div>
//   </div>
// );