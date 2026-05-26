import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useFreelancerData } from "../../hooks/useFreelancerData";
import type { Brief } from "../../types/Briefs";
export default function DisplayBriefs() {
  // 1. Hold the briefs list in state
  const [briefList, setBriefList] = useState<Brief[]>([]);
  const { freelancerId } = useFreelancerData();

  useEffect(() => {
    async function briefListData() {
      const { data: clientData, error: errorGettingClientData } = await supabase
        .from("clients")
        .select()
        .eq("freelancer_id", freelancerId);

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
        .select()
        .in("conversation_id", conversationId);

      if (!briefsData) {
        throw new Error("No client data");
      }

      if (errorGettingBriefData) throw new Error(errorGettingBriefData);

      setBriefList(briefsData);
    }
    briefListData();
  }, [freelancerId]);


  function renderBriefs(){
    return briefList.map((i,index) => {
        return (
            <span key={index}>{i.summary}</span>
        )
    })
  }

  if (briefList.length === 0 ) {
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
        {renderBriefs()}
    </>
  )



  // 3. Handle: loading / error / empty

  // 4. Map over briefs — one card per brief
  //    Each card: company name, client name, summary snippet,
  //    timestamp, "see more" action

  // 5. Return JSX:
  //    - Wrap everything in a scrollable container
  //    - If briefList is empty — show the empty state (already built?)
  //    - If briefList has items — map over briefList and return a card for each:
  //      - Top row: company name (left, purple) + formatted timestamp (right)
  //      - Client full name as a heading
  //      - Summary text truncated to 3 lines (line-clamp-3)
  //      - "See more" button
}
