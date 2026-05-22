import type { Messages } from "../../../types/Messages";
import callClaude from "../callClaude";

export default async function callGenerateTitle(message: Messages) {
  const generatedTitle = await callClaude("generate-title", { message });
  return generatedTitle;
}
