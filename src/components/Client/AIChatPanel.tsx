import { useState, useEffect, useContext } from "react";
import callDiscoveryChat from "../../lib/api/Client/callDiscoveryChat";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../../hooks/useUserData";
import DiamondLM from "../../assets/branding/Client/DiamondLM.svg?react";
import DiamondDM from "../../assets/branding/Client/DiamondDM.svg?react";
import { FileUp, ArrowUp } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import type { Messages } from "../../types/Messages";

type ChatInputBoxProps = {
  chat: Messages[];
  setChat: (value: Messages[]) => void;
  isStreaming: boolean;
  setIsStreaming: (value: boolean) => void;
  displayedText: string,
  setDisplayedText: React.Dispatch<React.SetStateAction<string>>,
  textQueue: string,
  setTextQueue: React.Dispatch<React.SetStateAction<string>>
};

export default function AIChatPanel(props: ChatInputBoxProps) {

  const [userInputValue, setUserInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitProject, setSubmitProject] = useState(true);
  const { conversationId } = useUserData();

  const { isDarkMode } = useContext(ThemeContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (props.textQueue.length === 0) return;
    const interval = setInterval(() => {
      props.setDisplayedText((prev) => prev + props.textQueue[0]);
      props.setTextQueue((prev) => prev.slice(1));
    }, 5);
    return () => clearInterval(interval);
  }, [props.textQueue]);

  async function handleResponseSubmit() {
    const currentInput = userInputValue;
    setUserInputValue("");
    props.setTextQueue("");
    props.setDisplayedText("");

    const updatedMessage = [
      ...props.chat,
      { role: "user" as const, content: currentInput },
    ];
    props.setChat(updatedMessage);
    setLoading(true);
    props.setIsStreaming(true);
    const response = await callDiscoveryChat(updatedMessage);
    props.setTextQueue(response?.replace("SUBMIT_PROJECT", "").trim() ?? "");
    props.setChat([
      ...updatedMessage,
      { role: "assistant" as const, content: response ?? "" },
    ]);
    props.setIsStreaming(false);
    const { error: errorInsertUserMessage } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        role: "user",
        content: currentInput,
      });

    if (errorInsertUserMessage) {
      console.log(
        "DiscoveryChat - Error inserting user message into db",
        errorInsertUserMessage,
      );
      throw errorInsertUserMessage;
    }

    const { error: errorInsertAssistantResponse } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        role: "assistant",
        content: (response ?? "").replace("SUBMIT_PROJECT", "").trim(),
      });

    if (errorInsertAssistantResponse) {
      console.log(
        "DiscoveryChat - Error inserting assistant message into db",
        errorInsertAssistantResponse,
      );
      throw errorInsertAssistantResponse;
    }

    setLoading(false);

    if ((response ?? "").includes("SUBMIT_PROJECT")) {
      setSubmitProject(false);
    }
  }

  function handleProjectSubmit() {
    return navigate("/confirm-project-report");
  }

  return (
    <>
      <div className="max-w-[648px] w-[648px] h-[364px] overflow-y-auto dark:text-white flex flex-col snap-y gap-3">
        {(props.displayedText || props.isStreaming) && (
          <div className="flex flex-row items-start gap-4">
            {isDarkMode ? (
              <DiamondDM className="min-h-[40px] min-w-[40px] h-10 w-auto drop-shadow-lg animate-float" />
            ) : (
              <DiamondLM className="min-h-[40px] min-w-[40px] h-10 w-auto drop-shadow-lg animate-float" />
            )}
            <p>{props.displayedText}</p>
          </div>
        )}
      </div>
      <div className="shadow-[0_4px_120px_30px_rgba(88,5,255,0.1)] dark:shadow-[0_4px_120px_30px_rgba(88,5,255,0.2)] p-4 bg-white dark:bg-black w-[648px] min-h-[150px] flex flex-col justify-between gap-4">
        <textarea
          className="outline-none border-none resize-none bg-transparent dark:text-white"
          value={userInputValue}
          placeholder={
            props.chat.length > 0
              ? "Write a response..."
              : "Describe your project..."
          }
          onChange={(e) => {
            setUserInputValue(e.target.value);
            setSubmitProject(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleResponseSubmit();
            }
          }}
        />
        <div className="flex flex-row justify-between">
          <button
            className=" z-2 flex items-center justify-center min-h-10 min-w-10 bg-white dark:bg-interiqo-black-400 border border-black/5 cursor-pointer"
            onClick={() => handleResponseSubmit()}
          >
            <FileUp
              color={isDarkMode ? "white" : "black"}
              className="w-4 h-4"
            />
          </button>
          {submitProject ? (
            <button
              className="flex items-center justify-center min-h-10 min-w-10 bg-interiqo-purple-400 cursor-pointer"
              disabled={loading}
              onClick={() => handleResponseSubmit()}
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
          ) : (
            <button
              className="flex items-center justify-center min-w-[170px] min-h-[38px] bg-interiqo-purple-400 text-xs text-white cursor-pointer"
              disabled={submitProject}
              onClick={() => handleProjectSubmit()}
            >
              Generate Project Brief
            </button>
          )}
        </div>
      </div>
    </>
  );
}
