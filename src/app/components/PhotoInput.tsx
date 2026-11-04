"use client";

import { ChangeEvent, useRef, useState } from "react";
import { resizeImage } from "./resize-image";

type Props = { password: string; onSubject: (subject: string) => void; onError: (message: string) => void };

export function PhotoInput({ password, onSubject, onError }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [reading, setReading] = useState(false);

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setReading(true);
    try {
      const image = await resizeImage(file);
      const response = await fetch("/api/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${password}` },
        body: JSON.stringify({ image }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? `Request failed (${response.status})`);
      onSubject(body.subject);
    } catch (err) {
      onError((err as Error).message);
    } finally {
      setReading(false);
    }
  }

  return (
    <div className="actions">
      <input ref={input} type="file" accept="image/*" onChange={onChange} hidden />
      <button type="button" onClick={() => input.current?.click()} disabled={reading}>Use a photo</button>
      {reading && <span className="meta state">Reading photo</span>}
    </div>
  );
}
