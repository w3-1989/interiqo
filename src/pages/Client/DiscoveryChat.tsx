

import { useContext, useState } from "react";
import TopBarSimple from "../../components/General/TopBarSimple";
import Background from "../../assets/backgrounds/GeometricBG.svg?react";
import DiamondLM from "../../assets/branding/Client/DiamondLM.svg?react";
import DiamondDM from "../../assets/branding/Client/DiamondDM.svg?react";
import { ThemeContext } from "../../context/ThemeContext";
import { useUserData } from "../../hooks/useUserData";
import TimeOfDayGreeting from "../../helpers/TimeOfDayGreeting";
import AIChatPanel from "../../components/Client/AIChatPanel";
import type { Messages } from "../../types/Messages";

export default function DiscoveryChat() {
  const [chat, setChat] = useState<Messages[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [textQueue, setTextQueue] = useState("");
  const { isDarkMode } = useContext(ThemeContext);
  const { clientName } = useUserData();

  if (!clientName)
    return (
      <div className="h-screen flex flex-col items-center justify-center dark:bg-interiqo-black-500">
        <Background className="absolute left-0 top-0 h-screen opacity-20" />
        {isDarkMode ? (
          <DiamondDM className="h-20 w-auto drop-shadow-lg animate-float" />
        ) : (
          <DiamondLM className="h-20 w-auto drop-shadow-lg animate-float" />
        )}
      </div>
    );

  return (
    <>
      <div className="h-screen flex flex-col dark:bg-interiqo-black-500">
        <Background className="absolute h-screen opacity-20" />
        <TopBarSimple
        disableToggle={!!(displayedText || isStreaming || textQueue)}
        />
        <section className="flex-1 flex flex-col justify-center items-center">
          <div className="flex flex-col items-center gap-8 -mt-16">
            <div
              className={`transition-opacity duration-700 ${clientName ? "opacity-100" : "opacity-0"} absolute top-1/2 left-1/2 -translate-x-1/2 top-[35%] flex flex-row items-center gap-6`}
            >
            
            

              {chat.length === 0 && !isStreaming ? clientName && 

              <>
              {isDarkMode ? (
                <DiamondDM className="h-20 mb-4 w-auto drop-shadow-lg animate-float" />
              ) : (
                <DiamondLM className="h-20 w-auto mb-4 drop-shadow-lg animate-float" />
              )}
                <TimeOfDayGreeting name={clientName} />
              </>
              
                : null}
            </div>

            <AIChatPanel
              chat={chat}
              setChat={setChat}
              isStreaming={isStreaming}
              setIsStreaming={setIsStreaming}
              displayedText={displayedText}
              setDisplayedText={setDisplayedText}
              textQueue={textQueue}
              setTextQueue={setTextQueue}
            />
          </div>
        </section>
      </div>
    </>
  );
}
