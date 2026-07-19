import { createContext, useEffect, useState } from 'react';
import { AppContextProps, AppState, Tokens, UserObject } from './types';
import { Driver, driver } from 'driver.js';

let updateTokensHelper: ((access: string, refresh: string) => void) | null = null;

export const AppContext = createContext<AppState | undefined>(undefined);

export const AppContextProvider = ({ children }: AppContextProps) => {

    const [user, setUser] = useState<UserObject | undefined>(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return undefined;

        try {
            const parsedUser = JSON.parse(storedUser);
            if (
                parsedUser &&
                typeof parsedUser === 'object' &&
                typeof parsedUser.id !== 'undefined' &&
                typeof parsedUser.email === 'string'
            ) {
                return parsedUser as UserObject;
            }
        } catch {
            // Ignore malformed local storage values.
        }

        localStorage.removeItem('user');
        return undefined;
    });

    const [tokens, setTokens] = useState<Tokens | undefined>(() => {
        const storedTokens = localStorage.getItem('tokens');
        if (!storedTokens) return undefined;

        try {
            const parsedTokens = JSON.parse(storedTokens);
            if (
                parsedTokens &&
                typeof parsedTokens.access_token === 'string' &&
                typeof parsedTokens.refresh_token === 'string'
            ) {
                return parsedTokens as Tokens;
            }
        } catch {
            // Ignore malformed local storage values.
        }

        localStorage.removeItem('tokens');
        return undefined;
    });

    // Admin status must come from the backend, never from mutable local storage.
    const [admin, setIsAdmin] = useState<boolean>(false);

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
    updateTokensHelper = setTokensState;

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

export { updateTokensHelper };
