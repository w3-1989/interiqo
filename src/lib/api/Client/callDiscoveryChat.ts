import type { FileUpload } from "../../../types/FileUpload";
import type { Messages } from "../../../types/Messages";
import callClaude from "../callClaude";

export default async function callDiscoveryChat(
  messages: Messages[],
  files: FileUpload[],
  base64Files: string[],
) {
  const discoveryChat = await callClaude("discovery-chat", {
    messages,
    files,
    base64Files,
  });
  return discoveryChat;
}
