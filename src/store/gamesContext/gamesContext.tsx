import { createContext, useState } from 'react';
import { Game, Material } from '../../services/types';
import { GamesContextProps, GamesState } from './types';

export const GamesContext = createContext<GamesState | undefined>(undefined);


export const GamesContextProvider = ({ children }: GamesContextProps) => {
  const [games, setGames] = useState<Game[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);

  return (
    <GamesContext.Provider
      value={{
        games,
        setGames,
        materials,
        setMaterials,
      }}
    >
      {children}
    </GamesContext.Provider>
  );
};
