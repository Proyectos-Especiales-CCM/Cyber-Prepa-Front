import { game } from "../../pages/Home/types";

export const initCountdown = (
     cardGame: game,
     countdownRef: React.RefObject<HTMLDivElement>,
) => {
     
     if (countdownRef.current) {
          // Update the count down every 1 second
          setInterval(function () {
               
               // Get current's date & time
               const now = new Date().getTime();

               // Set the date we're counting down to
               const countDownDate = new Date(cardGame.start_time).getTime();

               // Find the distance between now and the count down date
               const distance = countDownDate - now;

               // Time calculations for minutes and seconds
               const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
               const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
               const seconds = Math.floor((distance % (1000 * 60)) / 1000);

               let timeTextDisplay = minutes + "m " + seconds + "s ";

               if (hours > 0) {
                    timeTextDisplay = hours + "h " + timeTextDisplay;
               }

               // If the count down is finished, write some text
               if (distance < 0 && (Array.isArray(cardGame.plays) ? cardGame.plays.length : cardGame.plays) > 0) {
                    countdownRef.current.innerHTML = "AGOTADO";
               } 
               else if ((Array.isArray(cardGame.plays) ? cardGame.plays.length : cardGame.plays) === 0) {
                    countdownRef.current.innerHTML = "LIBRE";
                }                
               else {
                    countdownRef.current.innerHTML = timeTextDisplay;
               }

          }, 1000)
     }
}