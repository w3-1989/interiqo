import Background from "../../assets/backgrounds/GeometricBG.svg?react";
import DiamondLM from "../../assets/branding/Client/DiamondLM.svg?react";
import DiamondDM from "../../assets/branding/Client/DiamondDM.svg?react";
import useTheme from "../../hooks/useTheme";

export default function LoadingState() {
  const { isDarkMode } = useTheme();
  return (
    <div className="h-screen flex flex-col dark:bg-interiqo-black-500">
      <Background className="absolute h-screen opacity-20" />
      <section className="flex-1 flex items-center justify-center">
        {isDarkMode ? (
          <DiamondDM className="h-20 w-auto drop-shadow-lg animate-float" />
        ) : (
          <DiamondLM className="h-20 w-auto drop-shadow-lg animate-float" />
        )}
      </section>
    </div>
  );
}
