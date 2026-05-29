

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log(`Function "browser-with-cors" up and running!`)
const ANTHROPIC_SECRET_KEY = Deno.env.get('ANTHROPIC_SECRET_KEY');


Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try{
    console.log(req)
    const {summary} = await req.json()

    const system = `You are a specialist discovery consultant. You have been 
    given a project brief and your job is to distil it into a single, clear 
    sentence that gives the freelancer an immediate understanding of the project 
    at a glance — before they open the full brief. Be concise, specific and 
    professional. No preamble, no filler. Do not use bullet points, dashes, 
    bold, italic, or any other markdown formatting it must be written in plain 
    english and keep the response to no more than a single sentences`

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
      messages: [{role: "user", content: summary}],
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