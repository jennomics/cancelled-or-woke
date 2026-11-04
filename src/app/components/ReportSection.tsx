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
    <section className="report">
      <h2>{report.label}</h2>
      <p className="meta query">Query · {report.query}</p>
      <p className="summary">{report.summary}</p>
      {shown.length > 0 && (
        <ol className="rows">
          {shown.map((s) => (
            <li key={s.link}>
              <a className="grow" href={s.link} target="_blank" rel="noopener noreferrer">{s.title}</a>
              <span className="meta">{hostnameOf(s.link)}</span>
            </li>
          ))}
        </ol>
      )}
      {hidden > 0 && (
        <div className="actions">
          <button type="button" className="tertiary" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Show top 3" : `Show all ${report.sources.length}`}
          </button>
        </div>
      )}
    </section>
  );
}
