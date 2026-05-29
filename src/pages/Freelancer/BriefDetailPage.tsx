import { useEffect, useState } from "react";
import TopBar from "../../components/Shared/TopBar";
import { supabase } from "../../lib/supabaseClient";
import { useParams } from "react-router-dom";
import type { Brief } from "../../types/Briefs";
import ReactMarkdown from "react-markdown";

export default function BriefDetailPage() {
  const [briefData, setBriefData] = useState<Brief | null>(null);

  const params = useParams();

  useEffect(() => {
    async function getBrief() {
      const { data: brief, error: errorFetchingBrief } = await supabase
        .from("briefs")
        .select(
          `
            *,
            conversations(
                clients(
                first_name,
                last_name,
                organisation,
                created_at
                )
            )
            `,
        )
        .eq("id", params.id);

      if (!brief) {
        throw new Error("Brief Data does not exists", errorFetchingBrief);
      }

      if (errorFetchingBrief) {
        throw new Error("Error fetching brief", errorFetchingBrief);
      }

      setBriefData(brief[0]);
    }
    getBrief();
  }, []);

  return (
    <>
      <section className="flex flex-col h-screen dark:bg-black overflow-hidden">
        <TopBar showNotifications={true} />
        <div className="flex flex-1 p-4 gap-4 min-h-0">
          <div className="w-[70%] flex flex-col border border-black/5 p-4 min-h-0">
            <div className="flex-1 overflow-y-auto">
              <ReactMarkdown
                components={{
                  h2: ({ ...props }) => (
                    <h2
                      className="font-avant text-[19px] mb-2 mt-4"
                      {...props}
                    />
                  ),
                  p: ({ ...props }) => (
                    <p className="font-DMSans text-[14px] mb-2" {...props} />
                  ),
                }}
              >
                {briefData?.content}
              </ReactMarkdown>
            </div>
            <div className="flex flex-row justify-between pt-3 border-t border-black/5">
              <button>Create Plan</button>
              <button>Download Brief</button>
            </div>
          </div>
          <div className="w-[30%] flex flex-col border border-black/5 p-4">
            <div className="flex flex-col">
              <div className=" flex flex-col text-[19px] font-avant text-interiqo-purple-400 justify-start">
                {briefData?.conversations?.clients?.organisation}
              </div>
              <div className=" flex flex-col text-[31px] font-avant text-black dark:text-white justify-start">
                {briefData?.conversations?.clients?.first_name}
              </div>
              <div className=" flex flex-col text-[12px] font-DMSans text-black dark:text-white justify-start mb-4 ">
                {briefData?.created_at
                  ? new Date(briefData.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : ""}
              </div>
            </div>
            <div className="flex flex-row justify-between mt-auto">
              <p>AI Chat</p>
              <button>Submit AI</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
