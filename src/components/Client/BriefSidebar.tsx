import { useUserData } from "../../hooks/useUserData";
import { Square } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Clock, BadgePoundSterling } from "lucide-react";

const projectMap = [
  { heading: "Discovery ", status: "completed" },
  { heading: "Submit Brief ", status: "inProgress" },
  { heading: "Receive Plan from Freelancer ", status: "pending" },
  { heading: "Start Project ", status: "pending" },
];

export default function BriefSideBar() {
  const { companyName, clientName, clientLastName, conversationId } =
    useUserData();

  const navigate = useNavigate();

  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  async function handleBriefSubmit() {
    if (!conversationId) {
      return console.log("No conversation ID found");
    }

    const { error } = await supabase
      .from("briefs")
      .update({ status: "submitted" })
      .eq("conversation_id", conversationId);

    if (error) {
      return console.log("Error updating brief status", error);
    }

    navigate("/client-dashboard");
  }

  function renderRoadMap() {
    return projectMap.map((i, index) => {
      return (
        <div key={index} className="flex flex-col ">
          <div className="flex flex-row gap-6 items-center">
            <Square
              style={{ animationDelay: `${1 + index * 0.6}s` }}
              color="#5805FF"
              fill={
                i.status === "completed" || i.status === "inProgress"
                  ? "#5805FF"
                  : "transparent"
              }
              className={`w-[24px] h-[24px] animate-fadeIn ${i.status === "inProgress" ? "animate-pulse" : ""}`}
            />
            <span className="text-[16px] text-black dark:text-white">
              {i.heading}
            </span>
          </div>
          {index !== projectMap.length - 1 ? (
            <div
              style={{ animationDelay: `${1 + index * 0.6}s` }}
              className={`h-[60px] origin-top border-l-2 ${i.status === "completed" || i.status === "inProgress" ? "border-solid" : "border-dashed"} border-interiqo-purple-400 ml-[11px] animate-growDown`}
            />
          ) : null}
        </div>
      );
    });
  }

  return (
    <>
      <section className="flex flex-col  flex-1 w-full h-full pl-4 border-l border-black/10 dark:border-white/10 justify-between">
        <div className="flex flex-col">
          <div className=" flex flex-col text-[19px] font-avant text-interiqo-purple-400 justify-start">
            {companyName}
          </div>
          <div className=" flex flex-col text-[31px] font-avant text-black dark:text-white justify-start">
            {clientName} {clientLastName}
          </div>
          <div className=" flex flex-col text-[12px] font-DMSans text-black dark:text-white justify-start mb-20 ">
            {date}
          </div>
          {companyName && clientName ? renderRoadMap() : null}
        </div>



        <div className="flex flew-row justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-3">
              <Clock className="w-4 h-4 text-interiqo-purple-400" />
              <span className="text-[12px] text-black dark:text-white">
                6 months
              </span>
            </div>
            <div className="flex flex-row items-center gap-3">
              <BadgePoundSterling className="w-4 h-4 text-interiqo-purple-400" />
              <span className="text-[12px] text-black dark:text-white">
                £25,000 - £35,000
              </span>
            </div>
          </div>
          <button
            onClick={() => handleBriefSubmit()}
            className="flex items-center justify-center p-3 w-fit min-h-[38px] bg-interiqo-purple-400 text-[12px] text-white  cursor-pointer border border-black/10 "
          >
            Submit brief
          </button>
        </div>
      </section>
    </>
  );
}
