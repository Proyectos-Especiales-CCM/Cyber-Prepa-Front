import { Game } from "../../services/types";

export const initCountdown = (
  cardGame: Game,
  countdownRef: React.RefObject<HTMLDivElement>,
  setStatusCallback: (status: string) => void,
) => {
  if (countdownRef.current) {
    countdownRef.current.innerHTML = "Cargando...";

    const countDownDate = new Date(cardGame.start_time).getTime() + (60 * 60 * 1000);
    
    const intervalId = setInterval(function () {
      const now = new Date().getTime();

      const distance = countDownDate - now;

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      let timeTextDisplay = minutes + "m " + seconds + "s ";

      if (hours > 0) {
        timeTextDisplay = hours + "h " + timeTextDisplay;
      }

      if (distance < 0 && (Array.isArray(cardGame.plays) ? cardGame.plays.length : cardGame.plays) > 0) {
        countdownRef.current!.innerHTML = "AGOTADO";
        setStatusCallback("AGOTADO"); 
      } else if ((Array.isArray(cardGame.plays) ? cardGame.plays.length : cardGame.plays) === 0) {
        countdownRef.current!.innerHTML = "LIBRE";
        setStatusCallback("LIBRE");
      } else {
        countdownRef.current!.innerHTML = timeTextDisplay;
        setStatusCallback("COUNTING");
      }

    }, 1000);

    return intervalId;
  }

  return null;
};
