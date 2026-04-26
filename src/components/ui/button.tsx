import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "gold" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 font-medium tracking-tight " +
  "rounded-lg transition-all duration-200 select-none whitespace-nowrap " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-[15px]",
};

const variants: Record<Variant, string> = {
  primary:
    "text-white border border-white/10 brand-gradient brand-glow hover:brightness-110 active:brightness-95",
  secondary:
    "bg-white/8 text-fg border border-white/10 hover:bg-white/12 active:bg-white/15",
  ghost:
    "bg-transparent text-fg-muted hover:text-fg hover:bg-white/5",
  outline:
    "bg-transparent text-fg border border-border-strong hover:bg-white/5",
  gold:
    "text-zinc-900 bg-gradient-to-br from-gold-300 to-gold-500 hover:brightness-110 border border-gold-400/40 shadow-[0_0_30px_-10px_rgba(247,201,72,0.6)]",
  danger:
    "bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  children,
  ...props
}: CommonProps & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <Link
      href={href}
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
