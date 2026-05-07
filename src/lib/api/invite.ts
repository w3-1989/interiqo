import { supabase } from "../supabaseClient";


export default async function sendInvite (firstName: string, lastName: string, email: string){
    const {data, error} = await supabase.functions.invoke("send-invite", {
        body: {firstName, lastName, email}
    })

    if(error){
        console.log(error)
    } else {
        console.log("Data received")
    }
}

