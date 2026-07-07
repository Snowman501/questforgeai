'use client'
import { useState, useEffect } from 'react'

// ==== MONETIZATION SETTINGS (edit these two links when ready) ====
const STRIPE_LINK = 'https://buy.stripe.com/YOUR_PAYMENT_LINK'   // Stripe → Payment Links
const KOFI_LINK = 'https://ko-fi.com/YOUR_PAGE/shop'             // Your Ko-fi shop item
const FREE_DAILY_LIMIT = 5                                        // free forges per day

const GENRES = ['Any Genre', 'RPG', 'Survival', 'Horror', 'Puzzle', 'Platformer', 'Strategy', 'Roguelike', 'Adventure', 'Simulation']

const GENRE_EXAMPLES: Record<string, { idea: string; hint: string }> = {
  'Any Genre': { idea: '', hint: 'Describe any game idea and let AI pick the best genre...' },
  'RPG': { idea: 'A disgraced knight who lost his memory must rebuild his legacy in a kingdom on the brink of war.', hint: 'Think: hero arc, factions, skill trees, deep lore...' },
  'Survival': { idea: 'The last librarian protecting ancient knowledge from raiders in a post-apocalyptic world.', hint: 'Think: resource scarcity, base building, day/night threats...' },
  'Horror': { idea: 'A lighthouse keeper who realizes the fog outside contains something that mimics human voices.', hint: 'Think: dread, atmosphere, limited resources, isolation...' },
  'Puzzle': { idea: 'A time-traveler who must rearrange historical events to prevent a paradox from erasing reality.', hint: 'Think: mechanic-driven challenges, aha moments, clever design...' },
  'Platformer': { idea: 'A shadow that escapes its owner and must navigate a world of light and darkness to find freedom.', hint: 'Think: movement feel, level design, obstacles, power-ups...' },
  'Strategy': { idea: 'A city builder where your citizens are ghosts and you manage the needs of the living and dead.', hint: 'Think: resource management, factions, tech trees, win conditions...' },
  'Roguelike': { idea: 'A cartographer who maps cursed dungeons that rearrange themselves every run.', hint: 'Think: procedural generation, permadeath, run variety, meta progression...' },
  'Adventure': { idea: 'An underwater explorer discovering a sunken civilization that never stopped living.', hint: 'Think: exploration, NPC relationships, narrative discovery, player agency...' },
  'Simulation': { idea: 'You manage a magical academy where student spells keep accidentally destroying the campus.', hint: 'Think: systems depth, feedback loops, sandbox freedom, progression...' },
}

export default function Home() {
  const [idea, setIdea] = useState('')
  const [genre, setGenre] = useState('Any Genre')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [visible, setVisible] = useState(false)

  // ---- Pro / license state ----
  const [isPro, setIsPro] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [licenseInput, setLicenseInput] = useState('')
  const [activating, setActivating] = useState(false)
  const [activateMsg, setActivateMsg] = useState('')
  const [usedToday, setUsedToday] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('qf_history')
    if (saved) setHistory(JSON.parse(saved))

    // Restore daily usage counter (resets each calendar day)
    const today = new Date().toDateString()
    const usage = JSON.parse(localStorage.getItem('qf_usage') || '{}')
    setUsedToday(usage.date === today ? usage.count : 0)

    // Re-validate a saved license key against the server on every load
    const key = localStorage.getItem('qf_license')
    if (key) {
      fetch('/api/license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      })
        .then(r => r.json())
        .then(d => setIsPro(!!d.valid))
        .catch(() => {})
    }
  }, [])

  const bumpUsage = () => {
    const today = new Date().toDateString()
    const usage = JSON.parse(localStorage.getItem('qf_usage') || '{}')
    const count = (usage.date === today ? usage.count : 0) + 1
    localStorage.setItem('qf_usage', JSON.stringify({ date: today, count }))
    setUsedToday(count)
  }

  const handleGenreChange = (g: string) => {
    setGenre(g)
    setIdea(GENRE_EXAMPLES[g]?.idea || '')
  }

  const forge = async () => {
    if (!idea.trim()) return

    // Free-tier daily gate
    if (!isPro && usedToday >= FREE_DAILY_LIMIT) {
      setShowUpgrade(true)
      return
    }

    setLoading(true)
    setResult('')
    setVisible(false)
    const res = await fetch('/api/forge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-License-Key': localStorage.getItem('qf_license') || '',
      },
      body: JSON.stringify({ idea: `${genre !== 'Any Genre' ? `[${genre}] ` : ''}${idea}` })
    })
    const data = await res.json()
    setResult(data.result)
    setLoading(false)
    setTimeout(() => setVisible(true), 50)
    if (!isPro) bumpUsage()
    const newHistory = [data.result, ...history].slice(0, 5)
    setHistory(newHistory)
    localStorage.setItem('qf_history', JSON.stringify(newHistory))
  }

  const activateLicense = async () => {
    const key = licenseInput.trim()
    if (!key) return
    setActivating(true)
    setActivateMsg('')
    try {
      const res = await fetch('/api/license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      })
      const data = await res.json()
      if (data.valid) {
        localStorage.setItem('qf_license', key)
        setIsPro(true)
        setActivateMsg('✅ Pro unlocked! Welcome aboard.')
        setTimeout(() => setShowUpgrade(false), 1200)
      } else {
        setActivateMsg('❌ Key not recognized — check for typos and try again.')
      }
    } catch {
      setActivateMsg('⚠️ Could not reach the server. Try again in a moment.')
    }
    setActivating(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const exportPDF = () => {
    // PDF export is a Pro feature
    if (!isPro) {
      setShowUpgrade(true)
      return
    }
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html><head><title>QuestForgeAI GDD</title>
      <style>
        body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #1a1a1a; }
        h1 { color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
        h2 { color: #5b21b6; margin-top: 30px; }
        h3 { color: #6d28d9; }
        li { margin-bottom: 6px; }
        p { line-height: 1.7; }
      </style></head>
      <body>
        <h1>⚔️ QuestForgeAI — Game Design Document</h1>
        <p><em>Generated by QuestForgeAI — questforgeai.vercel.app</em></p>
        <hr/>
        ${result.replace(/\n/g, '<br/>').replace(/### (.*)/g, '<h3>$1</h3>').replace(/## (.*)/g, '<h2>$1</h2>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
      </body></html>
    `)
    win.document.close()
    win.print()
  }

  const formatResult = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return <h3 key={i} className="text-purple-400 text-xl font-bold mt-6 mb-2 border-b border-purple-800 pb-1">{line.replace('### ', '')}</h3>
      if (line.startsWith('## ')) return <h2 key={i} className="text-purple-300 text-2xl font-bold mt-8 mb-3">{line.replace('## ', '')}</h2>
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="text-white font-bold mt-4 text-lg">{line.replace(/\*\*/g, '')}</p>
      if (line.startsWith('- ')) return <li key={i} className="text-gray-300 ml-4 list-disc mb-1">{line.replace('- ', '').replace(/\*\*/g, '')}</li>
      if (line.match(/^\d+\./)) return <li key={i} className="text-gray-300 ml-4 list-decimal mb-1">{line.replace(/^\d+\.\s/, '').replace(/\*\*/g, '')}</li>
      if (line.trim() === '') return <br key={i} />
      return <p key={i} className="text-gray-300 mb-2">{line.replace(/\*\*/g, '')}</p>
    })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <main className="flex-1 flex flex-col items-center p-4 sm:p-8 pt-12 sm:pt-16">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl sm:text-5xl font-bold text-purple-400 text-center">⚔️ QuestForgeAI</h1>
          {isPro ? (
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black px-2 py-1 rounded-md tracking-wider">PRO</span>
          ) : (
            <button onClick={() => setShowUpgrade(true)}
              className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-black px-2 py-1 rounded-md tracking-wider transition-all">
              ⭐ GO PRO
            </button>
          )}
        </div>
        <p className="text-gray-400 text-lg sm:text-xl mb-2 text-center">The AI Co-Designer for Game Developers</p>
        {!isPro && (
          <p className="text-gray-600 text-xs mb-6">{Math.max(0, FREE_DAILY_LIMIT - usedToday)} of {FREE_DAILY_LIMIT} free forges left today</p>
        )}

        <div className="w-full max-w-2xl">
          <select
            value={genre}
            onChange={(e) => handleGenreChange(e.target.value)}
            className="w-full bg-gray-800 border border-purple-700 text-white rounded-xl p-3 mb-3 focus:outline-none focus:border-purple-400"
          >
            {GENRES.map(g => <option key={g}>{g}</option>)}
          </select>

          <textarea
            className="w-full bg-gray-800 rounded-xl p-4 text-white placeholder-gray-500 border border-purple-700 focus:outline-none focus:border-purple-400 h-36 sm:h-40"
            placeholder={GENRE_EXAMPLES[genre]?.hint || 'Describe your game idea...'}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          <p className="text-gray-600 text-xs mt-1 ml-1">{GENRE_EXAMPLES[genre]?.hint}</p>

          <div className="flex gap-3 mt-4">
            <button
              onClick={forge}
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900 text-white font-bold py-3 px-6 rounded-xl text-base sm:text-lg transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙️</span> Forging...
                </span>
              ) : '⚡ Forge My Game'}
            </button>
            {result && (
              <button
                onClick={forge}
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-5 rounded-xl transition-all"
                title="Regenerate"
              >
                🔄
              </button>
            )}
          </div>
        </div>

        {result && (
          <div className={`mt-8 w-full max-w-2xl bg-gray-800 rounded-xl p-4 sm:p-6 border border-purple-700 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex gap-3 mb-4 flex-wrap">
              <button onClick={copyToClipboard} className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition-all">
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
              <button onClick={exportPDF} className="bg-purple-700 hover:bg-purple-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition-all">
                📄 Export PDF {!isPro && <span className="text-amber-400">⭐</span>}
              </button>
            </div>
            {formatResult(result)}
          </div>
        )}

        {history.length > 1 && (
          <div className="mt-8 w-full max-w-2xl">
            <h3 className="text-gray-500 text-sm font-bold mb-2">📚 RECENT SESSIONS</h3>
            <div className="flex flex-col gap-2">
              {history.slice(1).map((h, i) => (
                <button key={i} onClick={() => { setResult(h); setTimeout(() => setVisible(true), 50) }}
                  className="text-left bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-xl p-3 text-gray-400 text-sm truncate transition-all">
                  {h.slice(0, 80)}...
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ==== UPGRADE / LICENSE MODAL ==== */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowUpgrade(false) }}>
          <div className="bg-gray-900 border border-purple-600 rounded-2xl p-6 max-w-sm w-full text-center">
            <h3 className="text-2xl font-bold text-amber-400 mb-2">⭐ QuestForge Pro</h3>
            <p className="text-gray-300 text-sm mb-4">
              Unlimited forges, longer &amp; deeper design documents, and PDF export.
              One-time purchase — yours forever.
            </p>
            <a href={STRIPE_LINK} target="_blank" rel="noopener noreferrer"
              className="block bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl mb-2 transition-all">
              💳 Get Pro — $12
            </a>
            <a href={KOFI_LINK} target="_blank" rel="noopener noreferrer"
              className="block bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-xl mb-4 transition-all">
              ☕ Buy on Ko-fi
            </a>
            <p className="text-gray-500 text-xs mb-2">Your license key arrives by email within minutes.</p>
            <input
              value={licenseInput}
              onChange={(e) => setLicenseInput(e.target.value)}
              placeholder="SLNG-XXXX-XXXX-XXXX"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white text-center tracking-widest placeholder-gray-600 focus:outline-none focus:border-purple-400 mb-2"
            />
            <button onClick={activateLicense} disabled={activating}
              className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white font-bold py-3 rounded-xl transition-all">
              {activating ? 'Checking...' : '🔑 Activate License'}
            </button>
            {activateMsg && <p className="text-sm mt-2 text-gray-300">{activateMsg}</p>}
            <button onClick={() => setShowUpgrade(false)}
              className="text-gray-500 hover:text-gray-300 text-sm mt-4 transition-all">
              Maybe later
            </button>
          </div>
        </div>
      )}

      <footer className="border-t border-gray-800 py-6 text-center text-gray-600 text-sm">
        <p>⚔️ QuestForgeAI — Built by <span className="text-purple-500 font-semibold">SL NextGen Global</span></p>
        <p className="mt-1">The AI Co-Designer for Game Developers</p>
      </footer>
    </div>
  )
}
