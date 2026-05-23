import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function useCheckUserType() {
  const [userType, setUserType] = useState<"client" | "freelancer" | "">("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        setUserType("");
        setLoading(false);
        return;
      }

      async function getUserType(isRetry = false) {
        setLoading(true);
        const { data: freelancerData, error } = await supabase
          .from("freelancers")
          .select()
          .eq("user_id", session?.user.id);

        if (error) {
          console.log("useCheckUserType - unable to get user id", error);
        }

        if (freelancerData!.length > 0) {
          setUserType("freelancer");
          setLoading(false);
        } else if (event === "SIGNED_IN" && !isRetry) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          getUserType(true);
          return;
        } else {
          setUserType("client");
          setLoading(false);
        }
      }

      getUserType();
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return { userType, loading };
}
