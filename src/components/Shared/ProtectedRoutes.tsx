import { Navigate } from "react-router-dom";
import useUserType from "../../hooks/useUserType";
type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredUserType: "freelancer" | "client";
};

export default function ProtectedRoutes({
  children,
  requiredUserType,
}: ProtectedRouteProps) {
  const { userType, loading } = useUserType();
  if (loading) return null;
  if (userType === requiredUserType) return children;
  return <Navigate to="/login" />;
}
