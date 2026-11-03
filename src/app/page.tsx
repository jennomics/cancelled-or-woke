"use client";

import { FormEvent, useState } from "react";
import type { SearchReport } from "@/lib/concern-search";
import { DEFAULT_OUTLETS } from "@/lib/outlets";
import { DEFAULT_SEARCHES, SearchSpec } from "@/lib/searches";
import { OutletEditor } from "./components/OutletEditor";
import { ReportSection } from "./components/ReportSection";
import { SearchList } from "./components/SearchList";
import { useStoredState } from "./components/use-stored-state";

type Report = { subject: string; reports: SearchReport[] };

export default function Home() {
  const [subject, setSubject] = useState("");
  const [password, setPassword] = useState("");
  const [custom, setCustom] = useStoredState<SearchSpec[]>("customSearches", []);
  const [outlets, setOutlets] = useStoredState<string[]>("outlets", [...DEFAULT_OUTLETS]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${password}` },
        body: JSON.stringify({ subject, searches: [...DEFAULT_SEARCHES, ...custom], outlets }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? `Request failed (${response.status})`);
      setReport(body);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Concern Search</h1>
      <p className="hint">
        Enter a celebrity, band, or TV show. Each search is summarized from the listed outlets only. Summaries report what sources say, not verdicts.
      </p>
      <p className="hint">
        Summaries are written from titles and snippets, not full articles. Snippets can misrepresent what an article says.
        Recommendation: treat the summary as a reading guide and open the links before trusting any claim.
      </p>
      <form onSubmit={onSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          required
        />
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Name of a celebrity, band, or TV show"
          maxLength={100}
          required
        />
        <button type="submit" disabled={loading}>{loading ? "Searching…" : "Search"}</button>
      </form>

      <SearchList custom={custom} onChange={setCustom} />
      <OutletEditor outlets={outlets} onChange={setOutlets} />

      {error && <div className="error" role="alert">{error}</div>}

      {report?.reports.map((r) => <ReportSection key={r.id} report={r} />)}
    </main>
  );
}
