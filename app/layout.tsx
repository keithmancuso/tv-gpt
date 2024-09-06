import type { Metadata } from 'next'
import Link from 'next/link'
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/theme-toggle"

import './globals.css'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Watch Tonight',
  description: 'Your personal television assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-muted font-sans antialiased",
        GeistSans.variable,
        GeistMono.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="sticky top-0 z-50 w-full bg-background border-b border-slate-200 dark:border-slate-800">
            <div className="container">
              <div className=" pt-2 pb-2 flex justify-between">
                <Link href="/" className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 mr-2">
                    <path d="M19.5 6h-15v9h15V6Z" />
                    <path fillRule="evenodd" d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v11.25C1.5 17.16 2.34 18 3.375 18H9.75v1.5H6A.75.75 0 0 0 6 21h12a.75.75 0 0 0 0-1.5h-3.75V18h6.375c1.035 0 1.875-.84 1.875-1.875V4.875C22.5 3.839 21.66 3 20.625 3H3.375Zm0 13.5h17.25a.375.375 0 0 0 .375-.375V4.875a.375.375 0 0 0-.375-.375H3.375A.375.375 0 0 0 3 4.875v11.25c0 .207.168.375.375.375Z" clipRule="evenodd" />
                  </svg>
                  <h1 className="text-2xl font-bold">Up Next</h1>
                </Link>
                <div className="ml-6">
                  <ModeToggle />
                </div>
              </div>
            </div>
          </header>
          <div className="container">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
