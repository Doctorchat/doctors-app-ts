import { createBrowserRouter } from "react-router-dom";

import { MainLayout } from "@/components/layout";
import { PrivateRoute, routes as authRoutes } from "@/features/auth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <MainLayout>
          <div>Hello world!</div>
        </MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/auth/*",
    children: authRoutes,
  },
]);
