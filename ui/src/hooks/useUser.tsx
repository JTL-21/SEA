import React from "react";
import { User } from "../types";

interface UserContext {
  user: User | null;
  signIn: (username: string, password: string) => void;
  signOut: () => void;
}

interface UserProviderProps {
  children?: React.ReactNode;
}

const userContext = React.createContext({} as UserContext);

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = React.useState<User | null>(null);

  const signIn = React.useCallback((username: string, password: string) => {
    //
  }, []);
  const signOut = React.useCallback(() => setUser(null), []);

  return (
    <userContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </userContext.Provider>
  );
};

const useUser = () => React.useContext(userContext);

export default useUser;
export { UserProvider, useUser };
