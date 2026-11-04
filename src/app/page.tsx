"use client";

import { FormEvent, useEffect, useState } from "react";
import type { SearchReport } from "@/lib/concern-search";
import { DEFAULT_OUTLETS } from "@/lib/outlets";
import { DEFAULT_SEARCHES, SearchSpec } from "@/lib/searches";
import { OutletEditor } from "./components/OutletEditor";
import { PhotoInput } from "./components/PhotoInput";
import { ReportSection } from "./components/ReportSection";
import { SearchList } from "./components/SearchList";
import { useStoredState } from "./components/use-stored-state";

type Report = { subject: string; reports: SearchReport[] };

function Elapsed() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="num">{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</span>;
}

export default function Home() {
  const [subject, setSubject] = useState("");
  const [password, setPassword] = useState("");
  const [custom, setCustom] = useStoredState<SearchSpec[]>("customSearches", []);
  const [outlets, setOutlets] = useStoredState<string[]>("outlets", [...DEFAULT_OUTLETS]);
  const [running, setRunning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setRunning(subject.trim());
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
      setRunning(null);
    }
  }

  return (
    <main>
      <h1>Concern Search</h1>
      <p className="body-72">
        Enter a celebrity, band, or TV show. Each search is summarized from the listed outlets only. Summaries report what sources say, not verdicts.
      </p>
      <p className="body-72" style={{ marginTop: "var(--s-2)" }}>
        Summaries are written from titles and snippets, not full articles. Snippets can misrepresent what an article says.
        Recommendation: treat the summary as a reading guide and open the links before trusting any claim.
      </p>

      <form onSubmit={onSubmit} className="group">
        <label className="field">
          <span className="meta">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <label className="field">
          <span className="meta">Subject</span>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="A celebrity, band, or TV show"
            maxLength={100}
            required
          />
        </label>
        <p className="meta">Or read the name from a photo. A name, logo, poster, or caption works. A face alone does not</p>
        <PhotoInput password={password} onSubject={(s) => { setSubject(s); setError(null); }} onError={setError} />
        <div className="actions" style={{ marginTop: "var(--s-3)" }}>
          <button type="submit" className="primary" disabled={running !== null}>Search</button>
        </div>
      </form>

      {running !== null && (
        <section className="block" aria-live="polite">
          <div className="head">
            <span className="meta">Searching · {DEFAULT_SEARCHES.length + custom.length} queries</span>
            <Elapsed />
          </div>
          <p className="task">{running}</p>
        </section>
      )}

      {error && (
        <section className="group" role="alert">
          <p className="meta state">Error</p>
          <p>{error}</p>
        </section>
      )}

      {report?.reports.map((r) => <ReportSection key={r.id} report={r} />)}

      <SearchList custom={custom} onChange={setCustom} />
      <OutletEditor outlets={outlets} onChange={setOutlets} />
    </main>
  );
}
