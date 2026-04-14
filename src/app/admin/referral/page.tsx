import { redirect } from 'next/navigation';

/** Old "Referral campaign" URL — hub is now under /admin/ambassador */
export default function AdminReferralRedirectPage() {
  redirect('/admin/ambassador?tab=installs');
}
