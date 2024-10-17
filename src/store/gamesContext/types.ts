import { Game } from "../../services/types";

export type GamesState = {
  games: Game[];
  setGames: (games: Game[]) => void;
};

export type GamesContextProps = {
  children: React.ReactNode;
};
