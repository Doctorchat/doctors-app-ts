import { Suspense, lazy } from "react";
import { Navigate, Outlet, RouteObject } from "react-router-dom";

import { AuthLayout, PublicRoute } from "../components";

const Login = lazy(() => import("./login"));

const RoutesWrapper: React.FC = () => {
  return (
    <AuthLayout>
      <PublicRoute>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </PublicRoute>
    </AuthLayout>
  );
};

export const routes: RouteObject[] = [
  {
    element: <RoutesWrapper />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "*",
        element: <Navigate to="login" replace />,
      },
    ],
  },
];
