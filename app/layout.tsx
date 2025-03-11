import type React from "react"
import { Header } from "@/components/layout/header"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Red Sea Tours - Explore Egypt's Red Sea</title>
        <meta name="description" content="Book tours and activities in Egypt's Red Sea region" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Header />
          {children}
          <footer className="border-t py-6 md:py-10">
            <div className="container flex flex-col items-center justify-center gap-4 text-center md:gap-6">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Red Sea Tours. All rights reserved.
              </p>
            </div>
          </footer>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
