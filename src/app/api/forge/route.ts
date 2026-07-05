import { NextRequest, NextResponse } from 'next/server'

const GENRE_PROMPTS: Record<string, string> = {
  'RPG': 'Focus on deep character progression, branching storylines, party mechanics, skill trees, and rich lore.',
  'Survival': 'Focus on resource scarcity, base building, threat escalation, crafting systems, and environmental danger.',
  'Horror': 'Focus on psychological dread, atmosphere, limited resources, enemy AI behavior, and narrative tension.',
  'Puzzle': 'Focus on mechanic-driven challenges, difficulty curves, aha moments, environmental storytelling, and replayability.',
  'Platformer': 'Focus on movement mechanics, level design philosophy, obstacle variety, power-ups, and speedrun potential.',
  'Strategy': 'Focus on resource management, win conditions, faction design, tech trees, and player decision depth.',
  'Roguelike': 'Focus on procedural generation, permadeath tension, run variety, meta progression, and build synergies.',
  'Adventure': 'Focus on exploration, narrative discovery, NPC relationships, world building, and player agency.',
  'Simulation': 'Focus on systems depth, feedback loops, player goals, progression milestones, and sandbox freedom.',
  'Any Genre': 'Be creative and suggest the best fitting genre for this idea.'
}

export async function POST(req: NextRequest) {
  try {
    const { idea } = await req.json()

    const genreMatch = idea.match(/^\[(.+?)\]/)
    const genre = genreMatch ? genreMatch[1] : 'Any Genre'
    const genrePrompt = GENRE_PROMPTS[genre] || GENRE_PROMPTS['Any Genre']

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{
          role: 'system',
          content: `You are QuestForgeAI, an expert game design co-designer. ${genrePrompt} Always respond with a fully structured Game Design Document using markdown headers (###) for each section.`
        }, {
          role: 'user',
          content: `Game idea: "${idea}". Generate a structured GDD with: 1) Genre & Core Mechanics 2) Core Gameplay Loop 3) Main Characters/NPCs 4) World & Setting 5) Monetization Hooks. Be creative, specific, and inspiring.`
        }]
      })
    })

    const data = await response.json()
    console.log('Groq response:', JSON.stringify(data))

    const result = data.choices[0].message.content
    return NextResponse.json({ result })

  } catch (err) {
    console.error('Route error:', err)
    return NextResponse.json({ result: 'Something went wrong. Check terminal logs.' })
  }
}
