import { NextRequest, NextResponse } from 'next/server';

/**
 * Same-origin proxy: browser → /api/analytics/track → Supabase Edge Function.
 * Avoids client-side CORS / ad-blocker issues and keeps the anon key off the browser bundle.
 */
export async function POST(request: NextRequest) {
  const supabaseUrl = (
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    ''
  ).replace(/\/$/, '');

  const anonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  if (!supabaseUrl || !anonKey) {
    console.error('[analytics/track] Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars');
    // Return 200 so the browser doesn't retry – the issue is a config problem, not transient
    return NextResponse.json(
      { success: false, error: 'Analytics not configured on server' },
      { status: 200 },
    );
  }

  let body: string;
  try {
    body = await request.text();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid body' }, { status: 400 });
  }

  try {
    const upstream = await fetch(
      `${supabaseUrl}/functions/v1/website-analytics-track`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
        body,
      },
    );

    const text = await upstream.text();

    if (!upstream.ok) {
      console.error(
        `[analytics/track] upstream returned ${upstream.status}:`,
        text.slice(0, 500),
      );
    }

    // Always return 200 to the browser so errors don't cause retry storms.
    // The body carries the real success/error from the Edge Function.
    return new NextResponse(text, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('[analytics/track] fetch to edge function failed:', e);
    return NextResponse.json(
      { success: false, error: 'Failed to reach analytics backend' },
      { status: 200 },
    );
  }
}
