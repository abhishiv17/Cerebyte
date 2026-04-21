import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { email, password, fullName } = await request.json();
  const origin = new URL(request.url).origin;

  const supabase = await createClient();

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // If email confirmation is disabled, the user is immediately signed in
  // and session cookies are set server-side here.
  const needsConfirmation = !data.session;

  return NextResponse.json({ needsConfirmation });
}
