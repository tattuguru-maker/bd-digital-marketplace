import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  size = 14,
  showNumber = false,
  className,
}: {
  rating: number;
  size?: number;
  showNumber?: boolean;
  className?: string;
}) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="inline-flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const isFull = i < full;
          const isHalf = i === full && half;
          return (
            <Star
              key={i}
              width={size}
              height={size}
              className={cn(
                isFull || isHalf
                  ? "fill-gold-400 text-gold-400"
                  : "fill-transparent text-white/15",
                "drop-shadow-[0_0_4px_rgba(247,201,72,0.25)]"
              )}
              strokeWidth={1.5}
            />
          );
        })}
      </span>
      {showNumber && (
        <span className="text-[12px] font-medium text-fg-muted">
          {rating.toFixed(2)}
        </span>
      )}
    </span>
  );
}
