import React from "react";
import { Navigate, Outlet, RouteObject } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { ConversationsList } from "../components";

import { MainLayout } from "@/components/layout";
import { Spinner } from "@/components/ui";
import { PrivateRoute } from "@/features/auth";

const Conversation = React.lazy(() => import("./conversation"));

const RoutesWrapper: React.FC = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <PrivateRoute>
        <div className="grid flex-1 grid-cols-12 grid-rows-1 gap-5 overflow-hidden lg:p-5">
          <ConversationsList />
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
        </div>
      </PrivateRoute>
    </MainLayout>
  );
};

export const routes: RouteObject[] = [
  {
    element: <RoutesWrapper />,
    children: [
      {
        index: true,
        element: <></>,
      },
      {
        path: ":id",
        element: <Conversation />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
];
