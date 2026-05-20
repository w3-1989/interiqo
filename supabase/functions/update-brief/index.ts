

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
    const {message} = await req.json()

    const system = `You are a project brief editor. You will receive an existing 
    brief and a change request. Rewrite the brief incorporating the requested change. 
    Keep the same structure and format with ## headings. Return only the updated brief 
    with no preamble or commentary.
    `

    const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      "X-Api-Key": `${ANTHROPIC_SECRET_KEY}`,
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 2048,
      system: system,
      messages: [message],
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