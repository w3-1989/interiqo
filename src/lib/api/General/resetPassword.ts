import { supabase } from "../../supabaseClient";


export default async function resetPassword (password: string){
    const { error } = await supabase.auth.updateUser({
    password: password
})

    if(error){
        throw error
    }
}