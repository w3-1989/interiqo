import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useFreelancerData } from "../../hooks/useFreelancerData";
import type { Brief } from "../../types/Briefs";
import callClaude from "../../lib/api/callClaude";
export default function DisplayBriefs() {
  const [briefList, setBriefList] = useState<Brief[]>([]);
  const [briefSummary, setBriefSummary] = useState<string[]>([]);
  const { freelancerId } = useFreelancerData();

  useEffect(() => {
    async function briefListData() {
      const { data: clientData, error: errorGettingClientData } = await supabase
        .from("clients")
        .select();

      if (!clientData) {
        throw new Error("No client data");
      }

      if (errorGettingClientData) throw new Error(errorGettingClientData);

      const clientId = clientData.map((i) => {
        return i.id;
      });

      const { data: conversationData, error: errorGettingConversationData } =
        await supabase.from("conversations").select().in("client_id", clientId);

      if (!conversationData) {
        throw new Error("No client data");
      }

      if (errorGettingConversationData)
        throw new Error(errorGettingConversationData);

      const conversationId = conversationData.map((i) => {
        return i.id;
      });

      const { data: briefsData, error: errorGettingBriefData } = await supabase
        .from("briefs")
        .select(
          `
  *,
  conversations(
    clients(
      first_name,
      last_name,
      organisation
    )
  )
`,
        )
        .in("conversation_id", conversationId);

      if (!briefsData) {
        throw new Error("No client data");
      }

      if (errorGettingBriefData) throw new Error(errorGettingBriefData);

      setBriefList(briefsData as Brief[]);

      for (let i = 0; i < briefsData.length; i++) {
        if (!briefsData[i].summary) {
          const res = await callClaude("generate-brief-summary", {
            summary: briefsData[i].content,
          });
          const { error: errorInsertingData } = await supabase
            .from("briefs")
            .update({ summary: res })
            .eq("conversation_id", briefsData[i].conversation_id);
          if (errorInsertingData) {
            return errorInsertingData;
          }
          setBriefSummary((prev) => [...prev, res]);
        } else {
          setBriefSummary((prev) => [...prev, briefsData[i].summary]);
        }
      }
    }
    briefListData();
  }, [freelancerId]);

  function renderBriefs() {
    return briefList.map((i, index) => {
      const client = i.conversations?.clients;
      return (
        <div
          key={index}
          className=" z-2 flex flex-col w-[782px] gap-3 p-6 bg-white dark:bg-black border border-black/5 shadow-[0_0px_60px_15px_rgba(88,5,255,0.1)] dark:shadow-[0_0px_60px_15px_rgba(88,5,255,0.2)]"
        >
          <div className="flex flex-row justify-between items-center">
            <span className="text-sm text-interiqo-purple-400">
              {client?.organisation}
            </span>
            <span className="text-sm text-interiqo-black-100">
              {new Date(i.created_at).toLocaleDateString()}
            </span>
          </div>
          <h2 className="text-[31px] font-avant dark:text-white">
            {client?.first_name} {client?.last_name}
          </h2>
          <p className="text-sm text-interiqo-black-100 line-clamp-3">
            {briefSummary[index]}
          </p>
          <button className="flex items-center justify-center w-fit min-h-10 px-4 bg-white dark:bg-interiqo-black-400 border border-black/5 text-sm cursor-pointer dark:text-white">
            See more
          </button>
        </div>
      );
    });
  }

  if (briefList.length === 0) {
    return (
      <>
        <section className="flex flex-col justify-center  h-screen -mt-16 ">
          <div className="flex flex-col justify-center items-center gap-4">
            <h2 className="text-[31px] font-avant dark:text-white">
              No briefs{" "}
            </h2>
            <p className="text-sm text-interiqo-black-100">
              Send an invite to receive a brief{" "}
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="flex flex-col items-center overflow-y-auto h-screen pt-16 gap-4">
        {renderBriefs()}
      </section>
    </>
  );
}
