import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, phone, wechat, email, language, inUs, hasNta, filedI589, pastOneYear, hasCourtDate, courtDate, nationality, primaryConcern, familyMembers, previousApplications, additionalNotes } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: '姓名和电话为必填项' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    if (supabase) {
      const { error } = await supabase.from('consultation_requests').insert({
        site_id: 'asylum-attorney-la',
        name,
        phone,
        wechat: wechat || null,
        email: email || null,
        language: language || '普通话',
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
          from: process.env.RESEND_FROM || 'noreply@zhanglaw.com',
          to: process.env.CONTACT_FALLBACK_TO || 'info@zhanglaw.com',
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
      } catch (emailError) {
        console.error('Email send error:', emailError);
      }
    }

    return NextResponse.json({ success: true, message: '感谢您提交案件信息，我们将在24小时内联系您。' });
  } catch (error) {
    console.error('Consultation API error:', error);
    return NextResponse.json({ error: '提交失败，请稍后再试或直接拨打电话。' }, { status: 500 });
  }
}
