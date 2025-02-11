import React from "react";
import { Driver } from "driver.js";

export type UserObject = {
  id: string;
  email: string;
  isAdmin: boolean;
  theme: string;
  isActive: boolean;
};

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface Token {
  token: string;
}

export type AppState = {
  driverObj: Driver | undefined;
  setDriverObj: (driverObj: Driver) => void;
  user: UserObject | undefined;
  setUser: (user: UserObject) => void;
  tokens: Tokens | undefined;
  setTokens: (accessToken: string, refreshToken: string) => void;
  admin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  logOut: () => void;
};

export type AppContextProps = {
  children: React.ReactNode;
};
