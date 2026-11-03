"use client";

import { DEFAULT_OUTLETS, MAX_OUTLETS } from "@/lib/outlets";

type Props = { outlets: string[]; onChange: (outlets: string[]) => void };

export function parseOutletText(text: string): string[] {
  return text.split(/\s+/).map((s) => s.trim().toLowerCase()).filter(Boolean);
}

export function OutletEditor({ outlets, onChange }: Props) {
  return (
    <details className="settings">
      <summary>Credible outlets ({outlets.length})</summary>
      <p className="hint">One domain per line. Only links from these domains are shown and summarized. Limit {MAX_OUTLETS}.</p>
      <textarea
        rows={8}
        value={outlets.join("\n")}
        onChange={(e) => onChange(parseOutletText(e.target.value))}
        spellCheck={false}
      />
      <button type="button" className="link" onClick={() => onChange([...DEFAULT_OUTLETS])}>Reset to defaults</button>
    </details>
  );
}
