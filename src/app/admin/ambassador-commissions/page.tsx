import { redirect } from 'next/navigation';

export default function AmbassadorCommissionsRedirectPage() {
  redirect('/admin/ambassador?tab=payouts');
}
