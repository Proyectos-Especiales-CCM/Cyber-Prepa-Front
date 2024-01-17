export const initCardsFunctionality = (cardsRef: React.RefObject<HTMLDivElement>) => {
     if (cardsRef.current) {
          
          // Open and close card when clicked on card
          cardsRef.current.addEventListener('click', (event) => {
               
               const target = event.target as HTMLElement;
               
               const closestCard = target.closest('.cyber__card');
               
               if (!closestCard) return;
               
               const rect = closestCard.getBoundingClientRect();
               
               window.scrollTo({
                    top: rect.top + window.scrollY,
                    behavior: 'smooth',
               });
               
               if (closestCard.classList.contains('is-collapsed')) {
                    document.querySelectorAll('.cyber__card').forEach((card) => {
                         card.classList.remove('is-expanded');
                         card.classList.add('is-collapsed');
                    })

                    closestCard.classList.remove('is-collapsed');
                    closestCard.classList.add('is-expanded');
               } else {
                    closestCard.classList.remove('is-expanded');
                    closestCard.classList.add('is-collapsed');
               }
          })
     }
}