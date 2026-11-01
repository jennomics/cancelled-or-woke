"use client";

import { FormEvent, useState } from "react";
import type { CategoryReport } from "@/lib/concern-search";

type Report = { subject: string; categories: CategoryReport[] };

export default function Home() {
  const [subject, setSubject] = useState("");
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject }),
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
        Enter a celebrity, band, or TV show. Results are raw web search hits per category, not verdicts.
      </p>
      <form onSubmit={onSubmit}>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Name of a celebrity, band, or TV show"
          maxLength={100}
          required
        />
        <button type="submit" disabled={loading}>{loading ? "Searching…" : "Search"}</button>
      </form>

      {error && <div className="error" role="alert">{error}</div>}

      {report?.categories.map((category) => (
        <section key={category.id}>
          <h2>{category.label}{category.estimatedTotal > 0 ? ` (${category.estimatedTotal.toLocaleString()} estimated matches)` : ""}</h2>
          <p className="query">Query: {category.query}</p>
          {category.results.length === 0 ? (
            <p>No results.</p>
          ) : (
            <ol>
              {category.results.map((result) => (
                <li key={result.link}>
                  <a href={result.link} target="_blank" rel="noopener noreferrer">{result.title}</a>
                  <p>{result.snippet}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      ))}
    </main>
  );
}
