import { NextResponse } from "next/server";
import { serperSearch } from "@/lib/serper-search";
import { normalizeSubject, searchConcerns } from "@/lib/concern-search";

export async function POST(request: Request) {
  let subject: string;
  try {
    subject = normalizeSubject((await request.json()).subject);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  try {
    return NextResponse.json({ subject, categories: await searchConcerns(subject, serperSearch) });
  } catch (err) {
    console.error("POST /api/search", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }
}
