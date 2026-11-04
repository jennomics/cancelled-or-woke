"use client";

import { DEFAULT_OUTLETS, MAX_OUTLETS } from "@/lib/outlets";

type Props = { outlets: string[]; onChange: (outlets: string[]) => void };

export function parseOutletText(text: string): string[] {
  return text.split(/\s+/).map((s) => s.trim().toLowerCase()).filter(Boolean);
}

export function OutletEditor({ outlets, onChange }: Props) {
  return (
    <details className="group">
      <summary>Credible outlets <span className="meta">{outlets.length} of {MAX_OUTLETS}</span></summary>
      <div className="inner">
        <label className="field">
          <span className="meta">One domain per line. Only links from these domains are shown and summarized</span>
          <textarea
            rows={10}
            value={outlets.join("\n")}
            onChange={(e) => onChange(parseOutletText(e.target.value))}
            spellCheck={false}
          />
        </label>
        <div className="actions">
          <button type="button" className="tertiary" onClick={() => onChange([...DEFAULT_OUTLETS])}>Reset to defaults</button>
        </div>
      </div>
    </details>
  );
}
