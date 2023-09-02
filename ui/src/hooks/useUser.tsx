import React from "react";
import { User } from "../types";
import API from "../api";

interface UserContext {
  user: User | null;
  setUser: (user: User) => void;
}

interface UserProviderProps {
  children?: React.ReactNode;
}

const userContext = React.createContext({} as UserContext);

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    API.whoami().then((response) => {
      if (response.ok) {
        setUser(response.data);
      }
    });
  }, []);

  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
};

const useUser = () => React.useContext(userContext);

export default useUser;
export { UserProvider, useUser };
