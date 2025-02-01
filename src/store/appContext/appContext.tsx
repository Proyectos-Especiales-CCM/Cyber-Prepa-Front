import { createContext, useEffect, useState } from 'react';
import { AppContextProps, AppState, Tokens, UserObject } from './types';
import { Driver, driver } from 'driver.js';

export const AppContext = createContext<AppState | undefined>(undefined);

export const AppContextProvider = ({ children }: AppContextProps) => {

    const [user, setUser] = useState<UserObject | undefined>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : undefined;
    });

    const [tokens, setTokens] = useState<Tokens | undefined>(() => {
        const storedTokens = localStorage.getItem('tokens');
        return storedTokens ? JSON.parse(storedTokens) : undefined;
    });

    const [admin, setIsAdmin] = useState<boolean>(() => {
        const storedAdmin = localStorage.getItem('isAdmin');
        return storedAdmin ? JSON.parse(storedAdmin) : false;
    });

    const [driverObj, setDriverObj] = useState<Driver>(driver({
        animate: true,
        nextBtnText: 'Siguiente',
        prevBtnText: 'Atrás',
        doneBtnText: 'Finalizar',
    }));

    const setTokensState = (accessToken: string, refreshToken: string) => {
        const newTokens = { access_token: accessToken, refresh_token: refreshToken };
        setTokens(newTokens);
        localStorage.setItem('tokens', JSON.stringify(newTokens));
    };

    const logOut = () => {
        setUser(undefined);
        setTokens(undefined);
        setIsAdmin(false);
        localStorage.removeItem('user');
        localStorage.removeItem('tokens');
        localStorage.removeItem('isAdmin');
    };

    // Save to localStorage when user changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);

    // Save to localStorage when admin status changes
    useEffect(() => {
        localStorage.setItem('isAdmin', JSON.stringify(admin));
    }, [admin]);

    return (
        <AppContext.Provider
            value={{
                driverObj,
                setDriverObj,
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