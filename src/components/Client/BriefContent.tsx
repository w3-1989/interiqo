/*
Future fix - currently fetches the first conversation found for this client.
When multi-project support is added, the conversation_id should be passed
as a URL param from DiscoveryChat to ensure the correct conversation brief
is generated and stored.
*/

import ReactMarkdown from "react-markdown";
import { useRef, useState } from "react";
import { FileDown } from "lucide-react";
import BriefAIEditChat from "../../components/Client/BriefAIEditChat";
import DiamondLM from "../../assets/branding/Client/DiamondLM.svg?react";
import DiamondDM from "../../assets/branding/Client/DiamondDM.svg?react";
import useTheme from "../../hooks/useTheme";

type BriefContentProps = {
  brief: string;
  setBrief: React.Dispatch<React.SetStateAction<string>>;
  title: string;
};

export default function BriefContent(props: BriefContentProps) {

  const { isDarkMode } = useTheme();

  const briefRef = useRef<HTMLDivElement>(null);

  const [aiChatToggle,setAiChatToggle] = useState(false)

  function toggleAiEditMode(){
    setAiChatToggle(true)
  }

  function handleFileDownload() {
    window.print();
  }

  if (!props.brief) return (
  <div className="w-[611px] h-full flex items-center justify-center">
    {isDarkMode ? (
      <DiamondDM className="h-20 w-auto drop-shadow-lg animate-float" />
    ) : (
      <DiamondLM className="h-20 w-auto drop-shadow-lg animate-float" />
    )}
  </div>
);

  return (
    <>
      <section className="flex flex-col w-[611px] h-full gap-4">
        <div
          ref={briefRef}
          id="brief-content"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 8%, black 90%, transparent 100%)",
          }}
          className="flex dark:text-white flex-col max-w-[611px] h-full overflow-y-auto scrollbar-hide pt-7 pb-8 "
        >
          <h1 className="font-avant text-[31px] dark:text-white">
            {props.title}
          </h1>
          <ReactMarkdown
            components={{
              h2: ({ ...props }) => (
                <h2
                  className="font-avant text-[19px] dark:text-white mb-2 mt-4"
                  {...props}
                />
              ),
              p: ({ ...props }) => (
                <p
                  className="font-DMSans text-[14px] dark:text-white mb-2"
                  {...props}
                />
              ),
            }}
          >
            {props.brief}
          </ReactMarkdown>
        </div>
        <div className={aiChatToggle ? "block" : "hidden"}>
          <BriefAIEditChat brief={props.brief} setBrief={props.setBrief} setAiChatToggle={setAiChatToggle}/>
        </div>
        <div className={aiChatToggle ? "hidden" : "flex flex-row justify-between"}>
          <button onClick={() => toggleAiEditMode()} className="flex items-center justify-center p-3 w-fit min-h-[38px] bg-white dark:bg-interiqo-black-400 text-[12px] text-black dark:text-white cursor-pointer border border-black/10">
            Edit Brief
          </button>
          <button onClick={() => handleFileDownload()} className="flex items-center justify-center p-3 w-fit min-h-[38px] bg-white dark:bg-interiqo-black-400 text-[12px] text-black dark:text-white cursor-pointer border border-black/10">
            <FileDown className="w-[14px] h-[14px]" />
          </button>
        </div>
      </section>
    </>
  );
}
