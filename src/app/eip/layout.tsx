import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { EipProvider } from "@/lib/eip/context";
import { EipSidebar } from "@/components/eip/sidebar";

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
  title: "EIP — Cohort Identification System",
  description:
    "Birmingham City Council Early Intervention & Prevention — identify low-volume, high-value cohorts for proactive prevention interventions.",
};

export default function EipLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex">
        <EipProvider>
          <EipSidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-6 lg:p-8 max-w-[1400px]">{children}</div>
          </main>
        </EipProvider>
      </body>
    </html>
  );
}
