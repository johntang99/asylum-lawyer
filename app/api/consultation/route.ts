import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getRequestSiteId, loadPageContent, loadSiteInfo } from '@/lib/content';
import { defaultLocale, isValidLocale, type Locale } from '@/lib/i18n';

function normalizeEmailList(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input
      .flatMap((item) => (typeof item === 'string' ? item.split(',') : []))
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (typeof input === 'string') {
    return input
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const requestedLocale =
      typeof body?.locale === 'string' && isValidLocale(body.locale)
        ? (body.locale as Locale)
        : defaultLocale;
    const siteId = await getRequestSiteId();
    const consultationContent = await loadPageContent<Record<string, any>>(
      'consultation',
      requestedLocale,
      siteId
    );
    const contentReceiverEmails = normalizeEmailList(
      consultationContent?.submission?.receiverEmails
    );
    const fallbackEnvEmails = normalizeEmailList(process.env.CONTACT_FALLBACK_TO);
    const sidebarEmail = normalizeEmailList(consultationContent?.sidebar?.contact?.email);
    const notificationRecipients =
      contentReceiverEmails.length > 0
        ? contentReceiverEmails
        : fallbackEnvEmails.length > 0
          ? fallbackEnvEmails
          : sidebarEmail.length > 0
            ? sidebarEmail
            : ['yuxiaris@gmail.com'];
    const supportEmail = sidebarEmail[0] || notificationRecipients[0] || 'yuxiaris@gmail.com';
    const successMessage =
      consultationContent?.submission?.successMessage ||
      '感谢您提交案件信息，我们将在24小时内联系您。';

    const siteInfo = await loadSiteInfo(siteId, requestedLocale) as Record<string, any> | null;
    const siteName = siteInfo?.name || '宇霞移民服务中心';
    const siteTagline = siteInfo?.tagline || '';
    const confirmation = consultationContent?.confirmation as Record<string, any> | undefined;

    const name = body.name;
    const phone = body.phone || '';
    const wechat = body.wechat || '';
    const email = body.email || '';
    const language = body.language || '普通话';
    const inUs = body.inUS || body.inUs || '';
    const hasNta = body.hasNTA || body.hasNta || '';
    const filedI589 = body.filedI589 || '';
    const pastOneYear = body.overOneYear || body.pastOneYear || '';
    const hasCourtDate = body.hasDate || body.hasCourtDate || '';
    const courtDate = body.courtDate || '';
    const nationality = body.nationality || '';
    const primaryConcern = body.mainQuestion || body.primaryConcern || '';
    const familyMembers = body.hasFamily || body.familyMembers || '';
    const previousApplications = body.otherApplications || body.previousApplications || '';
    const additionalNotes = body.additionalInfo || body.additionalNotes || '';

    if (!name || !email) {
      return NextResponse.json({ error: '姓名和邮箱为必填项' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    if (supabase) {
      const { error } = await supabase.from('consultation_requests').insert({
        site_id: siteId,
        name,
        phone: phone || email,
        wechat: wechat || null,
        email: email || null,
        language,
        in_us: inUs || null,
        has_nta: hasNta || null,
        filed_i589: filedI589 || null,
        past_one_year: pastOneYear || null,
        has_court_date: hasCourtDate || null,
        court_date: courtDate || null,
        nationality: nationality || null,
        primary_concern: primaryConcern || null,
        family_members: familyMembers || null,
        previous_applications: previousApplications || null,
        additional_notes: additionalNotes || null,
        source: 'consultation',
        status: 'new',
      });

      if (error) {
        console.error('Supabase insert error:', error);
      }
    }

    // Send email notification via Resend (if configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM || 'noreply@baamplatform.com',
          to: notificationRecipients,
          subject: `新咨询请求 — ${name}`,
          html: `
            <h2>新的庇护咨询请求</h2>
            <p><strong>姓名：</strong>${name}</p>
            <p><strong>电话：</strong>${phone}</p>
            ${wechat ? `<p><strong>微信：</strong>${wechat}</p>` : ''}
            ${email ? `<p><strong>邮箱：</strong>${email}</p>` : ''}
            <p><strong>语言：</strong>${language || '普通话'}</p>
            <hr/>
            <p><strong>在美国：</strong>${inUs || '未填写'}</p>
            <p><strong>有NTA：</strong>${hasNta || '未填写'}</p>
            <p><strong>已提交I-589：</strong>${filedI589 || '未填写'}</p>
            <p><strong>超过一年：</strong>${pastOneYear || '未填写'}</p>
            <p><strong>有面谈/开庭日期：</strong>${hasCourtDate || '未填写'}</p>
            ${courtDate ? `<p><strong>日期：</strong>${courtDate}</p>` : ''}
            <p><strong>国籍：</strong>${nationality || '未填写'}</p>
            <p><strong>主要问题：</strong>${primaryConcern || '未填写'}</p>
            ${familyMembers ? `<p><strong>家属：</strong>${familyMembers}</p>` : ''}
            ${previousApplications ? `<p><strong>其他申请：</strong>${previousApplications}</p>` : ''}
            ${additionalNotes ? `<p><strong>补充信息：</strong>${additionalNotes}</p>` : ''}
          `,
        });
        // Send confirmation email to the client
        if (email && confirmation) {
          const confirmTitle = confirmation.title || '感谢您提交案件信息';
          const confirmMessage = confirmation.message || '我们已收到您的案件评估请求，将尽快与您联系。';
          const nextStepsTitle = confirmation.nextStepsTitle || '接下来的步骤：';
          const nextSteps = Array.isArray(confirmation.nextSteps) ? confirmation.nextSteps : [];
          const emergencyPrefix = confirmation.emergencyPrefix || '如有紧急事项，请发送邮件至';
          const emergencyEmail = confirmation.emergencyEmail || supportEmail;

          const nextStepsHtml = nextSteps
            .map((step: string, i: number) => `<p style="font-size: 13px; color: #4B5563; margin: 4px 0;">${i + 1}. ${step}</p>`)
            .join('');

          await resend.emails.send({
            from: process.env.RESEND_FROM || 'noreply@baamplatform.com',
            to: email,
            subject: `${siteName} — ${confirmTitle}`,
            html: `
              <div style="font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #1B2A4A, #0F1A32); padding: 32px; text-align: center;">
                  <h1 style="color: #C9963B; font-size: 20px; margin: 0;">${siteName}</h1>
                  ${siteTagline ? `<p style="color: rgba(255,255,255,0.7); font-size: 13px; margin-top: 4px;">${siteTagline}</p>` : ''}
                </div>
                <div style="padding: 32px; background: #fff;">
                  <p style="font-size: 16px; color: #1B2A4A; font-weight: bold;">您好，${name}：</p>
                  <p style="color: #4B5563; line-height: 1.8;">${confirmMessage}</p>
                  <div style="background: #F9FAFB; border-radius: 8px; padding: 20px; margin: 24px 0;">
                    <p style="font-size: 14px; font-weight: bold; color: #1B2A4A; margin-top: 0;">${nextStepsTitle}</p>
                    ${nextStepsHtml}
                  </div>
                  <p style="color: #4B5563; line-height: 1.8;">
                    ${emergencyPrefix} <a href="mailto:${emergencyEmail}" style="color: #1B2A4A; font-weight: bold;">${emergencyEmail}</a>
                  </p>
                  <p style="color: #4B5563; margin-top: 24px;">
                    此致<br/>
                    <strong style="color: #1B2A4A;">${siteName}团队</strong>
                  </p>
                </div>
                <div style="background: #F3F4F6; padding: 16px; text-align: center; font-size: 11px; color: #9CA3AF;">
                  <p style="margin: 0;">本邮件为系统自动发送，请勿直接回复。</p>
                  <p style="margin: 4px 0 0;">如需联系我们，请发送邮件至 ${emergencyEmail}</p>
                </div>
              </div>
            `,
          });
        }
      } catch (emailError) {
        console.error('Email send error:', emailError);
      }
    }

    return NextResponse.json({ success: true, message: successMessage });
  } catch (error) {
    console.error('Consultation API error:', error);
    return NextResponse.json(
      { error: '提交失败，请稍后再试。' },
      { status: 500 }
    );
  }
}
