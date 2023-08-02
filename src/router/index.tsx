import { createBrowserRouter } from "react-router-dom";

import { MainLayout } from "@/components/layout";
import { routes as authRoutes } from "@/features/auth";
import { routes as conversationsRoutes } from "@/features/conversations";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout>
        <div>Home</div>
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
