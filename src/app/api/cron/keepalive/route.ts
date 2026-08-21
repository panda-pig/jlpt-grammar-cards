import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-admin";

/**
 * Keeps the Supabase project awake.
 *
 * Free-tier projects are paused after ~7 days without database activity, which
 * breaks sign-in and cloud sync (guest mode keeps working, since it reads the
 * bundled deck from /grammar.json). A daily read is enough to count as activity.
 *
 * Scheduled from vercel.json. Vercel signs cron invocations with CRON_SECRET
 * when that env var is set, so reject anything else to keep the route private.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  try {
    const supabase = createServiceRoleClient();
    // Cheapest possible read: count only, no rows transferred.
    const { error } = await supabase
      .from("grammar")
      .select("id", { count: "exact", head: true });

    if (error) throw error;
    return NextResponse.json({ ok: true, at: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "keepalive failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
