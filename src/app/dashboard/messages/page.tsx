import { MessageCircle, Send, Search, MoreHorizontal, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Messages · Seller dashboard · Digibazar" };

type Thread = {
  id: string;
  buyerName: string;
  initials: string;
  color: string;
  preview: string;
  time: string;
  unread: number;
  pinned?: boolean;
};

const threads: Thread[] = [
  { id: "t1", buyerName: "Tanvir Hossain",  initials: "TH", color: "from-iris-400 to-iris-700",    preview: "Hey! Did the Netflix profile load okay?", time: "2m",  unread: 0, pinned: true },
  { id: "t2", buyerName: "Sumaiya Rahman",  initials: "SR", color: "from-pink-400 to-fuchsia-600", preview: "Thanks brother, working perfectly 🙏",   time: "11m", unread: 0 },
  { id: "t3", buyerName: "Ariful Islam",    initials: "AI", color: "from-emerald-400 to-cyan-600", preview: "Can you give me 2 months extension?",   time: "1h",  unread: 2 },
  { id: "t4", buyerName: "Nusrat Jahan",    initials: "NJ", color: "from-amber-400 to-pink-500",   preview: "PUBG UC is taking time… please check.", time: "3h",  unread: 1 },
  { id: "t5", buyerName: "Rifat Chowdhury", initials: "RC", color: "from-cyan-400 to-iris-500",    preview: "Order placed via bKash, confirm?",      time: "1d",  unread: 0 },
];

const messages = [
  { from: "buyer",  text: "Vai assalamu alaikum, the Netflix login worked but the profile says someone else is using it.", time: "2:14 PM" },
  { from: "seller", text: "Wa-alaikum-salaam, sorry about that. I'm sending a fresh profile right now — give me 30 seconds.", time: "2:15 PM" },
  { from: "buyer",  text: "Thanks brother 🙏", time: "2:15 PM" },
  { from: "seller", text: "Done. Try logging in again with profile name 'Tanvir' and PIN 4823.", time: "2:16 PM" },
  { from: "buyer",  text: "Working now! Onek dhonnobad.", time: "2:18 PM" },
];

export default function MessagesPage() {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge variant="brand">
            <MessageCircle size={11} /> Inbox
          </Badge>
          <h1 className="mt-2 font-display text-2xl font-bold md:text-3xl">Customer messages</h1>
          <p className="mt-1 text-[14px] text-fg-muted">
            Reply within 12 hours to keep your seller score above 95%.
          </p>
        </div>
        <Button variant="secondary" size="md">Saved replies</Button>
      </div>

      <div className="mt-6 surface-card overflow-hidden">
        <div className="grid h-[640px] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Thread list */}
          <aside className="border-b border-white/5 lg:border-b-0 lg:border-r">
            <div className="border-b border-white/5 p-3">
              <div className="relative">
                <input
                  placeholder="Search messages..."
                  className="h-9 w-full rounded-md border border-white/10 bg-white/5 pl-9 pr-3 text-[13px] placeholder:text-fg-subtle focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
                />
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
              </div>
            </div>
            <div className="max-h-[576px] overflow-y-auto">
              {threads.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  className={`flex w-full items-start gap-3 border-b border-white/[0.04] px-4 py-3 text-left transition hover:bg-white/[0.03] ${
                    i === 0 ? "bg-iris-500/[0.06]" : ""
                  }`}
                >
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br ${t.color} font-display text-[12.5px] font-bold text-white`}>
                    {t.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[13.5px] font-semibold">{t.buyerName}</span>
                      <span className="text-[11px] text-fg-subtle">{t.time}</span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <p className="line-clamp-1 text-[12.5px] text-fg-muted">{t.preview}</p>
                      {t.unread > 0 && (
                        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-iris-500 px-1.5 text-[10.5px] font-bold text-white">
                          {t.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Active thread */}
          <section className="flex flex-col">
            <header className="flex items-center justify-between border-b border-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-iris-400 to-iris-700 font-display text-[12.5px] font-bold text-white">
                  TH
                </div>
                <div>
                  <div className="text-[14px] font-semibold">Tanvir Hossain</div>
                  <div className="text-[11.5px] text-fg-subtle inline-flex items-center gap-1">
                    <ShieldCheck size={11} className="text-success" />
                    Verified buyer · 28 orders with you
                  </div>
                </div>
              </div>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-md text-fg-muted hover:bg-white/5">
                <MoreHorizontal size={16} />
              </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => {
                const mine = m.from === "seller";
                return (
                  <div key={i} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-[13.5px] ${
                        mine
                          ? "bg-iris-500 text-white"
                          : "bg-white/[0.06] text-fg"
                      }`}
                    >
                      <p>{m.text}</p>
                      <div
                        className={`mt-1 text-[10.5px] ${
                          mine ? "text-white/70" : "text-fg-subtle"
                        }`}
                      >
                        {m.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <form className="flex items-center gap-2 border-t border-white/5 p-3">
              <input
                placeholder="Write a reply..."
                className="h-10 flex-1 rounded-md border border-white/10 bg-white/5 px-3 text-[13.5px] placeholder:text-fg-subtle focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
              />
              <Button size="md">
                <Send size={14} /> Send
              </Button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
