import { Mail, Send } from "lucide-react";

export function Newsletter() {
  return (
    <div className="glass-card relative overflow-hidden p-7 md:p-12">
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_15%_-10%,rgba(91,61,255,0.30),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_85%_110%,rgba(45,212,255,0.20),transparent_60%)]" />

      <div className="relative grid items-center gap-6 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
            <Mail size={12} /> Stay in the loop
          </div>
          <h2 className="mt-3.5 font-display text-2xl font-extrabold leading-tight text-white md:text-3xl">
            Subscribe to our newsletter and get
            <br />
            updates on the best deals in Bangladesh
          </h2>
          <p className="mt-3 max-w-md text-[14px] text-fg-muted md:text-[15px]">
            By subscribing, you agree to receive commercial communications from
            Digibazar via email — including promotional offers and product news.
          </p>
        </div>

        <form
          className="md:col-span-5"
          action="#"
          method="post"
        >
          <div className="glass-pill flex items-center gap-1 rounded-full p-2">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="h-11 flex-1 bg-transparent px-4 text-[14px] text-fg placeholder:text-fg-subtle focus:outline-none"
              required
            />
            <button
              type="submit"
              className="brand-gradient brand-glow inline-flex h-11 items-center gap-1.5 rounded-full border border-white/15 px-6 text-[14px] font-semibold text-white transition hover:brightness-110"
            >
              <Send size={15} /> Subscribe
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-fg-subtle">
            <span>Trusted by 62,000+ buyers</span>
            <span className="h-3 w-px bg-white/15" />
            <span>Unsubscribe anytime</span>
          </div>
        </form>
      </div>
    </div>
  );
}
