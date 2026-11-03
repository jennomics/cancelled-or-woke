import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { normalizeSubject, searchConcerns } from "@/lib/concern-search";
import { normalizeOutlets } from "@/lib/outlets";
import { normalizeSearches } from "@/lib/searches";
import { serperSearch } from "@/lib/serper-search";
import { openaiSummarize } from "@/lib/summarize";

export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }
  } catch (err) {
    console.error("POST /api/search", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }

  let subject: string;
  let searches: ReturnType<typeof normalizeSearches>;
  let outlets: string[];
  try {
    const body = await request.json();
    subject = normalizeSubject(body.subject);
    searches = normalizeSearches(body.searches);
    outlets = normalizeOutlets(body.outlets);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  try {
    const reports = await searchConcerns(subject, searches, outlets, serperSearch, openaiSummarize);
    return NextResponse.json({ subject, reports });
  } catch (err) {
    console.error("POST /api/search", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }
}
