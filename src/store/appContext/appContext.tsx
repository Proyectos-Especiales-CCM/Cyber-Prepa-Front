import { createContext, useContext, useState } from 'react';
import { AppContextProps, AppState, Tokens, UserObject } from './types';

const AppContext = createContext<AppState | undefined>(undefined);

export const AppContextProvider = ({ children }: AppContextProps) => {
  
    const [user, setUser] =               useState<UserObject | undefined>(undefined);
    const [tokens, setTokens] =           useState<Tokens | undefined>(undefined);
    const [admin, setIsAdmin] =           useState<boolean>(false);

    const setTokensState = (accessToken: string, refreshToken: string) => {
      setTokens({ access_token: accessToken,
                  refresh_token: refreshToken 
                });
    };

    const logOut = () => {
      setUser(undefined);
      setTokens(undefined);
      setIsAdmin(false);
      localStorage.removeItem('tokens');
      localStorage.removeItem('userId');
      localStorage.removeItem('isAdmin');
    };

    return (
      <AppContext.Provider
        value={{
          user,
          setUser,
          tokens,
          setTokens: setTokensState,
          admin,
          setIsAdmin,
          logOut: logOut,
        }}
      >
        {children}
      </AppContext.Provider>
    );
}

export const useAppContext = () => {
  
     const context = useContext(AppContext);
  
     if (context === undefined) {
       throw new Error('useAppContext must be used within an AppContextProvider');
     }
  
     return context;
};