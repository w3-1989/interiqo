import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserTypeContext } from "../../context/UserTypeContext";
type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredUserType: "freelancer" | "client";
};

export default function ProtectedRoutes({
  children,
  requiredUserType,
}: ProtectedRouteProps) {
  const { userType, loading } = useContext(UserTypeContext);
  if (loading) return null;
  if (userType === requiredUserType) return children;
  return <Navigate to="/login" />;
}
