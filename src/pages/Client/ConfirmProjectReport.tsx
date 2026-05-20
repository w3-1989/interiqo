/*
Future fix - currently fetches the first conversation found for this client.
When multi-project support is added, the conversation_id should be passed
as a URL param from DiscoveryChat to ensure the correct conversation brief
is generated and stored.
*/

import Background from "../../assets/backgrounds/GeometricBG.svg?react";
import BriefContent from "../../components/Client/BriefContent";
import TopBarSimple from "../../components/General/TopBarSimple";
import BriefSideBar from "../../components/Client/BriefSidebar";
import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";
import callBrief from "../../lib/api/Client/callBrief";
import callGenerateTitle from "../../lib/api/Client/callGenerateTitle";

export default function ConfirmProjectReport() {
  const [brief, setBrief] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    async function getMessages() {
      const {
        data: { user },
        error: errorGettingUser,
      } = await supabase.auth.getUser();

      if (!user) {
        console.log(
          "ConfirmProjectReport - error finding user data, data doesn't exist",
          errorGettingUser,
        );
        throw errorGettingUser;
      }

      if (errorGettingUser) {
        console.log(
          "ConfirmProjectReport - error getting the user",
          errorGettingUser,
        );
        throw errorGettingUser;
      }

      const { data: clientData, error: errorSelectingClientData } =
        await supabase.from("clients").select().eq("user_id", user!.id);

      if (!clientData) {
        console.log(
          "ConfirmProjectReport - error finding client data",
          errorSelectingClientData,
        );
        throw errorSelectingClientData;
      }

      if (errorSelectingClientData) {
        console.log(
          "ConfirmProjectReport - error selecting client data",
          errorSelectingClientData,
        );
        throw errorSelectingClientData;
      }

      const { data: conversationId, error: errorSelectingConversationId } =
        await supabase
          .from("conversations")
          .select()
          .eq("client_id", clientData![0].id);

      if (errorSelectingConversationId) {
        console.log(
          "ConfirmProjectReport - error selecting conversation id",
          errorSelectingConversationId,
        );
        throw errorSelectingConversationId;
      }

      const { data: fetchExistingBrief, error: errorFetchingExistingBrief } =
        await supabase
          .from("briefs")
          .select()
          .eq("conversation_id", conversationId![0].id);

      if (fetchExistingBrief && fetchExistingBrief.length > 0) {
        setBrief(fetchExistingBrief[0].summary);

        setTitle(fetchExistingBrief[0].title)
        return;
      }

      if (errorFetchingExistingBrief) {
        console.log(
          "ConfirmProjectReport - error fetching messages related to user",
          errorFetchingExistingBrief,
        );
        throw errorFetchingExistingBrief;
      }

      const { data: messages, error: errorFetchingMessages } = await supabase
        .from("messages")
        .select()
        .eq("conversation_id", conversationId![0].id);

      if (errorFetchingMessages) {
        console.log(
          "ConfirmProjectReport - error fetching messages related to user",
          errorFetchingMessages,
        );
        throw errorFetchingMessages;
      }

      const filteredMessages = messages!
        .map(({ role, content }) => ({
          role: role as "user" | "assistant",
          content,
        }))
        .filter(
          (_, index, arr) =>
            !(index === arr.length - 1 && arr[index].role === "assistant"),
        );

      const briefResults = await callBrief(filteredMessages);
      setBrief(briefResults);

      const unitedObj = {
        role: "user" as const,
        content: briefResults,
      };

      const briefTitle = await callGenerateTitle(unitedObj);
      setTitle(briefTitle);


      const { data: existingBrief, error: errorCheckingExistingBrief } =
        await supabase
          .from("briefs")
          .select()
          .eq("conversation_id", conversationId![0].id);

      if (errorCheckingExistingBrief) {
        console.log(
          "ConfirmProjectReport - error checking existing briefs",
          errorCheckingExistingBrief,
        );
        throw errorCheckingExistingBrief;
      }

      if (existingBrief && existingBrief.length === 0) {
        const { error: errorUpdatingBrief } = await supabase
          .from("briefs")
          .insert({
            summary: briefResults,
            full_transcript: JSON.stringify(messages),
            conversation_id: conversationId![0].id,
            title: briefTitle,
          });

        if (errorUpdatingBrief) {
          console.log(
            "ConfirmProjectReport - error updating brief data",
            errorUpdatingBrief,
          );
          throw errorUpdatingBrief;
        }
        
      } else {
        return console.log("Item exists");
      }
    }
    getMessages();
  }, []);

  return (
    <>
      <div className="h-screen flex flex-col dark:bg-interiqo-black-500 ">
        <Background className="absolute h-screen opacity-20" />
        <TopBarSimple />
        <section className=" flex justify-center align-middle items-center max-w-[1088px] h-[700px] w-full mx-auto shadow-[0_4px_120px_30px_rgba(88,5,255,0.1)] dark:shadow-[0_4px_120px_30px_rgba(88,5,255,0.2)]  ">
          <div className="z-2 w-full h-full flex flex-row bg-white dark:bg-black border border-black/5 p-6 gap-4">
            <BriefContent brief={brief} setBrief={setBrief} title={title} />
            <BriefSideBar />
          </div>
        </section>
      </div>
    </>
  );
}
