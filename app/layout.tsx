import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Jersey_25 } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const jersey25 = Jersey_25({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jersey-25",
})

export const metadata: Metadata = {
  title: "saegems",
  description: "Retro Pixelated User Feedback Page",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Source+Sans+Pro:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${jersey25.variable} crt-effect`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
