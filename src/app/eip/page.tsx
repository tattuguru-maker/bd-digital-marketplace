"use client";

import { useEip } from "@/lib/eip/context";
import Link from "next/link";
import { Database, Filter, Play, TrendingUp, Users, Clock, ArrowRight } from "lucide-react";

export default function EipDashboard() {
  const { state, isLoaded } = useEip();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-fg-subtle">Loading...</div>
      </div>
    );
  }

  const totalSubjects = state.runs.reduce((acc, r) => acc + r.resultCount, 0);
  const latestRuns = [...state.runs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 5);

  const stats = [
    {
      label: "Data Sources",
      value: state.dataSources.length,
      icon: Database,
      href: "/eip/sources",
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
    },
    {
      label: "Criteria Sets",
      value: state.criteriaSets.length,
      icon: Filter,
      href: "/eip/criteria",
      color: "text-iris-400",
      bg: "bg-iris-400/10",
    },
    {
      label: "Cohort Runs",
      value: state.runs.length,
      icon: Play,
      href: "/eip/runs",
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Subjects Identified",
      value: totalSubjects,
      icon: Users,
      color: "text-gold-400",
      bg: "bg-gold-400/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-fg">
          Early Intervention &amp; Prevention
        </h1>
        <p className="mt-1 text-sm text-fg-muted">
          Identify low-volume, high-value cohorts for proactive prevention interventions
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="surface-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-fg-subtle uppercase tracking-wider">{s.label}</p>
                <p className="mt-1 text-3xl font-bold font-display text-fg">{s.value}</p>
              </div>
              <div className={`${s.bg} p-2.5 rounded-lg`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </div>
            {s.href && (
              <Link href={s.href} className="mt-3 flex items-center gap-1 text-xs text-iris-400 hover:text-iris-300">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="surface-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-fg-subtle" />
            <h2 className="font-display text-lg font-semibold text-fg">Recent Runs</h2>
          </div>
          {latestRuns.length === 0 ? (
            <div className="text-center py-8">
              <Play className="h-8 w-8 text-fg-subtle mx-auto mb-2" />
              <p className="text-sm text-fg-muted">No runs yet</p>
              <p className="text-xs text-fg-subtle mt-1">
                Upload data sources, define criteria, and run your first cohort identification
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {latestRuns.map((run) => (
                <Link
                  key={run.id}
                  href={`/eip/runs?view=${run.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-bg-elev hover:bg-surface transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-fg">{run.runId}</p>
                    <p className="text-xs text-fg-subtle">
                      {run.criteriaName} v{run.criteriaVersion}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-success">{run.resultCount} subjects</p>
                    <p className="text-xs text-fg-subtle">
                      {new Date(run.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-fg-subtle" />
            <h2 className="font-display text-lg font-semibold text-fg">Quick Start</h2>
          </div>
          <div className="space-y-3">
            {[
              {
                step: 1,
                title: "Upload Data Sources",
                desc: "Import CSV files from council data systems with automatic schema detection",
                href: "/eip/sources",
                done: state.dataSources.length > 0,
              },
              {
                step: 2,
                title: "Review Input Matrix",
                desc: "View unified data across all sources with schema mapping and lineage",
                href: "/eip/matrix",
                done: state.dataSources.length > 0,
              },
              {
                step: 3,
                title: "Define Criteria",
                desc: "Build boolean rules and threshold filters to identify target cohorts",
                href: "/eip/criteria",
                done: state.criteriaSets.length > 0,
              },
              {
                step: 4,
                title: "Run Identification",
                desc: "Execute criteria against the matrix to produce actionable cohort lists",
                href: "/eip/runs",
                done: state.runs.length > 0,
              },
            ].map((item) => (
              <Link
                key={item.step}
                href={item.href}
                className="flex items-center gap-4 p-3 rounded-lg bg-bg-elev hover:bg-surface transition-colors"
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    item.done
                      ? "bg-success/20 text-success"
                      : "bg-iris-500/15 text-iris-400"
                  }`}
                >
                  {item.step}
                </div>
                <div>
                  <p className={`text-sm font-medium ${item.done ? "text-fg-muted" : "text-fg"}`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-fg-subtle">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
