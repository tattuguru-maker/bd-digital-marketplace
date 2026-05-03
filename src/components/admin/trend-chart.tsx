"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type TrendPoint = { date: number; count: number };

type Accent = "iris" | "cyan";

const ACCENT_FILL: Record<Accent, string> = {
  iris: "#7a64ff",
  cyan: "#2dd4ff",
};

const ACCENT_STROKE: Record<Accent, string> = {
  iris: "#a89bff",
  cyan: "#7eecff",
};

/**
 * Compact bar+line chart showing 30 days of historical data plus a forecast
 * tail. Pure SVG, no chart library — stays consistent with the rest of the
 * design system.
 */
export function TrendChart({
  history,
  forecast,
  accent = "iris",
  height = 140,
}: {
  history: TrendPoint[];
  forecast: TrendPoint[];
  accent?: Accent;
  height?: number;
}) {
  const all = useMemo(
    () => [...history, ...forecast].map((p) => p.count),
    [history, forecast],
  );
  const max = Math.max(1, ...all);
  const total = history.length + forecast.length;
  const barW = 100 / total;
  const fill = ACCENT_FILL[accent];
  const stroke = ACCENT_STROKE[accent];

  const [hover, setHover] = useState<{
    idx: number;
    isForecast: boolean;
  } | null>(null);

  const dateLabel = (d: number) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

  const hovered =
    hover === null
      ? null
      : hover.isForecast
        ? forecast[hover.idx - history.length]
        : history[hover.idx];

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 100 ${height}`}
        className="block w-full"
        style={{ height }}
        preserveAspectRatio="none"
      >
        {/* gridlines */}
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={0}
            x2={100}
            y1={height - height * t}
            y2={height - height * t}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="1.5 2"
            strokeWidth={0.4}
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* bars */}
        {history.map((p, i) => {
          const h = (p.count / max) * (height - 16);
          return (
            <rect
              key={`h-${i}`}
              x={i * barW + barW * 0.1}
              y={height - h - 1}
              width={barW * 0.8}
              height={Math.max(1, h)}
              fill={fill}
              opacity={hover?.idx === i ? 1 : 0.8}
              rx={0.6}
              onMouseEnter={() => setHover({ idx: i, isForecast: false })}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
        {forecast.map((p, j) => {
          const i = history.length + j;
          const h = (p.count / max) * (height - 16);
          return (
            <rect
              key={`f-${i}`}
              x={i * barW + barW * 0.1}
              y={height - h - 1}
              width={barW * 0.8}
              height={Math.max(1, h)}
              fill="transparent"
              stroke={stroke}
              strokeDasharray="1.5 1.5"
              strokeWidth={0.6}
              rx={0.6}
              vectorEffect="non-scaling-stroke"
              onMouseEnter={() => setHover({ idx: i, isForecast: true })}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}

        {/* divider between history and forecast */}
        {forecast.length > 0 && (
          <line
            x1={history.length * barW}
            x2={history.length * barW}
            y1={0}
            y2={height}
            stroke="rgba(255,255,255,0.18)"
            strokeDasharray="1 1.5"
            strokeWidth={0.5}
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>

      {hovered !== null && hover !== null && (
        <div
          className={cn(
            "pointer-events-none absolute -top-1 -translate-x-1/2 -translate-y-full rounded-md border border-white/10 bg-zinc-900/90 px-2 py-1 text-[11px] text-fg shadow-lg",
            hover.isForecast && "border-dashed border-iris-300/40",
          )}
          style={{ left: `${(hover.idx + 0.5) * barW}%` }}
        >
          <div className="font-semibold">
            {hovered.count}
            <span className="ml-1 text-fg-subtle">
              {hover.isForecast ? "(forecast)" : ""}
            </span>
          </div>
          <div className="text-[10px] text-fg-subtle">
            {dateLabel(hovered.date)}
          </div>
        </div>
      )}
    </div>
  );
}
