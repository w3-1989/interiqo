import WordmarkLM from "../../assets/branding/Shared/wordmark-lm.svg?react";
import WordMarkDM from "../../assets/branding/Shared/wordmark-dm.svg?react";
import { Bell, Moon, Sun } from "lucide-react";
import useTheme from "../../hooks/useTheme";

interface TopBarProps{
    showNotifications?: boolean,
    disableToggle?: boolean
}

export default function TopBar({showNotifications = false, disableToggle = false}:TopBarProps ) {
  const { isDarkMode, setIsDarkMode } = useTheme();

  function handleClick() {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  }

  return (
    <>
      <section className="flex relative z-10 flex-row space place-content-between items-center p-6">
        {isDarkMode ? (
          <WordMarkDM className="h-12 w-auto" />
        ) : (
          <WordmarkLM className="h-12 w-auto" />
        )}
        <div className="flex flex-row gap-4">
          {showNotifications ? <button
            className="flex items-center justify-center 
            min-h-14 min-w-14 bg-white dark:bg-interiqo-black-400 border border-black/5 cursor-pointer"
          >
            <Bell size={20} color={isDarkMode ? "white" : "black"} />
          </button>: null}
          <button
            disabled={disableToggle}
            onClick={() => handleClick()}
            className="flex items-center justify-center 
            min-h-14 min-w-14 bg-white dark:bg-interiqo-black-400 border border-black/5 cursor-pointer"
          >
            {isDarkMode ? (
              <Sun size={20} color={isDarkMode ? "white" : "black"} />
            ) : (
              <Moon size={20} color={isDarkMode ? "white" : "black"} />
            )}
          </button>
        </div>
      </section>
    </>
  );
}
