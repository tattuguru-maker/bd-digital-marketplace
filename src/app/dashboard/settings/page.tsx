import { Settings, Save, ShieldCheck, Wallet, Store, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Settings · Seller dashboard · Digibazar" };

export default function SettingsPage() {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge variant="brand">
            <Settings size={11} /> Settings
          </Badge>
          <h1 className="mt-2 font-display text-2xl font-bold md:text-3xl">Store settings</h1>
          <p className="mt-1 text-[14px] text-fg-muted">
            Manage your storefront, payouts, notifications and verification.
          </p>
        </div>
        <Button size="md">
          <Save size={14} /> Save changes
        </Button>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* Store profile */}
        <Section icon={<Store size={16} />} title="Store profile">
          <Field label="Display name" value="Dhaka Digital" />
          <Field label="Handle" value="@dhakadigital" />
          <Field label="Public location" value="Dhaka, Bangladesh" />
          <TextareaField
            label="Public bio"
            value="Bangladesh's most trusted streaming + game top-up reseller. 24/7 instant delivery, full warranty."
          />
        </Section>

        {/* Payouts */}
        <Section icon={<Wallet size={16} />} title="Payouts">
          <Field label="Primary method" value="bKash · 01711-234567" />
          <Field label="Backup method" value="DBBL · ****4421" />
          <Toggle label="Auto-payout daily at 11:59 PM" enabled />
          <div className="rounded-lg border border-iris-400/30 bg-iris-500/[0.08] p-3 text-[12.5px] text-iris-100">
            <div className="font-semibold text-fg">Onboarding plan · 0% platform fees</div>
            <p className="mt-0.5 text-fg-muted">
              Standard processor fees from bKash / cards still apply — these
              are charged by the processors, not by Digibazar.
            </p>
          </div>
        </Section>

        {/* Notifications */}
        <Section icon={<Bell size={16} />} title="Notifications">
          <Toggle label="New order placed" enabled />
          <Toggle label="Buyer message received" enabled />
          <Toggle label="Buyer protection dispute opened" enabled />
          <Toggle label="Weekly performance digest (Mondays)" enabled />
          <Toggle label="Promotional emails from Digibazar" />
        </Section>

        {/* Verification */}
        <Section icon={<ShieldCheck size={16} />} title="Verification & compliance">
          <KvRow label="Account status" value={<Badge variant="success">Verified</Badge>} />
          <KvRow label="KYC document" value="NID — submitted 12 Jan 2026" />
          <KvRow label="Trade license" value="DSCC-2025-018392" />
          <KvRow label="TIN" value="****-****-9012" />
          <KvRow label="Re-verification due" value="12 Jan 2027" />
        </Section>
      </div>
    </>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="surface-card p-5">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-iris-500/15 text-iris-300">
          {icon}
        </div>
        <h2 className="font-display text-lg font-bold">{title}</h2>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
        {label}
      </div>
      <input
        defaultValue={value}
        className="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-[13.5px] focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
      />
    </label>
  );
}

function TextareaField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
        {label}
      </div>
      <textarea
        defaultValue={value}
        rows={3}
        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-[13.5px] focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
      />
    </label>
  );
}

function Toggle({ label, enabled }: { label: string; enabled?: boolean }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-md border border-white/5 bg-white/[0.02] px-3 py-2.5 text-[13.5px]">
      <span className="text-fg-muted">{label}</span>
      <span
        className={`relative h-5 w-9 rounded-full transition ${
          enabled ? "bg-iris-500" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
            enabled ? "right-0.5" : "left-0.5"
          }`}
        />
      </span>
    </label>
  );
}

function KvRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/5 py-2.5 text-[13.5px] last:border-0">
      <span className="text-fg-muted">{label}</span>
      <span className="text-fg">{value}</span>
    </div>
  );
}
