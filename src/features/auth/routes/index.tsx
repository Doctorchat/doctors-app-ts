import React from "react";
import { Navigate, Outlet, RouteObject } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { AuthLayout, PublicRoute } from "../components";

import { Spinner } from "@/components/ui/spinner";

const Login = React.lazy(() => import("./login"));

const RoutesWrapper: React.FC = () => {
  const { t } = useTranslation();
  return (
    <AuthLayout>
      <PublicRoute>
        <React.Suspense
          fallback={
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-white">
              <Spinner />
              <p className="font-medium">{t("common:loading")}...</p>
            </div>
          }
        >
          <Outlet />
        </React.Suspense>
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
