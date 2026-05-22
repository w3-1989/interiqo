import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function useCheckUserType() {
  const [userType, setUserType] = useState<"client" | "freelancer" | "">("")
;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {

      if (!session) {
        setUserType("");
        setLoading(false);
        return
      }

      async function getUserType() {
         setLoading(true)
        const { data:freelancerData, error } = await supabase
          .from("freelancers")
          .select()
          .eq("user_id", session?.user.id );

          if(error){
            console.log("useCheckUserType - unable to get user id", error)
          }

          if( freelancerData!.length > 0){
            setUserType('freelancer')
            setLoading(false)
          } else if (freelancerData!.length === 0){
            setUserType("client")
            setLoading(false)
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
