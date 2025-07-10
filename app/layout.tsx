import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Familia del Shilo',
  description: 'האתר המשפחתי של משפחת שילה',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
