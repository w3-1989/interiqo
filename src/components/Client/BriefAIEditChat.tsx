import { useState } from "react";
import { ArrowUp } from "lucide-react";
import callBriefUpdate from "../../lib/api/Client/callBriefUpdate";
import { supabase } from "../../lib/supabaseClient";
import { useClientData } from "../../hooks/useClientData";

type BriefAIEditChatProps = {
  brief: string;
  setBrief: React.Dispatch<React.SetStateAction<string>>;
  setAiChatToggle: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function BriefAIEditChat(props: BriefAIEditChatProps) {
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const { conversationId } = useClientData();

  async function handleSubmit() {
    const currentInput = userInput;
    setUserInput("");

    const unitedObj = {
      role: "user" as const,
      content: `Here is the current brief:\n\n${props.brief}\n\nPlease make this change: ${currentInput}`,
    };
    setLoading(true);
    const response = await callBriefUpdate(unitedObj);
    const newBrief = response ?? props.brief;
    props.setAiChatToggle(false);
    props.setBrief(newBrief);

    const { error } = await supabase
      .from("briefs")
      .update({ summary: newBrief })
      .eq("conversation_id", conversationId);
    if (error) {
      console.log("Error updating brief in db", error);
    }
    setLoading(false);
  }

  return (
    <>
      <div className="flex flex-row justify-between items-center p-2">
        <textarea
          className="outline-none border-none resize-none bg-transparent dark:text-white text-[14px] flex-1"
          value={userInput}
          placeholder="Suggest a change..."
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <button
          className="flex items-center justify-center min-h-10 min-w-10 bg-interiqo-purple-400 cursor-pointer"
          disabled={loading}
          onClick={() => handleSubmit()}
        >
          {loading ? (
            <span className="flex gap-1">
              <span className="dot-1 w-1 h-1 bg-white rounded-full" />
              <span className="dot-2 w-1 h-1 bg-white rounded-full" />
              <span className="dot-3 w-1 h-1 bg-white rounded-full" />
            </span>
          ) : (
            <ArrowUp color="white" className="w-[14px] h-[14px]" />
          )}
        </button>
      </div>
    </>
  );
}
