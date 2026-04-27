"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type RailProps = {
  eyebrow?: React.ReactNode;
  title: string;
  subtitle?: string;
  link?: { label: string; href: string };
  children: React.ReactNode;
  /**
   * Tailwind width classes applied to each child wrapper, e.g.
   * "w-[180px] md:w-[200px]". Defaults to a product-card-sized rail.
   */
  itemWidthClass?: string;
  className?: string;
};

export function ProductRail({
  eyebrow,
  title,
  subtitle,
  link,
  children,
  itemWidthClass = "w-[180px] sm:w-[200px] md:w-[220px]",
  className,
}: RailProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.8), behavior: "smooth" });
  };

  // Wrap each child in a sized slide
  const items = Array.isArray(children) ? children : [children];

  return (
    <section className={cn("relative", className)}>
      <div className="container-page flex flex-wrap items-end justify-between gap-3">
        <div>
          {eyebrow && (
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-iris-300">
              {eyebrow}
            </div>
          )}
          <h2 className="mt-1 font-display text-xl font-bold md:text-2xl">{title}</h2>
          {subtitle && <p className="mt-1 max-w-xl text-sm text-fg-muted">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {link && (
            <Link
              href={link.href}
              className="text-[13px] text-iris-200 hover:text-iris-100"
            >
              {link.label} →
            </Link>
          )}
          <div className="hidden items-center gap-1.5 sm:flex">
            <RailButton
              ariaLabel="Scroll left"
              disabled={!canPrev}
              onClick={() => scrollBy(-1)}
            >
              <ChevronLeft size={16} />
            </RailButton>
            <RailButton
              ariaLabel="Scroll right"
              disabled={!canNext}
              onClick={() => scrollBy(1)}
            >
              <ChevronRight size={16} />
            </RailButton>
          </div>
        </div>
      </div>

      <div className="relative mt-5">
        {/* Edge fades */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-bg to-transparent transition-opacity",
            canPrev ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-bg to-transparent transition-opacity",
            canNext ? "opacity-100" : "opacity-0",
          )}
        />

        <div
          ref={scrollerRef}
          className="container-page scrollbar-none overflow-x-auto scroll-smooth"
        >
          <div className="flex gap-3 pb-1 snap-x snap-mandatory">
            {items.map((child, i) => (
              <div
                key={i}
                className={cn("shrink-0 snap-start", itemWidthClass)}
              >
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RailButton({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "glass-pill grid h-9 w-9 place-items-center rounded-full text-fg-muted transition",
        "hover:text-fg hover:bg-white/10",
        "disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent",
      )}
    >
      {children}
    </button>
  );
}
