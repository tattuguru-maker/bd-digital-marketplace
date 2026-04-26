import { cn } from "@/lib/utils";

export function ProductArt({
  brandColor,
  brandLabel,
  className,
  rounded = "rounded-xl",
  size = "md",
}: {
  brandColor: string;
  brandLabel: string;
  className?: string;
  rounded?: string;
  size?: "sm" | "md" | "lg";
}) {
  const fontSize =
    size === "lg" ? "text-2xl md:text-3xl" : size === "sm" ? "text-[11px]" : "text-base";
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-white/10",
        rounded,
        `bg-gradient-to-br ${brandColor}`,
        className
      )}
    >
      {/* glossy shine */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_60%_at_30%_-10%,rgba(255,255,255,0.25),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(80%_50%_at_100%_120%,rgba(0,0,0,0.5),transparent_50%)]" />
      {/* ring */}
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[inherit]" />
      {/* grid pattern */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.07]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M 22 0 L 0 0 0 22" fill="none" stroke="white" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div className="relative z-10 h-full w-full flex items-center justify-center p-3">
        <span
          className={cn(
            "font-display font-black tracking-tight uppercase text-white/95 text-center leading-tight drop-shadow",
            fontSize
          )}
        >
          {brandLabel}
        </span>
      </div>
    </div>
  );
}
