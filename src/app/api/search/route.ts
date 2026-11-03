import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { serperSearch } from "@/lib/serper-search";
import { normalizeSubject, searchConcerns } from "@/lib/concern-search";

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
