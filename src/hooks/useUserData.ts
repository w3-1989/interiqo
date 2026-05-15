import { useState, useEffect } from "react"
import type { AuthError, PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

export const useUserData = () => {
  const [conversationId, setConversationId] = useState(null);
  const [clientName, setClientName] = useState("");
  const [error, setError] = useState<AuthError | PostgrestError>();
  useEffect(() => {
    async function fetchConvoId() {
      const {
        data: { user },
        error: errorGettingUser,
      } = await supabase.auth.getUser();

      if (errorGettingUser) {
        console.log("DiscoveryChat - error getting the user", errorGettingUser);
        setError(errorGettingUser);
      }

      const { data: clientData, error: errorSelectingClientData } =
        await supabase.from("clients").select().eq("user_id", user!.id);

      if (clientData) {
        setClientName(clientData[0].first_name);

        const { data: conversationData, error: errorSelectingConversationId } =
          await supabase
            .from("conversations")
            .select("id")
            .eq("client_id", clientData![0].id);

        if (errorSelectingConversationId) {
          console.log(
            "DiscoveryChat - error selecting conversation id",
            errorSelectingConversationId,
          );
          setError(errorSelectingConversationId);
        } else {
          console.log("Conversation id assigned");
          setConversationId(conversationData![0].id);
        }
      } else {
        setError(errorSelectingClientData);
      }
    }

    fetchConvoId();
  }, []);

  return { clientName, conversationId, error };
};