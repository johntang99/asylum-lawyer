import Link from 'next/link';
import { getSites } from '@/lib/sites';
import { getSession } from '@/lib/admin/auth';
import { isSuperAdmin } from '@/lib/admin/permissions';
import { OnboardingWizard } from '@/components/admin/OnboardingWizard';

export default async function AdminOnboardingPage() {
  const session = await getSession();
  const sites = await getSites();

  if (session && !isSuperAdmin(session.user)) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h1 className="text-xl font-semibold text-gray-900">Onboarding</h1>
        <p className="text-sm text-gray-600 mt-2">
          Only a super admin can create new sites. Ask an administrator to onboard the
          client, then you can edit its content from the Content section.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/admin/sites" className="hover:text-gray-800">
            Sites
          </Link>
          <span>/</span>
          <span>Onboarding</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">Onboard a new site</h1>
        <p className="text-sm text-gray-600">
          Creates the site, registers a dev host, and seeds the brand, contact details,
          header, footer and SEO files for both locales.
        </p>
      </div>

      <OnboardingWizard sites={sites} />
    </div>
  );
}
