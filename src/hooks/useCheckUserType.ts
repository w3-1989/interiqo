import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";


export default function useCheckUserType(){

    const [userType, setUserType] = useState('')
    const [loading, setLoading] = useState(true)


    useEffect(() => {

        async function getUserType() {
            const {data, error} = await supabase.auth.getUser()

            if(error){
                console.log("useCheckUserType - Error getting user", error)
            }
            
            const freelancerData = await supabase
            .from('freelancers')
            .select()
            .eq('user_id', data.user!.id )


            if(!freelancerData.data!.length){
                setLoading(false)
                setUserType('client')
            } else if (freelancerData.data!.length){
                setLoading(false)
                setUserType('freelancer')

            }
        }
        getUserType()

    },[])

    return {userType, loading}

}