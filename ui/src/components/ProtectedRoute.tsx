import useUser from "../hooks/useUser";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  inverse?: boolean;
}

const ProtectedRoute = ({ inverse = false }: ProtectedRouteProps) => {
  const { user, loaded } = useUser();

  const renderPage = !loaded || (!user && inverse) || (user && !inverse);

  return renderPage ? (
    <Outlet />
  ) : user ? (
    <Navigate to="/" />
  ) : (
    <Navigate to="/sign-in" />
  );
};

export default ProtectedRoute;
