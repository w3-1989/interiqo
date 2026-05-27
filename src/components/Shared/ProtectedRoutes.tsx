import { Navigate } from "react-router-dom";
import useUserType from "../../hooks/useUserType";
import LoadingState from "./LoadingState";
type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredUserType: "freelancer" | "client";
};

export default function ProtectedRoutes({
  children,
  requiredUserType,
}: ProtectedRouteProps) {
  const { userType, loading } = useUserType();

  if (loading)
    return (
      <LoadingState/>
    );
  if (userType === requiredUserType) return children;
  return <Navigate to="/login" />;
}
