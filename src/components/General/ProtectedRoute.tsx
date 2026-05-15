import useAuth from "../../hooks/useAuth"
import { Navigate } from "react-router-dom"
type ProtectedRouteProps = {
    children: React.ReactNode,
}

export default function ProtectedRoutes({children}:ProtectedRouteProps){

    const {userIsLoggedIn, loading} = useAuth()

    if (loading) return null
    if (userIsLoggedIn) return children
    return <Navigate to="/freelancer-login" />

}