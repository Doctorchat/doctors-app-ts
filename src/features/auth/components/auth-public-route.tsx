import { Navigate } from "react-router-dom";

import { useAuth } from "../provider";

export interface AuthPublicRouteProps {
  children: React.ReactNode;
}

export const AuthPublicRoute: React.FC<AuthPublicRouteProps> = ({ children }) => {
  const { session } = useAuth();

  if (session.valid === true) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
