"use client";

import { useState, useMemo } from "react";
import { useEip } from "@/lib/eip/context";
import { Rss, Copy, ExternalLink, Check } from "lucide-react";

export default function FeedPage() {
  const { state, isLoaded } = useEip();
  const [copied, setCopied] = useState(false);
  const feedUrl = useMemo(() => {
    if (typeof window === "undefined") return "/eip/api/feed";
    return `${window.location.origin}/eip/api/feed`;
  }, []);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const latestRun = [...state.runs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];

  if (!isLoaded) {
    return <div className="animate-pulse text-fg-subtle p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-fg">API Feed</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Read-only JSON feed endpoint for downstream tools and integrations
        </p>
      </div>

      <div className="surface-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Rss className="h-4 w-4 text-iris-400" />
          <h2 className="text-sm font-semibold text-fg">Feed Endpoint</h2>
        </div>

        <div className="flex items-center gap-2">
          <code className="flex-1 bg-bg-elev border border-border rounded-lg px-4 py-3 text-sm font-mono text-fg-muted overflow-x-auto">
            GET {feedUrl || "/eip/api/feed"}
          </code>
          <button
            onClick={() => copyUrl(feedUrl)}
            className="p-2.5 rounded-lg bg-surface border border-border hover:bg-surface-2 transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Copy className="h-4 w-4 text-fg-subtle" />
            )}
          </button>
          <a
            href="/eip/api/feed"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg bg-surface border border-border hover:bg-surface-2 transition-colors"
          >
            <ExternalLink className="h-4 w-4 text-fg-subtle" />
          </a>
        </div>

        <div className="p-3 bg-bg-elev rounded-lg">
          <p className="text-xs text-fg-subtle">
            Pass <code className="text-iris-400">?runId=RUN-XXXXXXXX-XXX</code> to retrieve a specific run result.
            The feed is CORS-enabled and returns JSON.
          </p>
        </div>
      </div>

      <div className="surface-card p-6 space-y-4">
        <h2 className="text-sm font-semibold text-fg">Response Schema</h2>
        <pre className="bg-bg-elev border border-border rounded-lg p-4 text-xs font-mono text-fg-muted overflow-x-auto">
{`{
  "run": {
    "id": "string (UUID)",
    "runId": "string (RUN-YYYYMMDD-NNN)",
    "criteriaSetId": "string (UUID)",
    "criteriaVersion": "number",
    "criteriaName": "string",
    "timestamp": "string (ISO 8601)",
    "inputSnapshot": {
      "sourceIds": ["string"],
      "sourceNames": ["string"],
      "totalRows": "number",
      "snapshotHash": "string"
    },
    "resultCount": "number",
    "subjects": [
      {
        "id": "string",
        "name": "string",
        "contactDetail": "string",
        "contactType": "email | phone | address | other",
        "matchedFields": { "key": "value" }
      }
    ],
    "status": "completed | failed | running"
  }
}`}
        </pre>
      </div>

      <div className="surface-card p-6 space-y-4">
        <h2 className="text-sm font-semibold text-fg">Integration Examples</h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-fg-subtle uppercase tracking-wider mb-1">cURL</p>
            <pre className="bg-bg-elev border border-border rounded-lg p-3 text-xs font-mono text-fg-muted overflow-x-auto">
              {`curl -s "${feedUrl || "https://your-domain/eip/api/feed"}?runId=${latestRun?.runId ?? "RUN-20250505-001"}" | jq .`}
            </pre>
          </div>
          <div>
            <p className="text-xs text-fg-subtle uppercase tracking-wider mb-1">JavaScript (fetch)</p>
            <pre className="bg-bg-elev border border-border rounded-lg p-3 text-xs font-mono text-fg-muted overflow-x-auto">
{`const res = await fetch("/eip/api/feed?runId=${latestRun?.runId ?? "RUN-20250505-001"}");
const data = await res.json();
console.log(data.run.subjects);`}
            </pre>
          </div>
          <div>
            <p className="text-xs text-fg-subtle uppercase tracking-wider mb-1">Python</p>
            <pre className="bg-bg-elev border border-border rounded-lg p-3 text-xs font-mono text-fg-muted overflow-x-auto">
{`import requests
r = requests.get("${feedUrl || "https://your-domain/eip/api/feed"}", params={"runId": "${latestRun?.runId ?? "RUN-20250505-001"}"})
subjects = r.json()["run"]["subjects"]`}
            </pre>
          </div>
        </div>
      </div>

      <div className="surface-card p-6">
        <h2 className="text-sm font-semibold text-fg mb-3">Current Stats</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold font-display text-fg">{state.runs.length}</p>
            <p className="text-xs text-fg-subtle">Total Runs</p>
          </div>
          <div>
            <p className="text-2xl font-bold font-display text-fg">
              {state.runs.reduce((a, r) => a + r.resultCount, 0)}
            </p>
            <p className="text-xs text-fg-subtle">Total Subjects</p>
          </div>
          <div>
            <p className="text-2xl font-bold font-display text-fg">{state.dataSources.length}</p>
            <p className="text-xs text-fg-subtle">Data Sources</p>
          </div>
        </div>
      </div>
    </div>
  );
}
