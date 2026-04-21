import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Session cookies are now set server-side in the response headers via
  // the server Supabase client's setAll() — the browser will persist them
  // before the client navigates, so middleware.getUser() will find the session.
  return NextResponse.json({ success: true });
}
