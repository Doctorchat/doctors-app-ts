import React from "react";
import { Navigate, Outlet, RouteObject } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "../components";
import { Spinner } from "@/components/ui";
import { PublicRoute } from "@/features/auth/components";

const ResetPage = React.lazy(() => import("./reset-page"));

const RoutesWrapperReset: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <PublicRoute>
        <React.Suspense
          fallback={
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-white text-typography-primary">
              <Spinner />
              <p className="font-medium">{t("common:loading")}</p>
            </div>
          }
        >
          <Outlet />
        </React.Suspense>
      </PublicRoute>
    </Layout>
  );
};

export const routes: RouteObject[] = [
  {
    element: <RoutesWrapperReset />,
    children: [
      {
        index: true,
        element: <ResetPage />,
      },
      {
        path: "*",
        element: <Navigate to="login" replace />,
      },
    ],
  },
];
