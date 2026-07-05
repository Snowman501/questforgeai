import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QuestForgeAI — The AI Co-Designer for Game Developers',
  description: 'Generate professional Game Design Documents instantly using AI. Built for indie devs, studios, and game design hobbyists.',
  keywords: 'game design, AI, game development, GDD, indie game, RPG, game designer tool',
  openGraph: {
    title: 'QuestForgeAI',
    description: 'The AI Co-Designer for Game Developers',
    url: 'https://questforgeai.vercel.app',
    siteName: 'QuestForgeAI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuestForgeAI',
    description: 'Generate pro Game Design Documents with AI instantly.',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚔️</text></svg>" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
