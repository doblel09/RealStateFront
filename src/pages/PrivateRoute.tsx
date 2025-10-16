import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const PrivateRoute = () => {
  const auth = useAuth();
  if (!auth || auth.isLoading) return <div />;
  return auth.token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;