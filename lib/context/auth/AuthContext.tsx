"use client"

import { createContext, useEffect, useState } from 'react';
import { AuthContextProps, AuthState, Tokens, UserObject } from './types';

export const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthContextProvider = ({ children }: AuthContextProps) => {

  const [user, setUser] = useState<UserObject | undefined>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : undefined;
    }
    return undefined;
  });

  const [tokens, setTokens] = useState<Tokens | undefined>(() => {
    if (typeof window !== 'undefined') {
      const storedTokens = localStorage.getItem('tokens');
      return storedTokens ? JSON.parse(storedTokens) : undefined;
    }
    return undefined;
  });

  const [admin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const storedAdmin = localStorage.getItem('isAdmin');
      return storedAdmin ? JSON.parse(storedAdmin) : false;
    }
    return false;
  });

  const setTokensState = (accessToken: string, refreshToken: string) => {
    const newTokens = { access_token: accessToken, refresh_token: refreshToken };
    setTokens(newTokens);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tokens', JSON.stringify(newTokens));
    }
  };

  const logOut = () => {
    setUser(undefined);
    setTokens(undefined);
    setIsAdmin(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('tokens');
      localStorage.removeItem('isAdmin');
    }
  };

  // Save to localStorage when user changes
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  // Save to localStorage when admin status changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAdmin', JSON.stringify(admin));
    }
  }, [admin]);

  return (
    <AuthContext.Provider
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
    </AuthContext.Provider>
  );
}
