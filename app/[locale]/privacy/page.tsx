import { Metadata } from 'next';
import LegalDocument, {
  type LegalDocumentContent,
} from '@/components/shared/LegalDocument';
import { loadPageContent } from '@/lib/content';
import { isValidLocale, defaultLocale, type Locale } from '@/lib/i18n';

const PAGE = 'privacy';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = (isValidLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const content = await loadPageContent<LegalDocumentContent>(PAGE, locale);
  return {
    title: content?.seo?.title ?? '隐私政策',
    description: content?.seo?.description ?? '',
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = (isValidLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const content = await loadPageContent<LegalDocumentContent>(PAGE, locale);
  return <LegalDocument locale={locale} content={content} />;
}
