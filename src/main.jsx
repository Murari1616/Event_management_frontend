// @ts-nocheck
import "./index.css";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ThemeProvider } from "@/components/theme-provider";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Layout from "./Layout.jsx";
import NotFound from "./components/NotFound";
import store from "./redux/store.jsx";
import { Register } from "./lazyComponents.js";
import Loader from "./components/Loader/Loader.jsx";
import { Toaster } from "./components/ui/toaster";
import Location from "./pages/auth/Location";
import PaymentPopup from "./pages/rent/Payment";
import RegisteredUsers from "./pages/RegisteredUsers";
import PaymentScreen from "./pages/Payment";

// ✅ Define all routes
const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("code") === "4110";

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};
const router = createBrowserRouter([
  // Public Login Route
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: "/registered-users",
    element: (
      <Suspense fallback={<Loader />}>
        <ProtectedRoute>
          <RegisteredUsers />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: "/payment",
    element: (
      <Suspense fallback={<Loader />}>
        <PaymentScreen />
      </Suspense>
    ),
  },

  // Public Rules Page (optional)
  // Protected Routes
]);

// ✅ Render App
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
