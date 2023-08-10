import { createBrowserRouter } from "react-router-dom";

import { MainLayout } from "@/components/layout";
import { PrivateRoute, routes as authRoutes } from "@/features/auth";
import { routes as conversationsRoutes } from "@/features/conversations";

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
    path: "/auth/*",
    children: authRoutes,
  },
]);
