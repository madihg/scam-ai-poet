import './globals.css'
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: "Whomp – AI bot fine-tuned on Halim Madi's voice to reply to scammers",
  description:
    "Whomp is an AI bot built with the Vercel AI SDK and fine-tuned on Halim Madi's poetry."
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Courier, monospace' }}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
