import React from "react";
import { Navigate, Outlet, RouteObject } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { ConversationsLayout } from "../components";

import { MainLayout } from "@/components/layout";
import { Spinner } from "@/components/ui";
import { AuthPrivateRoute } from "@/features/auth";

const ConversationPage = React.lazy(() => import("./conversation-page"));
const SelectConversationPage = React.lazy(() => import("./select-conversation-page"));

const RoutesWrapper: React.FC = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <ConversationsLayout>
        <AuthPrivateRoute>
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
        </AuthPrivateRoute>
      </ConversationsLayout>
    </MainLayout>
  );
};

export const routes: RouteObject[] = [
  {
    element: <RoutesWrapper />,
    children: [
      {
        index: true,
        element: <SelectConversationPage />,
      },
      {
        path: ":id",
        element: <ConversationPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
];
