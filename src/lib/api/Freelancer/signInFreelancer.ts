import { supabase } from "../../supabaseClient";


export default async function signInFreelancer (email: string, password:string){
            const {error:errorSigningInFreelancer} = await supabase.auth.signInWithPassword({
                email: email,
                password:password,
            })

            if(errorSigningInFreelancer){
                console.log("signInFreelancer - Error when signing in user", errorSigningInFreelancer)
                throw errorSigningInFreelancer
            }

}
