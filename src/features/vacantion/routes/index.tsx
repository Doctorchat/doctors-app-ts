import React from "react";
import { Navigate, Outlet, RouteObject } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { Layout } from "../components";

import { MainLayout } from "@/components/layout";
import { Spinner } from "@/components/ui";
import { PrivateRoute } from "@/features/auth";

const VacationPage = React.lazy(() => import("./vacation-page"));

const RoutesWrapper: React.FC = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Layout>
        <PrivateRoute>
          <React.Suspense
            fallback={
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-white text-typography-primary">
                <Spinner />
                <p className="font-medium">{t("vacation:vacation")}</p>
              </div>
            }
          >
            <Outlet />
          </React.Suspense>
        </PrivateRoute>
      </Layout>
    </MainLayout>
  );
};

export const routes: RouteObject[] = [
  {
    element: <RoutesWrapper />,
    children: [
      {
        index: true,
        element: <VacationPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
];
