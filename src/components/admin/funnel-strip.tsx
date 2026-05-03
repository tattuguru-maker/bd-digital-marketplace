"use client";

import { cn, formatNumber } from "@/lib/utils";

export type FunnelStep = { label: string; value: number };

export function FunnelStrip({ steps }: { steps: FunnelStep[] }) {
  const peak = Math.max(1, ...steps.map((s) => s.value));
  return (
    <div className="grid gap-2 md:grid-cols-5">
      {steps.map((s, i) => {
        const prev = i === 0 ? null : steps[i - 1];
        const conv =
          prev && prev.value > 0
            ? Math.round((s.value / prev.value) * 100)
            : null;
        const widthPct = (s.value / peak) * 100;
        return (
          <div
            key={s.label}
            className="surface-card relative overflow-hidden p-3"
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              {s.label}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-2xl font-extrabold gradient-text">
                {formatNumber(s.value)}
              </span>
              {conv !== null && (
                <span
                  className={cn(
                    "text-[11px] font-semibold",
                    conv >= 50
                      ? "text-success"
                      : conv >= 20
                        ? "text-amber-300"
                        : "text-fg-subtle",
                  )}
                >
                  {conv}%
                </span>
              )}
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${widthPct}%`,
                  background:
                    "linear-gradient(90deg, #5b3dff 0%, #7a64ff 50%, #2dd4ff 100%)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
