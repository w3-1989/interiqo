
import { useState, useEffect, useRef } from "react";
import callDiscoveryChat from "../../lib/api/Client/callDiscoveryChat";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useClientData } from "../../hooks/useClientData";
import DiamondLM from "../../assets/branding/Client/DiamondLM.svg?react";
import DiamondDM from "../../assets/branding/Client/DiamondDM.svg?react";
import fileTo64Base from "../../utils/fileTo64Base";
import {
  FileUp,
  ArrowUp,
  FileCheckCorner,
  X,
  FileExclamationPoint,
} from "lucide-react";
import type { Messages } from "../../types/Messages";
import type { FileUpload } from "../../types/FileUpload";
import useTheme from "../../hooks/useTheme";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/webp",
  "image/jpeg",
  "text/plain",
];

type ChatInputBoxProps = {
  chat: Messages[];
  setChat: (value: Messages[]) => void;
  isStreaming: boolean;
  setIsStreaming: (value: boolean) => void;
  displayedText: string;
  setDisplayedText: React.Dispatch<React.SetStateAction<string>>;
  textQueue: string;
  setTextQueue: React.Dispatch<React.SetStateAction<string>>;
};

export default function AIChatPanel(props: ChatInputBoxProps) {
  const [userInputValue, setUserInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitProject, setSubmitProject] = useState(true);
  const [fileLoading, setFileLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [base64Files, setBase64Files] = useState<string[]>([]);
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [displayedError, setDisplayedError] = useState("");
  const { conversationId } = useClientData();

  const { isDarkMode } = useTheme();

  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.textQueue.length === 0) return;
    const interval = setInterval(() => {
      props.setDisplayedText((prev) => prev + props.textQueue[0]);
      props.setTextQueue((prev) => prev.slice(1));
    }, 15);
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
    const response = await callDiscoveryChat(
      updatedMessage,
      files,
      base64Files,
    );
    setBase64Files([]);
    setFiles([]);
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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (errorMessage) {
      timerRef.current = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [errorMessage]);

  function setError(msg: string) {
    setErrorMessage(msg);
    setDisplayedError(msg);
  }

  async function handleFileSubmit(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return setError("No files uploaded");
    }
    if (files.length >= 3) {
      return setError("File limit reached");
    }
    const file = e.target.files[0];

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return setError("File type not supported");
    }
    if (file.size > 20971520) {
      return setError("File size is too large");
    }
    setFileLoading(true);
    const base64 = await fileTo64Base(file);
    setFileLoading(false);
    setFiles([...files, { filename: file.name, file_id: "" }]);
    setBase64Files([...base64Files, base64]);
  }


  function removeFile(i: number) {
    setFiles(files.filter((_, pos) => pos !== i));
    setBase64Files(base64Files.filter((_, pos) => pos !== i));
  }

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [props.displayedText]);

  return (
  <>
    <div className="flex relative flex-row items-start gap-6 w-[780px]">
      
      {(props.displayedText || props.isStreaming) && (
        <div className="pt-2 absolute -translate-x-[calc(44px+12px)]">
          {isDarkMode ? (
            <DiamondDM className=" min-h-[44px] min-w-[44px] h-11 w-auto drop-shadow-lg animate-float" />
          ) : (
            <DiamondLM className="  min-h-[44px] min-w-[44px] h-11 w-auto drop-shadow-lg animate-float" />
          )}
        </div>
      )}

      <div className="flex flex-col flex-1 gap-1">
        
        <div
          style={{ maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)" }}
          className="h-[380px] scrollbar-hide pb-8 overflow-y-auto dark:text-white flex flex-col"
        >
          {(props.displayedText || props.isStreaming) && (
            <p className="text-[16px] leading-8">{props.displayedText}</p>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="flex flex-col text-[12px] gap-1">
          <div className={`flex w-fit flex-row items-center bg-[#B3261E]/10 p-3 gap-2 transition-opacity duration-300 ${errorMessage ? "opacity-100" : "opacity-0"}`}>
            <FileExclamationPoint color="#B3261E" className="w-4 h-4" />
            <p className="text-black dark:text-white">{displayedError}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            <div className="flex flex-wrap gap-1 min-h-11"></div>
            {files.map((file, i) => (
              <div key={i} className="flex min-h-10 w-[212px] p-3 items-center justify-between bg-interiqo-purple-400">
                <div className="flex flex-row items-center gap-2">
                  <FileCheckCorner color="white" className="w-4 h-4" />
                  <p className="text-white truncate max-w-[120px]">{file.filename}</p>
                </div>
                <X color="white" className="w-4 h-4 cursor-pointer" onClick={() => removeFile(i)} />
              </div>
            ))}
          </div>
        </div>

        <div className="w-[780px] border border-black/5 dark:border-interiqo-black-100/10 shadow-[0_4px_120px_30px_rgba(88,5,255,0.1)] dark:shadow-[0_4px_120px_30px_rgba(88,5,255,0.2)] p-6 bg-white dark:bg-black min-h-[160px] flex flex-col justify-between gap-4">
          <textarea
            className="outline-none border-none resize-none bg-transparent dark:text-white text-[14px] leading-7"
            value={userInputValue}
            placeholder={props.chat.length > 0 ? "Write a response..." : "Describe your project..."}
            onChange={(e) => { setUserInputValue(e.target.value); setSubmitProject(true); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleResponseSubmit(); } }}
          />
          <div className="flex flex-row justify-between">
            <input type="file" ref={fileInputRef} accept={ALLOWED_MIME_TYPES.join(",")} className="hidden"
              onChange={(e) => { if (!e.target.files) { return; } else { handleFileSubmit(e); } }}
            />
            <button disabled={files.length >= 3} onClick={() => fileInputRef.current?.click()}
              className={`z-2 flex items-center justify-center min-h-10 min-w-10 bg-white dark:bg-interiqo-black-400 border border-black/5 ${files.length >= 3 ? "" : "cursor-pointer"}`}>
              {fileLoading ? (
                <span className="flex gap-1">
                  <span className="dot-1 w-1 h-1 bg-black dark:bg-white rounded-full" />
                  <span className="dot-2 w-1 h-1 bg-black dark:bg-white rounded-full" />
                  <span className="dot-3 w-1 h-1 bg-black dark:bg-white rounded-full" />
                </span>
              ) : (
                <FileUp color={isDarkMode ? "white" : "black"} className={`w-4 h-4 ${files.length >= 3 ? "opacity-10" : ""}`} />
              )}
            </button>
            {submitProject ? (
              <button className="flex items-center justify-center min-h-10 min-w-10 bg-interiqo-purple-400 cursor-pointer"
                disabled={loading} onClick={() => handleResponseSubmit()}>
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
              <button className="flex items-center justify-center min-w-[170px] min-h-[38px] bg-interiqo-purple-400 text-xs text-white cursor-pointer"
                disabled={submitProject} onClick={() => handleProjectSubmit()}>
                Generate Project Brief
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  </>
);
}