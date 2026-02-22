import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://pomodoro-battle.vercel.app'),
  title: 'Pomodoro Battle ⚔️',
  description: 'Геймифицированный планировщик задач: побеждай боссов, выполняя дела',
  keywords: ['pomodoro', 'tasks', 'gamification', 'productivity', 'timer'],
  authors: [{ name: 'Pomodoro Battle Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Pomodoro Battle',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    title: 'Pomodoro Battle ⚔️',
    description: 'Геймифицированный планировщик задач: побеждай боссов, выполняя дела',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pomodoro Battle ⚔️',
    description: 'Геймифицированный планировщик задач: побеждай боссов, выполняя дела',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#020617',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
