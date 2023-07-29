import { Navigate } from "react-router-dom";

import { useAuth } from "../provider";

export interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { session } = useAuth();

  if (session.valid === false) {
    return (
      <Navigate
        to={`/auth/login?continueFrom=${encodeURIComponent(
          window.location.pathname + window.location.search,
        )}`}
        replace
      />
    );
  }

  return <>{children}</>;
};
