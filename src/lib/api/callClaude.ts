import { supabase } from "../supabaseClient";




export default async function callClaude(edgeFunction: string, body:Record<string, unknown>){
    const {data, error: errorCallingCalude} = await supabase.functions.invoke(edgeFunction,{
        body: body
    })
    if(errorCallingCalude){
        console.log("callClaude - Error calling claude", errorCallingCalude)
        throw errorCallingCalude
    }

    if((!data || !data.content || data.content.length === 0)){
        console.log(data)
        throw new Error("callClaude - Empty response from edge function")
    }
    return data.content[0].text
}