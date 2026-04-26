import { cn } from "@/lib/utils";

type Method = {
  name: string;
  short: string;
  bg: string;
  text: string;
};

const methods: Method[] = [
  { name: "bKash",  short: "bK",   bg: "bg-pink-600",    text: "text-white" },
  { name: "Nagad",  short: "Ng",   bg: "bg-orange-500",  text: "text-white" },
  { name: "Rocket", short: "Rk",   bg: "bg-purple-600",  text: "text-white" },
  { name: "Upay",   short: "Up",   bg: "bg-emerald-500", text: "text-white" },
  { name: "Visa",   short: "VISA", bg: "bg-blue-600",    text: "text-white" },
  { name: "Master", short: "MC",   bg: "bg-zinc-700",    text: "text-white" },
];

export function PaymentMethods({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {methods.map((m) => (
        <span
          key={m.name}
          title={m.name}
          className={cn(
            "inline-flex items-center justify-center rounded-md text-[10px] font-bold tracking-tight",
            m.bg,
            m.text,
            compact ? "h-6 min-w-10 px-1.5" : "h-7 min-w-12 px-2"
          )}
        >
          {m.short === "VISA" || m.short === "MC" ? m.name : m.short}
        </span>
      ))}
    </div>
  );
}
