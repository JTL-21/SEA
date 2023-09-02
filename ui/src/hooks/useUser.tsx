import React from "react";
import { User } from "../types";
import API from "../api";
import { useNavigate } from "react-router-dom";

interface UserContext {
  user: User | null;
  loaded: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

interface UserProviderProps {
  children?: React.ReactNode;
}

const userContext = React.createContext({} as UserContext);

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loaded, setLoaded] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    API.whoami().then((response) => {
      if (response.ok) {
        setUser(response.data);
      }
      setLoaded(true);
    });
  }, []);

  const logout = () => {
    API.logout().then((response) => {
      if (response.ok) {
        setUser(null);
        navigate("/sign-in");
      }
    });
  };

  return (
    <userContext.Provider value={{ user, loaded, setUser, logout }}>
      {children}
    </userContext.Provider>
  );
};

const useUser = () => React.useContext(userContext);

export default useUser;
export { UserProvider, useUser };
