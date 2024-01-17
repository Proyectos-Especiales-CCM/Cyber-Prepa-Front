import { readGames } from "../../services";
import { Tokens, UserObject } from "../../store/appContext/types";

export const getGamesData = async (
    user: UserObject | undefined,
    tokens: Tokens | undefined,
) => {
  try {
    // If user is authenticated call `readGames` with access token.
    // This way, `play` attribute will be filled with `players ids`.
    // If user is not authenticated just call readGames w/o token.
    const accessToken = user ? tokens?.access_token : undefined
    
    const res = await readGames(accessToken);
    const games = res.data;

    const availableGames = games.filter((game) => game.show == true);
    
    return availableGames;

  } catch (error) {
    console.error("Error fetching API `rental/games/`:", error)
  }
};
