import { createClient, SupabaseClient} from "@supabase/supabase-js";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ANTHROPIC_SECRET_KEY = Deno.env.get("ANTHROPIC_SECRET_KEY");


const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase:SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }


    try {
    const {messages, briefId, userInput} = await req.json()
    const {data: briefData, error: errorFetchingBriefData} = await supabase 
    .from('briefs')
    .select()
    .eq('id', briefId)

    if(!briefData){
      throw new Error("No brief data ", errorFetchingBriefData)
    }

    if(errorFetchingBriefData){
      throw new Error("Error fetching brief data",errorFetchingBriefData)
    }

    const system = `You are a knowledgeable project assistant helping a freelancer 
    understand a client brief. Answer questions conversationally and concisely — 
    like a colleague who has read the brief thoroughly. Keep responses short and 
    direct. Only use information from the brief and discovery conversation below. 
    Do not invent details.

    Brief: ${briefData[0].content}

    Discovery conversation: ${briefData[0].full_transcript}

    Your job is to answer the freelancer's questions about the project clearly and concisely. 
    Draw only from the brief and discovery conversation — do not invent details or expand scope. 
    Write in plain professional prose, no bullet points, no markdown formatting.`;



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
        messages: [...messages, { role: "user", content: userInput }],
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