import { Navigate } from "react-router-dom";
export interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {

    return (
      <Navigate
        to={`/auth/login?continueFrom=${encodeURIComponent(
          window.location.pathname + window.location.search,
        )}`}
        replace
      />
    );
  

  return <>{children}</>;
};
