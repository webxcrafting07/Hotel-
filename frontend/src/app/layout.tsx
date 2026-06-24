import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/layout/ThemeProvider"
import { Toaster } from "react-hot-toast"
import { QueryProvider } from "@/components/layout/QueryProvider"
import { AuthProvider } from "@/components/layout/AuthProvider"

export const metadata: Metadata = {
  title: {
    default: "Hotel The Anand | Luxury Hotel in Puri, Odisha",
    template: "%s | Hotel The Anand",
  },
  description: "Experience unmatched luxury at Hotel The Anand, Puri. Premium rooms, world-class amenities, and impeccable service in the heart of Odisha.",
  keywords: ["luxury hotel", "Puri hotel", "Odisha hotel", "hotel anand", "five star hotel puri"],
  authors: [{ name: "Hotel The Anand" }],
  creator: "Hotel The Anand",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://hotelanand.com",
    siteName: "Hotel The Anand",
    title: "Hotel The Anand | Luxury Hotel in Puri, Odisha",
    description: "Experience unmatched luxury at Hotel The Anand.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Hotel The Anand" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotel The Anand | Luxury Hotel in Puri",
    description: "Experience unmatched luxury at Hotel The Anand, Puri.",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://hotelanand.com"),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <AuthProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: { background: "#1a1a1a", color: "#fff", border: "1px solid #C9A84C" },
                }}
              />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
