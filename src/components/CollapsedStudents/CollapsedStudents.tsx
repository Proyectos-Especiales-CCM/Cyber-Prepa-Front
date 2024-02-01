import { useAppContext } from "../../store/appContext/appContext";
import { CollapsedStudentItem, ScrollButtons } from ".."
import { game } from "../../pages/Home/types";
import { readGameById, readPlays } from "../../services";
import { useEffect, useState } from "react";
import Config from "../../config";


interface CollapsedStudentProps {
     cardGame: game;
}

const CollapsedStudents: React.FC<CollapsedStudentProps> = ({ cardGame }) => {

     // -------------- APP CONTEXT -------------- //
     const { user, tokens } = useAppContext();
     
     // --------------- USE STATES -------------- //
     const [playsData, setPlaysData] = useState<game[]>([]);


     // -------------- USE EFFECTS -------------- //
     useEffect(() => {

          // Initialize WebSocket Connection
          const updatesSocket = new WebSocket(`ws://172.174.255.29/ws/updates/`)
      
          // Handle messages received from the server
          updatesSocket.onmessage = async function (e) {
               const data = JSON.parse(e.data);
               const message = data['message'];
               const sender = data['sender'];
      
               // Only update the UI if the message was sent by another user
               if (sender !== user) {
                    
                    // If user is authenticated, refresh / update the student list
                    if (user !== undefined) {
                         if (message == 'Plays updated') {
                              const updateData = await readGameById(data['info'], tokens?.access_token)
                              setPlaysData(updateData)
                         }
                    } else { // If user not authenticated, only update game cards
                         if (message == 'Plays updated') {
                              const data = readPlays(tokens?.access_token);
                         }
                    }
               }
            }
     }, [])
     
     return (
          <div className="collapsed__students">
               <ul id={`cyber__student__list__${cardGame.id}`} className="container__dropzone">

               {Array.isArray(cardGame.plays)
                    ? cardGame.plays.map((player) => (
                         <CollapsedStudentItem key={player.id} player={player} cardGameId={cardGame.id}/>
                    ))
                    : null
               }

               </ul>

               <ScrollButtons />
          </div>
     )
}

export default CollapsedStudents