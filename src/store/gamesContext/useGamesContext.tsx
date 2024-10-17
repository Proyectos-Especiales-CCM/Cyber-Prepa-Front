import { useContext } from "react";
import { GamesContext } from "./gamesContext";

export const useGamesContext = () => {
  
     const context = useContext(GamesContext);
  
     if (context === undefined) {
       throw new Error('useGamesContext must be used within an GamesContextProvider');
     }
  
     return context;
};