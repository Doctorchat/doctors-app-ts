import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { z } from "zod";
import { AuthProvider } from "./features/auth";
import zodErrorMap from "./lib/zod";
import { router } from "./router";
import { Toaster } from "@/components/ui/toaster";
import "firebase/messaging";
import "./lib/i18n";
import "./styles/index.css";
import registerServiceWorker from "../public/serviceWorker";

z.setErrorMap(zodErrorMap);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: import.meta.env.PROD,
      retry: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  // </React.StrictMode>
);
registerServiceWorker();
