import Link from "next/link";
import { Breadcrumb } from "@/components/marketplace/breadcrumb";

export type LegalSection = {
  id: string;
  title: string;
  body: React.ReactNode;
};

export function LegalShell({
  title,
  intro,
  effectiveDate,
  sections,
}: {
  title: string;
  intro: string;
  effectiveDate: string;
  sections: LegalSection[];
}) {
  return (
    <div className="container-page py-10">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: title }]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="surface-card sticky top-44 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              On this page
            </div>
            <ul className="mt-3 space-y-1.5 text-[13px]">
              {sections.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`#${s.id}`}
                    className="text-fg-muted transition hover:text-fg"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="lg:col-span-9">
          <h1 className="font-display text-3xl font-extrabold md:text-[40px] md:leading-tight">
            {title}
          </h1>
          <div className="mt-2 text-[13px] text-fg-subtle">
            Effective {effectiveDate} · Digibazar Bangladesh Ltd.
          </div>
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-fg-muted">
            {intro}
          </p>

          <div className="mt-10 space-y-10">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-44">
                <h2 className="font-display text-xl font-bold md:text-2xl">
                  {s.title}
                </h2>
                <div className="prose-legal mt-3 space-y-3 text-[14.5px] leading-relaxed text-fg-muted">
                  {s.body}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 surface-card p-5 text-[13.5px] text-fg-muted">
            Questions about this page? Email{" "}
            <Link
              href="mailto:legal@digibazar.bd"
              className="text-iris-200 hover:text-iris-100"
            >
              legal@digibazar.bd
            </Link>{" "}
            or call our 24/7 support line at <strong>16263</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}
