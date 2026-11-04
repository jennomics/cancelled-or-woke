import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { normalizeImage, openaiIdentify } from "@/lib/identify";

export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }
  } catch (err) {
    console.error("POST /api/identify", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }

  let image: string;
  try {
    image = normalizeImage((await request.json()).image);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  try {
    const subject = await openaiIdentify(image);
    if (subject === null) {
      return NextResponse.json({ error: "Could not read a name from this photo. Type it instead" }, { status: 422 });
    }
    return NextResponse.json({ subject });
  } catch (err) {
    console.error("POST /api/identify", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }
}
