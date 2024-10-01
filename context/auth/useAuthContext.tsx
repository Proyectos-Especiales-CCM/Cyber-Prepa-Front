import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuthContext = () => {

  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }

  return context;
};
