import { cn } from "@/lib/utils";

type Variant = "default" | "brand" | "gold" | "success" | "danger" | "outline" | "ghost";

const variants: Record<Variant, string> = {
  default: "bg-white/5 text-fg border border-white/10",
  brand:   "bg-iris-500/15 text-iris-200 border border-iris-400/30",
  gold:    "bg-gold-400/15 text-gold-300 border border-gold-400/30",
  success: "bg-success/15 text-success border border-success/30",
  danger:  "bg-danger/15 text-danger border border-danger/30",
  outline: "bg-transparent text-fg-muted border border-border-strong",
  ghost:   "bg-white/3 text-fg-muted border border-transparent",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
