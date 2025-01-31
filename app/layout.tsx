// app/layout.tsx
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://mydoamin.online'),
  title: "Free DeepSeek AI Chat Platform - Try Deepseek",
  description: "Experience free and powerful AI conversations with Deepseek, Our platform powered by DeepSeek AI.",
  keywords: ["DeepSeek AI", "free AI chat", "AI platform", "Try Deepseek", "edge AI", "chat interface", "Try Deepseek R1", "Deepseek R1"],
  authors: [{ name: 'Deepseek R1', url: 'https://mydoamin.online/' }],
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': 'standard',
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Free DeepSeek AI Chat Platform - Deepseek R1",
    description: "Experience free and powerful AI conversations with Deepseek R1, a black and grey themed platform powered by DeepSeek AI.",
    url: 'https://mydoamin.online/',
    siteName: 'tryDeepseek R1',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Deepseek R1 - Free DeepSeek AI Chat Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Free DeepSeek AI Chat Platform - fennec.chat",
    description: "Experience free and powerful AI conversations with Deepseek R1, a black and grey themed platform powered by DeepSeek AI.",
    site: '@yourtwitterhandle',
    creator: '@yourtwitterhandle',
    images: ['/twitter-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className={`${inter.className} h-full overflow-hidden bg-background text-foreground`}>
        <main className="flex h-full w-full flex-col overflow-auto bg-background">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}