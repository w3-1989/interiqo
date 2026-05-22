const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ANTHROPIC_SECRET_KEY = Deno.env.get("ANTHROPIC_SECRET_KEY");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages, files, base64Files } = await req.json();

    const system = `You are a specialist discovery consultant for clients who 
    have a desire but lack the knowledge to fully understand what needs to be 
    done to achieve it. Your role is to have a focused conversation to uncover 
    exactly what they need. Ask one question at a time and keep responses to a 
    single plain paragraph. Do not use markdown, bullet points, dashes or any 
    formatting. Do not thank the client for reaching out, go straight into 
    questions. Push back gently if the client introduces ideas beyond the 
    initial scope. Do not suggest new features or expand scope under any 
    circumstances. Once you have a clear picture of their needs you must 
    present a summary in this exact format: Main Goal, What needs to be 
    accomplished, Desired end result. You must then ask the client to 
    confirm this summary is correct before ending the session. If they 
    disagree, ask what needs changing and revise the summary before 
    asking for confirmation again. Only when the client confirms the 
    summary is correct should you end the conversation by telling 
    them to click the Generate brief button. Include the exact text 
    SUBMIT_PROJECT at the very end of your message but do not display 
    it or reference it in your response. Do not use dashes, em dashes, or 
    any punctuation for lists or emphasis. Write in plain flowing sentences only.`;

    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      png: "image/png",
      webp: "image/webp",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      txt: "text/plain",
    };

    const fileIdArr: { id: string; mimeType: string }[] = [];

    if (base64Files && base64Files.length > 0) {
      for (let i = 0; i < base64Files.length; i++) {
        const extension = files[i].filename.split(".").pop().toLowerCase();
        const mimeType = mimeTypes[extension] ?? "application/octet-stream";

        // Efficient base64 to Uint8Array conversion — avoids CPU-heavy loop
        const bytes = Uint8Array.from(atob(base64Files[i]), (c) =>
          c.charCodeAt(0)
        );

        const blob = new Blob([bytes], { type: mimeType });
        const formData = new FormData();
        formData.append("file", blob, files[i].filename);

        const uploadRes = await fetch("https://api.anthropic.com/v1/files", {
          method: "POST",
          headers: {
            "anthropic-version": "2023-06-01",
            "anthropic-beta": "files-api-2025-04-14",
            "X-Api-Key": `${ANTHROPIC_SECRET_KEY}`,
          },
          body: formData,
        });

        const uploadData = await uploadRes.json();
        fileIdArr.push({ id: uploadData.id, mimeType });
      }
    }

    const updatedMessages =
      fileIdArr.length > 0
        ? [
            ...messages.slice(0, -1),
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: messages[messages.length - 1].content,
                },
                ...fileIdArr.map((item) =>
                  item.mimeType.includes("image")
                    ? {
                        type: "image",
                        source: { type: "file", file_id: item.id },
                      }
                    : {
                        type: "document",
                        source: { type: "file", file_id: item.id },
                      }
                ),
              ],
            },
          ]
        : messages;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "anthropic-beta": "files-api-2025-04-14",
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "X-Api-Key": `${ANTHROPIC_SECRET_KEY}`,
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 1024,
        system: system,
        messages: updatedMessages,
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});