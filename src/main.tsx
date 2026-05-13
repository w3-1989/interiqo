import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import NotFoundPage from './pages/NotFoundPage.tsx'
import { ThemeProvider } from './context/ThemeProvider.tsx'
import "./style.css"
import ClientAccountSetup from './pages/Client/ClientAccountSetup.tsx'
import DiscoveryChat from './pages/Client/DiscoveryChat.tsx'
import ConfirmProjectReport from './pages/Client/ConfirmProjectReport.tsx'
import ClientDashboard from './pages/Client/ClientDashboard.tsx'
import FreelancerDashboard from "./pages/Freelancer/FreelancerDashboard.tsx"
import FreelancerAccountSetup from './pages/Freelancer/FreelancerAccountSetup.tsx'

const router = createBrowserRouter([
  {path: "/", element: <App/>},
  {path: "/client-account-setup", element: <ClientAccountSetup/>},
  {path: "/freelancer-account-setup", element:<FreelancerAccountSetup/>},
  {path: "/discovery-chat", element: <DiscoveryChat/>},
  {path: "/confirm-project-report", element:<ConfirmProjectReport/>},
  {path: "/client-dashboard", element:<ClientDashboard/>},
  {path: "/freelancer-dashboard", element:<FreelancerDashboard/> },
  {path : "*", element: <NotFoundPage/>}
])

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
  </ThemeProvider>
)
