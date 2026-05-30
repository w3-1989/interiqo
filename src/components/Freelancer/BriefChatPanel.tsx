import { useState, useEffect } from "react";
import type { Messages } from "../../types/Messages";
import callBriefChat from "../../lib/api/Freelancer/callBriefChat";
import DiamondLM from "../../assets/branding/Client/DiamondLM.svg?react";
import DiamondDM from "../../assets/branding/Client/DiamondDM.svg?react";
import { ArrowUp } from "lucide-react";
import useTheme from "../../hooks/useTheme";
type chatInputBoxProps = {
  briefId: number;
  transcript: string;
};

export default function BriefChatPanel(props: chatInputBoxProps) {
  const [chat, setChat] = useState<Messages[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [textQueue, setTextQueue] = useState("");

  const { isDarkMode} = useTheme()

  useEffect(() => {
    if (textQueue.length === 0) return;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + textQueue[0]);
      setTextQueue((prev) => prev.slice(1));
    }, 15);
    return () => clearInterval(interval);
  }, [textQueue]);

  async function handleSubmit() {
    setLoading(true);
    const usersInput = userInput;
    setUserInput("");
    setDisplayedText("");

    const response = await callBriefChat(chat, props.briefId, usersInput);
    setLoading(false);
    setChat([
      ...chat,
      { role: "user", content: usersInput },
      { role: "assistant" as const, content: response ?? "" },
    ]);
    setTextQueue(response ?? "");
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className=" flex flex-1 flex-row overflow-y-auto gap-3 items-start justify-start mt-2">
        {isDarkMode ? (
            <DiamondDM className=" min-h-[22px] min-w-[22px] h-8 w-auto drop-shadow-lg animate-float" />
          ) : (
            <DiamondLM className="  min-h-[22px] min-w-[22px] h-8 w-auto drop-shadow-lg animate-float" />
          )}
        <p className="text-[14px] font-DMSans leading-6">{displayedText}</p>
      </div>
      <div className="flex flex-row justify-between items-center border-t border-black/5 pt-3">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask a question about this brief..."
          className=" leading-6 flex-1 resize-none outline-none text-[14px]"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center justify-center min-h-10 min-w-10 bg-interiqo-purple-400 cursor-pointer"
        >
          {loading ? (
            <span className="flex gap-1">
              <span className="dot-1 w-1 h-1 bg-white rounded-full" />
              <span className="dot-2 w-1 h-1 bg-white rounded-full" />
              <span className="dot-3 w-1 h-1 bg-white rounded-full" />
            </span>
          ) : (
            <ArrowUp color="white" className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
