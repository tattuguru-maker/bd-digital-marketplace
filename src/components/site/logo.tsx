import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const fontSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2 group", className)}>
      <span className="relative inline-grid h-8 w-8 place-items-center rounded-md brand-gradient brand-glow">
        <span className="font-display font-black text-white text-lg leading-none">D</span>
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-gold-400 shadow-[0_0_10px_rgba(247,201,72,0.7)]" />
      </span>
      <span className={cn("font-display font-bold tracking-tight gradient-text", fontSize)}>
        Digibazar
      </span>
    </Link>
  );
}
