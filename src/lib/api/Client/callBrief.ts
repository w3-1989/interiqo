import type { Messages } from "../../../types/Messages";
import callClaude from "../callClaude";


export default async function callBrief( messages: Messages[]){
    const brief = await callClaude("generate-brief", {messages})
    return brief
}