"use client";

import { useState } from "react";
import type { SearchReport } from "@/lib/concern-search";
import { hostnameOf } from "@/lib/outlets";

const TOP = 3;

export function ReportSection({ report }: { report: SearchReport }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? report.sources : report.sources.slice(0, TOP);
  const hidden = report.sources.length - TOP;

  return (
    <section>
      <h2>{report.label}</h2>
      <p className="query">Query: {report.query}</p>
      <p className="summary">{report.summary}</p>
      {shown.length > 0 && (
        <ol>
          {shown.map((s) => (
            <li key={s.link}>
              <a href={s.link} target="_blank" rel="noopener noreferrer">{s.title}</a>
              <p>{hostnameOf(s.link)}</p>
            </li>
          ))}
        </ol>
      )}
      {hidden > 0 && (
        <button type="button" className="link" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show top 3" : `Show all ${report.sources.length}`}
        </button>
      )}
    </section>
  );
}
