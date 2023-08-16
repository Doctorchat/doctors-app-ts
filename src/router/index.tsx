import { createBrowserRouter } from "react-router-dom";

import { MainLayout } from "@/components/layout";
import { PrivateRoute, routes as authRoutes } from "@/features/auth";
import { routes as conversationsRoutes } from "@/features/conversations";
import { routes as walletRoutes } from "@/features/wallet";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout>
        <PrivateRoute>
          <div>Home</div>
        </PrivateRoute>
      </MainLayout>
    ),
  },
  {
    path: "/conversations/*",
    children: conversationsRoutes,
  },
  {
    path: "/wallet/*",
    children: walletRoutes,
  },
  {
    path: "/auth/*",
    children: authRoutes,
  },
]);
