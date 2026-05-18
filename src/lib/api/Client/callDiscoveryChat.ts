import { supabase } from "../../supabaseClient";
import type { FileUpload } from "../../../types/FileUpload";
import type { Messages } from "../../../types/Messages";

export default async function callDiscoveryChat(messages: Messages[], files:FileUpload[], base64Files: string[]){
    const {data, error:errorCallDiscoveryChat} = await supabase.functions.invoke("discovery-chat", {
        body:{messages, files, base64Files},
    })

    if(errorCallDiscoveryChat){
        console.log("callDiscoveryChat - Error calling discovery chat", errorCallDiscoveryChat)
        throw errorCallDiscoveryChat
    }

    if((!data || !data.content || data.content.length === 0)){
        console.log(data)
        console.log("callDiscoveryChat - Couldn't find conversation data", errorCallDiscoveryChat)
        throw errorCallDiscoveryChat
    }

    console.log("Data received")
    return data.content[0].text
}