/*
Future fix - currently fetches the first conversation found for this client.
When multi-project support is added, the conversation_id should be passed
as a URL param from DiscoveryChat to ensure the correct conversation brief
is generated and stored.
*/

import ReactMarkdown from "react-markdown";
import { useRef } from "react";
import { FileDown } from "lucide-react";


type BriefContentProps = {
  brief: string;
  setBrief: React.Dispatch<React.SetStateAction<string>>;
};

export default function BriefContent(props: BriefContentProps) {
  const briefRef = useRef<HTMLDivElement>(null);

function handleFileDownload() {
  window.print()
}

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
            Project Heading will go here
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
        <div className="flex flex-row justify-between">
          <button className="flex items-center justify-center p-3 w-fit min-h-[38px] bg-white dark:bg-interiqo-black-400 text-[12px] text-black dark:text-white cursor-pointer border border-black/10 ">
            Edit Brief
          </button>
          <button
            onClick={() => handleFileDownload()}
            className="flex items-center justify-center p-3 w-fit min-h-[38px] bg-white dark:bg-interiqo-black-400 text-[12px] text-black dark:text-white cursor-pointer border border-black/10 "
          >
            <FileDown className=" w-[14px] h-[14px]" />
          </button>
        </div>
      </section>
    </>
  );
}
