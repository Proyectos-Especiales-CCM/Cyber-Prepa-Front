import { createContext, useState } from 'react';
import { Game } from '../../services/types';
import { GamesContextProps, GamesState } from './types';

export const GamesContext = createContext<GamesState | undefined>(undefined);


export const GamesContextProvider = ({ children }: GamesContextProps) => {
  const [games, setGames] = useState<Game[]>([]);

  return (
    <GamesContext.Provider
      value={{
        games,
        setGames,
      }}
    >
      {children}
    </GamesContext.Provider>
  );
};
