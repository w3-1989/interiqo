import { supabase } from "../../supabaseClient";

//Make sure to change to actual url on prod
export default async function forgotPassword( email: string ){
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://www.interiqo.com/reset-password',
    })

    if(error){
        throw error
    }

}