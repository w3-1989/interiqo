import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"


export default function useAuth(){

    const [userIsLoggedIn, setUserIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(()=> {
       async function getLoggedInUser(){
        const {data, error} = await supabase.auth.getSession()

        if(!data.session){
            setLoading(false)
            console.log("useAuth - error getting users logged in state", error)
        } else {
            setLoading(false)
            setUserIsLoggedIn(true)
        }
       }

       getLoggedInUser()
    },[])
    
    return {userIsLoggedIn, loading}
   
}