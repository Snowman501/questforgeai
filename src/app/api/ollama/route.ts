export async function POST(req: Request) {
  const { prompt, model } = await req.json();

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: model || "llama3",
      prompt
    })
  });

  const data = await response.json();
  return Response.json({ output: data.response });
}

