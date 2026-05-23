import { Navigate } from "react-router-dom";
import useUserType from "../../hooks/useUserType";
import Background from "../../assets/backgrounds/GeometricBG.svg?react";
import DiamondLM from "../../assets/branding/Client/DiamondLM.svg?react";
import DiamondDM from "../../assets/branding/Client/DiamondDM.svg?react";
import useTheme from "../../hooks/useTheme";
import TopBar from "./TopBar";
type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredUserType: "freelancer" | "client";
};

export default function ProtectedRoutes({
  children,
  requiredUserType,
}: ProtectedRouteProps) {
  const { userType, loading } = useUserType();
  const { isDarkMode } = useTheme();

  if (loading)
    return (
      <div className="h-screen flex flex-col dark:bg-interiqo-black-500">
        <Background className="absolute h-screen opacity-20" />
        <TopBar />
        <section className="flex-1 flex items-center justify-center -mt-28">
          {isDarkMode ? (
            <DiamondDM className="h-20 w-auto drop-shadow-lg animate-float" />
          ) : (
            <DiamondLM className="h-20 w-auto drop-shadow-lg animate-float" />
          )}
        </section>
      </div>
    );
  if (userType === requiredUserType) return children;
  return <Navigate to="/login" />;
}
