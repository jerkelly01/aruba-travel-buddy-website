import { NextRequest, NextResponse } from 'next/server';

/**
 * Same-origin proxy: browser → /api/analytics/track → Supabase Edge Function.
 * Avoids client-side CORS/ad-block issues and does not require the anon key in the browser bundle.
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
    return NextResponse.json(
      { success: false, error: 'Analytics not configured (missing Supabase URL or anon key on server)' },
      { status: 503 },
    );
  }

  let body: string;
  try {
    body = await request.text();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid body' }, { status: 400 });
  }

  const upstream = await fetch(`${supabaseUrl}/functions/v1/website-analytics-track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    body,
  });

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
