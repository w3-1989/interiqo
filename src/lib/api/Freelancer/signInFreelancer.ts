import { supabase } from "../../supabaseClient";


export default async function signIn (email: string, password:string){
            const {error:errorSigningIn} = await supabase.auth.signInWithPassword({
                email: email,
                password:password,
            })

            if(errorSigningIn){
                console.log("signInFreelancer - Error when signing in user", errorSigningIn)
                throw errorSigningIn
            }

}
