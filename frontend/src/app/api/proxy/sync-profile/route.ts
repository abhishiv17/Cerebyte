import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No auth token" }, { status: 401 });
    }

    const body = await request.json();

    const res = await fetch("http://127.0.0.1:8000/api/v1/gamification/sync-profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Proxy error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
