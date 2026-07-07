import { NextRequest, NextResponse } from 'next/server'

// POST /api/license — validates a license key against the Supabase brain.
// The frontend calls this when the user taps "Activate" and on page load.
// WHY server-side: the service_role key must never reach the browser, so
// the browser asks US, and WE ask Supabase.

async function checkLicense(key: string | null | undefined): Promise<boolean> {
  if (!key || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) return false
  try {
    const r = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/licenses?key=eq.${encodeURIComponent(key.trim())}&select=key&limit=1`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
        },
        cache: 'no-store',
      }
    )
    if (!r.ok) return false
    const rows = await r.json()
    return Array.isArray(rows) && rows.length > 0
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json()
    const valid = await checkLicense(key)
    return NextResponse.json({ valid })
  } catch {
    return NextResponse.json({ valid: false })
  }
}
