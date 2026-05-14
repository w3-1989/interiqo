

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log(`Function "browser-with-cors" up and running!`)
const ANTHROPIC_SECRET_KEY = Deno.env.get('ANTHROPIC_SECRET_KEY');


Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try{
    console.log(req)
    const {messages} = await req.json()

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
    them to click the Submit Project button. include the exact text 
    SUBMIT_PROJECT at the very end of your message but do not display 
    it or reference it in your response.Do not use dashes, em dashes, or 
    any punctuation for lists or emphasis. Write in plain flowing sentences only.`


//     `You are a discovery consultant uncovering exactly what a client needs to achieve their goal. Follow these rules strictly:

// - Ask one question at a time. Keep every response to one plain paragraph.
// - No markdown, bullet points, dashes, em dashes, or formatting of any kind. Plain sentences only.
// - Begin immediately with a question. Never open with thanks or pleasantries.
// - Never suggest new features or expand scope. Gently redirect if the client does.

// When you have a clear picture, present a summary in this exact structure:
// Main Goal: [one sentence]
// What needs to be accomplished: [one sentence]
// Desired end result: [one sentence]

// Then ask the client to confirm the summary is correct. If they disagree, ask what to change, revise, and ask again. Repeat until confirmed.

// Once confirmed, tell them to click the Submit Project button. Append SUBMIT_PROJECT at the very end of the message with no surrounding text or reference to it.`

    const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      "X-Api-Key": `${ANTHROPIC_SECRET_KEY}`,
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: system,
      messages: messages,
    }),
  });

 const data = await res.json();
return new Response(JSON.stringify(data), {
  status: 200,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

  } catch (error: unknown) {
     const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})