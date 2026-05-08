import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import ClientInvite from './pages/ClientInvite.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import "./style.css"
import Discovery from './pages/Discovery.tsx'

const router = createBrowserRouter([
  {path: "/", element: <App/>},
  {path: "/client-invite", element: <ClientInvite/>},
  {path: "/discovery", element: <Discovery/>},
  {path : "*", element: <NotFoundPage/>}
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
