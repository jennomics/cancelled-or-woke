"use client";

import { FormEvent, useState } from "react";
import { DEFAULT_SEARCHES, MAX_LABEL_LENGTH, MAX_SEARCHES, MAX_TERMS_LENGTH, SearchSpec } from "@/lib/searches";

type Props = { custom: SearchSpec[]; onChange: (custom: SearchSpec[]) => void };

export function SearchList({ custom, onChange }: Props) {
  const [label, setLabel] = useState("");
  const [terms, setTerms] = useState("");
  const full = DEFAULT_SEARCHES.length + custom.length >= MAX_SEARCHES;

  function add(event: FormEvent) {
    event.preventDefault();
    onChange([...custom, { id: `custom-${Date.now()}`, label: label.trim(), terms: terms.trim() }]);
    setLabel("");
    setTerms("");
  }

  return (
    <details className="settings">
      <summary>Searches to run ({DEFAULT_SEARCHES.length + custom.length})</summary>
      <ul className="spec-list">
        {DEFAULT_SEARCHES.map((s) => (
          <li key={s.id}><strong>{s.label}</strong> <code>{s.terms}</code></li>
        ))}
        {custom.map((s) => (
          <li key={s.id}>
            <strong>{s.label}</strong> <code>{s.terms}</code>{" "}
            <button type="button" className="link" onClick={() => onChange(custom.filter((c) => c.id !== s.id))}>
              remove
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={add} className="add-form">
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label" maxLength={MAX_LABEL_LENGTH} required disabled={full} />
        <input value={terms} onChange={(e) => setTerms(e.target.value)} placeholder='Search terms, e.g. lawsuit OR "sued"' maxLength={MAX_TERMS_LENGTH} required disabled={full} />
        <button type="submit" disabled={full}>Add search</button>
      </form>
      <p className="hint">Each search is run as <code>&quot;subject&quot; terms</code>. Limit {MAX_SEARCHES} searches.</p>
    </details>
  );
}
