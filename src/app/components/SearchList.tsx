"use client";

import { FormEvent, useState } from "react";
import { DEFAULT_SEARCHES, MAX_LABEL_LENGTH, MAX_SEARCHES, MAX_TERMS_LENGTH, SearchSpec } from "@/lib/searches";

type Props = { custom: SearchSpec[]; onChange: (custom: SearchSpec[]) => void };

export function SearchList({ custom, onChange }: Props) {
  const [label, setLabel] = useState("");
  const [terms, setTerms] = useState("");
  const total = DEFAULT_SEARCHES.length + custom.length;
  const full = total >= MAX_SEARCHES;

  function add(event: FormEvent) {
    event.preventDefault();
    onChange([...custom, { id: `custom-${Date.now()}`, label: label.trim(), terms: terms.trim() }]);
    setLabel("");
    setTerms("");
  }

  return (
    <details className="group">
      <summary>Searches to run <span className="meta">{total} of {MAX_SEARCHES}</span></summary>
      <div className="inner">
        <p className="meta">Each search runs as &quot;subject&quot; plus the terms</p>
        <ul className="rows">
          {DEFAULT_SEARCHES.map((s) => (
            <li key={s.id}><span className="grow">{s.label}<span className="terms">{s.terms}</span></span></li>
          ))}
          {custom.map((s) => (
            <li key={s.id}>
              <span className="grow">{s.label}<span className="terms">{s.terms}</span></span>
              <button type="button" className="tertiary" onClick={() => onChange(custom.filter((c) => c.id !== s.id))}>
                Remove
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={add} className="add-form" style={{ marginTop: "var(--s-3)" }}>
          <label className="field">
            <span className="meta">Label</span>
            <input value={label} onChange={(e) => setLabel(e.target.value)} maxLength={MAX_LABEL_LENGTH} required disabled={full} />
          </label>
          <label className="field">
            <span className="meta">Search terms</span>
            <input value={terms} onChange={(e) => setTerms(e.target.value)} placeholder='lawsuit OR "sued"' maxLength={MAX_TERMS_LENGTH} required disabled={full} />
          </label>
          <div className="actions">
            <button type="submit" disabled={full}>Add search</button>
            {full && <span className="meta">Limit reached. Remove one to add another</span>}
          </div>
        </form>
      </div>
    </details>
  );
}
