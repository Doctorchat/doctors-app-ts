import { createBrowserRouter } from "react-router-dom";

import { MainLayout } from "@/components/layout";
import { PrivateRoute, routes as authRoutes } from "@/features/auth";
import { routes as conversationsRoutes } from "@/features/conversations";
import { routes as walletRoutes } from "@/features/wallet";
import { routes as profileRoutes } from "@/features/profile";
import { routes as conversationRoutes } from "@/features/repeated-consultation";
import { routes as partnersRoutes } from "@/features/partners";
import { routes as reviewsRoutes } from "@/features/doc-reviews";
import { routes as videoRoutes } from "@/features/video-appointment";
import GoogleCalendarCallback from "@/features/video-appointment/components/callback";

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
    path: "/auth/authorize",
    element: (
      <GoogleCalendarCallback />
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
    path: "/profile/*",
    children: profileRoutes,
  },
  {
    path: "/repeated-consultations/*",
    children: conversationRoutes,
  },
  {
    path: "/partners/*",
    children: partnersRoutes,
  },
  {
    path: "/auth/*",
    children: authRoutes,
  },
  {
    path: "/reviews/*",
    children: reviewsRoutes,
  },
  {
    path: "/video-appointment/*",
    children: videoRoutes,
  },
]);
