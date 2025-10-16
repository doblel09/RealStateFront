import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  if (!auth || auth.isLoading) return <div />;
  return auth.token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;