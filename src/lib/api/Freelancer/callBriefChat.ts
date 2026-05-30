import callClaude from "../callClaude";
import type { Messages } from "../../../types/Messages";

export default async function callBriefChat(
  messages: Messages[],
  briefId: number,
  userInput: string,
) {
  const briefChat = await callClaude("brief-chat", {
    messages,
    briefId,
    userInput,
  });
  return briefChat;
}