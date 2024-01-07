import { createContext, useContext } from 'react';

const AppContext = createContext(undefined);

export const AppContextProvider = () => {}

export const useAppContext = () => {
     const context = useContext(AppContext);
     if (context === undefined) {
       throw new Error('useAppContext must be used within an AppContextProvider');
     }
     return context;
   };
   