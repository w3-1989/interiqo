import type { Messages } from "../../../types/Messages";
import callClaude from "../callClaude";

export default async function callBriefUpdate( message: Messages){
    const briefUpdate = await callClaude("update-brief", {message})
    return briefUpdate
}