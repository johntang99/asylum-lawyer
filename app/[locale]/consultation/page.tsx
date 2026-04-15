import { Metadata } from 'next';
import { isValidLocale, defaultLocale } from '@/lib/i18n';
import IntakeForm from '@/components/consultation/IntakeForm';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const isZh = locale === 'zh';
  return {
    title: isZh ? '案件评估 — 宇律师事务所' : 'Case Evaluation — Zhang Law Office',
    description: isZh
      ? '免费在线案件评估，24小时内回复。填写表格开始您的庇护申请咨询。'
      : 'Free online case evaluation with 24-hour response. Fill out the form to start your asylum consultation.',
  };
}

export default async function ConsultationPage() {
  return <IntakeForm />;
}
