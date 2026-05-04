import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Use casting because Request in standard DOM doesn't have .cookies but NextRequest does
  // or we can use next/headers
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return NextResponse.json({ cookies: cookieStore.getAll() });
}
