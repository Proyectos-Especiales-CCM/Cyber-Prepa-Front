import { Play, Game } from "../types";

export function changeIdToName(playsData: Play[], gamesData: Game[]): Play[] {
    playsData.forEach(play => {
        const foundGame = gamesData.find(game => game.id === play.game);
        if (foundGame) {
            play.game = foundGame.name;
        }
    });
    return playsData;
}
