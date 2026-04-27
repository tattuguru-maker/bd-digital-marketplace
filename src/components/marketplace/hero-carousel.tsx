"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle: string;
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  art: string; // gradient
  artLabel: string;
  accent: "iris" | "amber" | "emerald" | "fuchsia";
};

export type HeroSidePanel = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  art: string; // gradient
  badge?: string;
  ctaLabel: string;
};

const ACCENTS: Record<HeroSlide["accent"], { glow: string; text: string }> = {
  iris:    { glow: "from-iris-500/40 via-iris-700/30 to-cyan-500/30",      text: "text-iris-200" },
  amber:   { glow: "from-amber-500/35 via-pink-500/30 to-iris-700/30",     text: "text-gold-300" },
  emerald: { glow: "from-emerald-500/30 via-cyan-500/30 to-iris-700/30",   text: "text-emerald-300" },
  fuchsia: { glow: "from-fuchsia-500/35 via-iris-500/30 to-cyan-500/30",   text: "text-fuchsia-200" },
};

export function HeroCarousel({
  slides,
  sidePanels,
}: {
  slides: HeroSlide[];
  sidePanels: HeroSidePanel[];
}) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, slides.length]);

  const go = (delta: number) => {
    setIndex((i) => (i + delta + slides.length) % slides.length);
  };

  return (
    <section className="container-page pt-10 md:pt-12">
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Main slide */}
        <div
          className="relative lg:col-span-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="glass-card relative h-[340px] overflow-hidden md:h-[420px] lg:h-[500px]">
            {slides.map((slide, i) => (
              <Slide key={slide.id} slide={slide} active={i === index} />
            ))}

            {/* Controls */}
            <button
              aria-label="Previous slide"
              onClick={() => go(-1)}
              className="glass-pill absolute left-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full text-white/80 transition hover:text-white hover:bg-white/15"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              aria-label="Next slide"
              onClick={() => go(1)}
              className="glass-pill absolute right-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full text-white/80 transition hover:text-white hover:bg-white/15"
            >
              <ChevronRight size={22} />
            </button>

            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index ? "w-7 bg-white/90" : "w-2 bg-white/30 hover:bg-white/50",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Side panel stack */}
        <div className="grid gap-5 lg:col-span-4">
          {sidePanels.map((panel) => (
            <SidePanel key={panel.id} panel={panel} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Slide({ slide, active }: { slide: HeroSlide; active: boolean }) {
  const accent = ACCENTS[slide.accent];
  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-700",
        active ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!active}
    >
      {/* Background art */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br",
          accent.glow,
        )}
      />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_85%_0%,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_5%_100%,rgba(0,0,0,0.55),transparent_60%)]" />
      {/* big brand callout art */}
      <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-[55%] md:block">
        <div className={cn("absolute inset-0 bg-gradient-to-br", slide.art)} />
        <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_60%_30%,rgba(255,255,255,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-bg-elev),transparent_45%)]" />
        <div className="absolute inset-0 grid place-items-center pr-8">
          <span className="font-display text-6xl font-black uppercase tracking-tight text-white/20 md:text-8xl">
            {slide.artLabel}
          </span>
        </div>
      </div>

      {/* Text */}
      <div className="relative z-10 flex h-full flex-col justify-end p-7 md:max-w-[60%] md:p-12">
        <div className={cn("text-[12px] font-semibold uppercase tracking-[0.22em]", accent.text)}>
          {slide.eyebrow}
        </div>
        <h1 className="mt-2.5 font-display text-3xl font-extrabold leading-tight text-white md:text-5xl lg:text-[56px] lg:leading-[1.05]">
          {slide.title}
          {slide.highlight && (
            <>
              {" "}
              <span className="gradient-text">{slide.highlight}</span>
            </>
          )}
        </h1>
        <p className="mt-3 max-w-lg text-[14px] text-white/75 md:text-[16px] md:leading-relaxed">
          {slide.subtitle}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={slide.cta.href}
            className="brand-gradient brand-glow inline-flex h-12 items-center rounded-lg border border-white/10 px-6 text-[15px] font-semibold text-white transition hover:brightness-110"
          >
            {slide.cta.label}
          </Link>
          {slide.secondaryCta && (
            <Link
              href={slide.secondaryCta.href}
              className="glass-pill inline-flex h-12 items-center rounded-lg px-6 text-[15px] font-medium text-white/90 transition hover:bg-white/15"
            >
              {slide.secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function SidePanel({ panel }: { panel: HeroSidePanel }) {
  return (
    <Link
      href={panel.href}
      className="glass-card group relative block flex-1 overflow-hidden p-6 transition hover:border-white/20"
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", panel.art)} />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_85%_-10%,rgba(255,255,255,0.22),transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(7,7,11,0.55))]" />
      <div className="relative flex h-full min-h-[130px] flex-col justify-between gap-3">
        <div className="flex items-start justify-between">
          {panel.badge && <Badge variant="gold">{panel.badge}</Badge>}
          <span className="inline-flex items-center gap-1 text-[12px] text-white/80">
            <Zap size={12} className="text-gold-300" /> Top up
          </span>
        </div>
        <div>
          <div className="font-display text-lg font-bold text-white md:text-xl">
            {panel.title}
          </div>
          <div className="mt-1 text-[13px] text-white/70">{panel.subtitle}</div>
          <div className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-white">
            {panel.ctaLabel}
            <ChevronRight
              size={14}
              className="transition group-hover:translate-x-0.5"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
