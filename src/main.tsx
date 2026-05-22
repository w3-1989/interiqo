import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from "./pages/Shared/NotFoundPage.tsx";
import { ThemeProvider } from "./context/ThemeProvider.tsx";
import { UserTypeProvider } from "./context/UserTypeProvider.tsx";
import "./style.css";
import ClientAccountSetup from "./pages/Client/ClientAccountSetup.tsx";
import DiscoveryChat from "./pages/Client/DiscoveryChat.tsx";
import ConfirmProjectReport from "./pages/Client/ConfirmProjectReport.tsx";
import ClientDashboard from "./pages/Client/ClientDashboard.tsx";
import FreelancerDashboard from "./pages/Freelancer/FreelancerDashboard.tsx";
import FreelancerAccountSetup from "./pages/Freelancer/FreelancerAccountSetup.tsx";
import ProtectedRoutes from "./components/Shared/ProtectedRoutes.tsx";
import LoginPage from "./pages/Shared/LoginPage.tsx";
import ForgotPassword from "./pages/Shared/ForgotPassword.tsx"
import ResetPassword from "./pages/Shared/ResetPassword.tsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/client-account-setup", element: <ClientAccountSetup /> },
  { path: "/freelancer-account-setup", element: <FreelancerAccountSetup /> },
  { path: "/login", element: <LoginPage /> },
  {path: "/forgot-password", element:<ForgotPassword/>},
  {path: "/reset-password", element: <ResetPassword/>},
  {
    path: "/discovery-chat",
    element: (
      <ProtectedRoutes requiredUserType="client">
        <DiscoveryChat />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/confirm-project-report",
    element: (
      <ProtectedRoutes requiredUserType="client">
        <ConfirmProjectReport />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/client-dashboard",
    element: (
      <ProtectedRoutes requiredUserType="client">
        <ClientDashboard />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/freelancer-dashboard",
    element: (
      <ProtectedRoutes requiredUserType="freelancer">
        <FreelancerDashboard />
      </ProtectedRoutes>
    ),
  },
  { path: "*", element: <NotFoundPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
  <UserTypeProvider>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </UserTypeProvider>
</StrictMode>
  ,
);
