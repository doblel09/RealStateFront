import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  if (!auth || auth.isLoading) return <div />;
  return !auth.token ? children : <Navigate to="/" replace />;
};

export default PublicRoute;