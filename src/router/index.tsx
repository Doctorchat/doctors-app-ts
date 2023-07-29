import { createBrowserRouter } from "react-router-dom";

import { PrivateRoute, routes as authRoutes } from "@/features/auth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <div>Hello world!</div>
      </PrivateRoute>
    ),
  },
  {
    path: "/auth/*",
    children: authRoutes,
  },
]);
