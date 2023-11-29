import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/components/layout";
import { PrivateRoute, routes as authRoutes } from "@/features/auth";
import { routes as authRestoreRoutes } from "@/features/restore";
import { routes as authResetRoutes } from "@/features/reset";
import { routes as dashboardRoutes } from "@/features/dashboard";
import { routes as conversationsRoutes } from "@/features/conversations";
import { routes as walletRoutes } from "@/features/wallet";
import { routes as profileRoutes } from "@/features/profile";
import { routes as conversationRoutes } from "@/features/repeated-consultation";
import { routes as partnersRoutes } from "@/features/partners";
import { routes as reviewsRoutes } from "@/features/doc-reviews";
import { routes as videoRoutes } from "@/features/video-appointment";
import { routes as vacationRoutes } from "@/features/vacantion";
import { routes as recomandationRoutes } from "@/features/recomandation-analyse";
import { routes as surveysRoutes } from "@/features/surveys";
import GoogleCalendarCallback from "@/features/video-appointment/components/callback";

export const router = createBrowserRouter([
  {
    path: "/",
    children: dashboardRoutes,
  },
  {
    path: "/auth/authorize",
    element: <GoogleCalendarCallback />,
  },
  {
    path: "/auth/restore/*",
    children: authRestoreRoutes,
  },
  {
    path: "/auth/reset-password/*",
    children: authResetRoutes,
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
    path: "/vacantion/*",
    children: vacationRoutes,
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
  {
    path: "/recomandation-analyze/*",
    children: recomandationRoutes,
  },
  {
    path: "/custom-surveys/*",
    children: surveysRoutes,
  },
]);
