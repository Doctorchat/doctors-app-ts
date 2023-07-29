import { Navigate } from "react-router-dom";

import { useAuth } from "../provider";

export interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { session } = useAuth();

  if (session.valid === true) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
