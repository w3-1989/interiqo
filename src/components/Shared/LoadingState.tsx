import DiamondLM from "../../assets/branding/Client/DiamondLM.svg?react";
import DiamondDM from "../../assets/branding/Client/DiamondDM.svg?react";
import useTheme from "../../hooks/useTheme";

export default function LoadingState() {
  const { isDarkMode } = useTheme();
  return (
    
      <section className="flex-1 flex items-center justify-center -mt-34">
        {isDarkMode ? (
          <DiamondDM className="h-20 w-auto drop-shadow-lg animate-float" />
        ) : (
          <DiamondLM className="h-20 w-auto drop-shadow-lg animate-float" />
        )}
      </section>
  );
}
