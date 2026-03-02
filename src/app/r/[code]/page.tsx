import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const APP_STORE_URL = 'https://apps.apple.com/app/id6756806091';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.arubatravelbuddy.app';

function isIOS(ua: string): boolean {
  return /iPhone|iPad|iPod/i.test(ua);
}

function isAndroid(ua: string): boolean {
  return /Android/i.test(ua);
}

export default async function ReferralRedirect({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const trimmed = code?.trim() || '';
  if (!trimmed) redirect('/download');

  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';

  if (isIOS(userAgent)) {
    redirect(`${APP_STORE_URL}?pt=referral&ct=${encodeURIComponent(trimmed)}`);
  }
  if (isAndroid(userAgent)) {
    redirect(`${PLAY_STORE_URL}&referrer=${encodeURIComponent(trimmed)}`);
  }

  redirect(`/download?ref=${encodeURIComponent(trimmed)}`);
}
