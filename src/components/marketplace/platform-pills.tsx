import Link from "next/link";
import { Gamepad2, Tv, Sparkles, Brain, Shield, Gift, Music, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type Platform = {
  label: string;
  href: string;
  icon: React.ReactNode;
  gradient: string;
};

const platforms: Platform[] = [
  { label: "Steam",     href: "/category/cd-keys?platform=steam",       icon: <Globe size={16} />,    gradient: "from-[#1b2838] via-[#2a475e] to-[#66c0f4]" },
  { label: "PlayStation", href: "/category/gift-cards?platform=psn",    icon: <Gamepad2 size={16} />, gradient: "from-[#003791] via-[#0070d1] to-[#3ba0ff]" },
  { label: "Xbox",      href: "/category/gift-cards?platform=xbox",     icon: <Gamepad2 size={16} />, gradient: "from-[#0e7a0d] via-[#107c10] to-[#5fce5f]" },
  { label: "Nintendo",  href: "/category/cd-keys?platform=nintendo",    icon: <Gamepad2 size={16} />, gradient: "from-[#7a1414] via-[#e60012] to-[#ff5757]" },
  { label: "Netflix",   href: "/category/streaming?platform=netflix",   icon: <Tv size={16} />,       gradient: "from-[#7a0d12] via-[#e50914] to-[#ff5b66]" },
  { label: "Spotify",   href: "/category/streaming?platform=spotify",   icon: <Music size={16} />,    gradient: "from-[#0d6c3a] via-[#1db954] to-[#1ed760]" },
  { label: "ChatGPT",   href: "/category/ai-tools?platform=chatgpt",    icon: <Brain size={16} />,    gradient: "from-[#0a4a3f] via-[#10a37f] to-[#4ee0ba]" },
  { label: "VPN",       href: "/category/vpn",                          icon: <Shield size={16} />,   gradient: "from-emerald-700 via-emerald-500 to-cyan-400" },
  { label: "Free Fire", href: "/category/game-topup?platform=ff",       icon: <Sparkles size={16} />, gradient: "from-amber-600 via-orange-500 to-pink-500" },
  { label: "Gift Cards", href: "/category/gift-cards",                  icon: <Gift size={16} />,     gradient: "from-fuchsia-600 via-iris-500 to-cyan-500" },
];

export function PlatformPills() {
  return (
    <div className="flex flex-wrap gap-2 md:gap-2.5">
      {platforms.map((p) => (
        <Link
          key={p.label}
          href={p.href}
          className={cn(
            "group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-4 py-2.5",
            "border border-white/10 text-[13px] font-semibold text-white",
            "transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25",
          )}
        >
          <span
            className={cn(
              "absolute inset-0 -z-10 bg-gradient-to-br opacity-90 transition-opacity",
              p.gradient,
              "group-hover:opacity-100",
            )}
          />
          <span className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_30%_-10%,rgba(255,255,255,0.28),transparent_60%)]" />
          <span
            className={cn(
              "absolute inset-0 -z-10 rounded-full",
              "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)]",
            )}
          />
          <span className="grid h-5 w-5 place-items-center text-white/95">
            {p.icon}
          </span>
          {p.label}
        </Link>
      ))}
    </div>
  );
}
