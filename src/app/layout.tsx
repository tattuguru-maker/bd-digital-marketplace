import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { AnnouncementBar } from "@/components/site/announcement-bar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Digibazar — Bangladesh's premium digital marketplace",
  description:
    "Buy and sell digital products in Bangladesh — streaming subscriptions, game top-ups, CD keys, gift cards and more. Trusted sellers, instant delivery, full buyer protection. Pay with bKash, Nagad, Rocket.",
  keywords: [
    "Bangladesh", "digital marketplace", "Netflix BD", "Free Fire diamonds BD",
    "PUBG UC BD", "Steam keys Bangladesh", "ChatGPT Plus BD", "bKash gift cards",
    "Spotify BD", "Discord Nitro BD",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col">
        <AnnouncementBar />
        <Header />
        <main className="relative z-10 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
