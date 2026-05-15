import { useState, useEffect} from "react"
import type { AuthError, PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

export const useFreelancerData = () => {
    const [freelancer_id, setFreelancerId] = useState("")
    const [error, setError] = useState<AuthError | PostgrestError>();


     useEffect(() => {
    async function fetchFreelancerId() {
      const {
        data: { user },
        error: errorGettingUser,
      } = await supabase.auth.getUser();

      if (errorGettingUser) {
        console.log("useFreelancerData - error getting the freelancer data", errorGettingUser);
        setError(errorGettingUser);
      }

      const { data: freelancerData, error: errorSelectingFreelancerData } =
        await supabase.from("freelancers").select().eq("user_id", user!.id);

        console.log("user.id", user!.id)
console.log("freelancerData", freelancerData)

      if (freelancerData) {
        setFreelancerId(freelancerData[0].id);

        if (errorSelectingFreelancerData) {
        console.log("useFreelancerData - error getting the freelancer id", errorSelectingFreelancerData);
        setError(errorSelectingFreelancerData);
      }
      }}
      

    fetchFreelancerId();

    
  }, []);


    return { freelancer_id, error };

}