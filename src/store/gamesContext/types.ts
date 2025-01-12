import { Game, Material } from "../../services/types";

export type GamesState = {
  games: Game[];
  setGames: (games: Game[]) => void;
  materials: Material[];
  setMaterials: (materials: Material[]) => void;
};

export type GamesContextProps = {
  children: React.ReactNode;
};
