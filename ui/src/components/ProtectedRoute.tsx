import { Navigate, Outlet } from "react-router-dom";
import useUser from "../hooks/useUser";

const ProtectedRoute = () => {
  const { user, loaded } = useUser();

  return user || !loaded ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;
