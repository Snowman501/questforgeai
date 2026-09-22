import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  //
  // 1. GROQ
  //
  try {
    console.log("Trying GROQ...");
    const groq = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (groq.ok) {
      const data = await groq.json();
      return NextResponse.json({
        provider: "groq",
        output: data.choices[0].message.content
      });
    }

    console.log("GROQ failed:", await groq.text());
  } catch (err) {
    console.log("GROQ error:", err);
  }

  //
  // 2. GEMINI
  //
  try {
    console.log("Trying GEMINI...");
    const gemini = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    if (gemini.ok) {
      const data = await gemini.json();
      return NextResponse.json({
        provider: "gemini",
        output: data.candidates[0].content.parts[0].text
      });
    }

    console.log("GEMINI failed:", await gemini.text());
  } catch (err) {
    console.log("GEMINI error:", err);
  }

  //
  // 3. GROK
  //
  try {
    console.log("Trying GROK...");
    const grok = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROK_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (grok.ok) {
      const data = await grok.json();
      return NextResponse.json({
        provider: "grok",
        output: data.choices[0].message.content
      });
    }

    console.log("GROK failed:", await grok.text());
  } catch (err) {
    console.log("GROK error:", err);
  }

  //
  // 4. OLLAMA (local fallback)
  //
  try {
    console.log("Trying OLLAMA...");
    const ollama = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt,
        stream: false
      })
    });

    if (ollama.ok) {
      const data = await ollama.json();
      return NextResponse.json({
        provider: "ollama",
        output: data.response
      });
    }

    console.log("OLLAMA failed:", await ollama.text());
  } catch (err) {
    console.log("OLLAMA error:", err);
  }

  //
  // FINAL FAIL
  //
  return NextResponse.json({
    provider: "none",
    output: "All providers failed. Try again later."
  });
}

