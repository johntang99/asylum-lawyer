'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

/* ── Constants ── */
const NAVY = '#1B2A4A';
const GOLD = '#C9963B';

const STEPS = ['基本信息', '当前状况', '案件详情', '补充信息'] as const;

interface FormData {
  name: string;
  phone: string;
  wechat: string;
  email: string;
  language: string;
  inUS: string;
  hasNTA: string;
  filedI589: string;
  overOneYear: string;
  hasDate: string;
  courtDate: string;
  nationality: string;
  mainQuestion: string;
  hasFamily: string;
  otherApplications: string;
  additionalInfo: string;
}

const INITIAL: FormData = {
  name: '',
  phone: '',
  wechat: '',
  email: '',
  language: '',
  inUS: '',
  hasNTA: '',
  filedI589: '',
  overOneYear: '',
  hasDate: '',
  courtDate: '',
  nationality: '',
  mainQuestion: '',
  hasFamily: '',
  otherApplications: '',
  additionalInfo: '',
};

/* ── Reusable Sub-components ── */

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded-md text-sm focus:outline-none focus:ring-2 transition-colors"
        style={{
          borderColor: error ? '#ef4444' : '#d1d5db',
          padding: '12px 16px',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = NAVY;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? '#ef4444' : '#d1d5db';
        }}
      />
      <FieldError message={error} />
    </>
  );
}

function RadioPills({
  options,
  value,
  onChange,
  error,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="rounded transition-colors text-sm font-medium"
            style={{
              padding: '8px 16px',
              border: value === opt ? `1px solid ${NAVY}` : '1px solid #d1d5db',
              backgroundColor: value === opt ? NAVY : '#fff',
              color: value === opt ? '#fff' : '#374151',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
      <FieldError message={error} />
    </>
  );
}

/* ── Progress Indicator ── */

function ProgressDots({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((label, i) => {
        const isCompleted = i < current;
        const isActive = i === current;
        return (
          <div key={label} className="flex items-center">
            {i > 0 && (
              <div
                className="h-[2px] w-8 sm:w-12"
                style={{ backgroundColor: isCompleted ? '#16a34a' : '#d1d5db' }}
              />
            )}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: isCompleted ? '#16a34a' : isActive ? NAVY : '#d1d5db',
                }}
              />
              <span
                className="text-xs whitespace-nowrap"
                style={{
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? NAVY : '#9ca3af',
                }}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Trust Sidebar ── */

function TrustSidebar() {
  return (
    <div className="lg:sticky" style={{ top: 96 }}>
      <h3 className="text-lg font-bold text-gray-900">宇律师</h3>
      <p className="text-sm text-gray-500 mb-4">移民律师 · CA Bar #123456</p>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span
          className="text-xs font-medium px-3 py-1 rounded-full text-white"
          style={{ backgroundColor: '#16a34a' }}
        >
          24小时内回复
        </span>
        <span
          className="text-xs font-medium px-3 py-1 rounded-full text-white"
          style={{ backgroundColor: GOLD }}
        >
          免费初次咨询
        </span>
        <span
          className="text-xs font-medium px-3 py-1 rounded-full text-white"
          style={{ backgroundColor: NAVY }}
        >
          严格保密
        </span>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-semibold">邮箱：</span>
          <Link href="mailto:yuxiaris@gmail.com" style={{ color: NAVY }}>
            yuxiaris@gmail.com
          </Link>
        </p>
        <p>
          <span className="font-semibold">微信：</span>AsylumAttorneyLA
        </p>
      </div>
    </div>
  );
}

/* ── Confirmation Screen ── */

function Confirmation() {
  return (
    <div className="text-center py-12">
      <div
        className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl"
        style={{ backgroundColor: '#dcfce7' }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">感谢您提交案件信息</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        我们已收到您的案件评估请求，将尽快与您联系。
      </p>

      <div className="text-left max-w-sm mx-auto mb-8">
        <h3 className="font-semibold text-gray-900 mb-3">接下来的步骤：</h3>
        <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
          <li>我们将在24小时内审核您的信息</li>
          <li>律师将通过您提供的联系方式与您联系</li>
          <li>安排免费初次咨询，讨论您的案件详情</li>
        </ol>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        如有紧急事项，请发送邮件至{' '}
        <Link href="mailto:yuxiaris@gmail.com" className="font-semibold" style={{ color: NAVY }}>
          yuxiaris@gmail.com
        </Link>
      </p>

      <Link
        href="/zh/services"
        className="inline-block text-sm font-semibold underline"
        style={{ color: NAVY }}
      >
        查看常见问题
      </Link>
    </div>
  );
}

/* ── Step Forms ── */

function Step1({
  data,
  errors,
  update,
}: {
  data: FormData;
  errors: Record<string, string>;
  update: (field: keyof FormData, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label required>姓名</Label>
        <TextInput value={data.name} onChange={(v) => update('name', v)} placeholder="请输入您的姓名" error={errors.name} />
      </div>
      <div>
        <Label required>电子邮箱</Label>
        <TextInput value={data.email} onChange={(v) => update('email', v)} placeholder="请输入您的电子邮箱" type="email" error={errors.email} />
      </div>
      <div>
        <Label>电话号码</Label>
        <TextInput value={data.phone} onChange={(v) => update('phone', v)} placeholder="请输入电话号码（选填）" type="tel" error={errors.phone} />
      </div>
      <div>
        <Label>微信号</Label>
        <TextInput value={data.wechat} onChange={(v) => update('wechat', v)} placeholder="请输入微信号（选填）" />
      </div>
      <div>
        <Label>首选语言</Label>
        <select
          value={data.language}
          onChange={(e) => update('language', e.target.value)}
          className="w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2"
          style={{ padding: '12px 16px' }}
        >
          <option value="">请选择</option>
          <option value="普通话">普通话</option>
          <option value="粤语">粤语</option>
          <option value="English">English</option>
        </select>
      </div>
    </div>
  );
}

function Step2({
  data,
  errors,
  update,
}: {
  data: FormData;
  errors: Record<string, string>;
  update: (field: keyof FormData, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label required>您目前在美国吗？</Label>
        <RadioPills options={['是', '否']} value={data.inUS} onChange={(v) => update('inUS', v)} error={errors.inUS} />
      </div>
      <div>
        <Label required>是否收到出庭通知（NTA）？</Label>
        <RadioPills options={['是', '否', '不确定']} value={data.hasNTA} onChange={(v) => update('hasNTA', v)} error={errors.hasNTA} />
      </div>
      <div>
        <Label required>是否已提交I-589？</Label>
        <RadioPills options={['是', '否']} value={data.filedI589} onChange={(v) => update('filedI589', v)} error={errors.filedI589} />
      </div>
      <div>
        <Label required>来美是否已超过一年？</Label>
        <RadioPills options={['是', '否', '不确定']} value={data.overOneYear} onChange={(v) => update('overOneYear', v)} error={errors.overOneYear} />
      </div>
    </div>
  );
}

function Step3({
  data,
  errors,
  update,
}: {
  data: FormData;
  errors: Record<string, string>;
  update: (field: keyof FormData, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label required>是否有面谈或开庭日期？</Label>
        <RadioPills options={['是', '否']} value={data.hasDate} onChange={(v) => update('hasDate', v)} error={errors.hasDate} />
      </div>
      {data.hasDate === '是' && (
        <div>
          <Label required>日期</Label>
          <TextInput value={data.courtDate} onChange={(v) => update('courtDate', v)} type="date" error={errors.courtDate} />
        </div>
      )}
      <div>
        <Label required>国籍</Label>
        <TextInput value={data.nationality} onChange={(v) => update('nationality', v)} placeholder="请输入您的国籍" error={errors.nationality} />
      </div>
      <div>
        <Label required>最想咨询的问题</Label>
        <textarea
          value={data.mainQuestion}
          onChange={(e) => update('mainQuestion', e.target.value)}
          placeholder="请详细描述您最想咨询的问题（至少20字）"
          rows={4}
          className="w-full border rounded-md text-sm focus:outline-none focus:ring-2 resize-none"
          style={{
            borderColor: errors.mainQuestion ? '#ef4444' : '#d1d5db',
            padding: '12px 16px',
          }}
        />
        <FieldError message={errors.mainQuestion} />
      </div>
    </div>
  );
}

function Step4({
  data,
  errors,
  update,
}: {
  data: FormData;
  errors: Record<string, string>;
  update: (field: keyof FormData, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label required>家属是否需要一起申请？</Label>
        <RadioPills options={['是', '否']} value={data.hasFamily} onChange={(v) => update('hasFamily', v)} error={errors.hasFamily} />
      </div>
      <div>
        <Label>其他移民申请</Label>
        <textarea
          value={data.otherApplications}
          onChange={(e) => update('otherApplications', e.target.value)}
          placeholder="如有其他移民申请，请在此说明（选填）"
          rows={3}
          className="w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 resize-none"
          style={{ padding: '12px 16px' }}
        />
      </div>
      <div>
        <Label>补充信息</Label>
        <textarea
          value={data.additionalInfo}
          onChange={(e) => update('additionalInfo', e.target.value)}
          placeholder="任何其他您希望律师了解的信息（选填）"
          rows={3}
          className="w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 resize-none"
          style={{ padding: '12px 16px' }}
        />
      </div>
    </div>
  );
}

/* ── Main Component ── */

export default function IntakeForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof FormData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  /* ── Validation ── */

  function validateStep(s: number): boolean {
    const errs: Record<string, string> = {};

    if (s === 0) {
      if (!data.name.trim()) errs.name = '请输入姓名';
      if (!data.email.trim()) {
        errs.email = '请输入电子邮箱';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errs.email = '请输入有效的邮箱地址';
      }
    } else if (s === 1) {
      if (!data.inUS) errs.inUS = '请选择';
      if (!data.hasNTA) errs.hasNTA = '请选择';
      if (!data.filedI589) errs.filedI589 = '请选择';
      if (!data.overOneYear) errs.overOneYear = '请选择';
    } else if (s === 2) {
      if (!data.hasDate) errs.hasDate = '请选择';
      if (data.hasDate === '是' && !data.courtDate) errs.courtDate = '请选择日期';
      if (!data.nationality.trim()) errs.nationality = '请输入国籍';
      if (!data.mainQuestion.trim()) {
        errs.mainQuestion = '请描述您的问题';
      } else if (data.mainQuestion.trim().length < 20) {
        errs.mainQuestion = '请至少输入20个字';
      }
    } else if (s === 3) {
      if (!data.hasFamily) errs.hasFamily = '请选择';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (validateStep(step)) setStep((s) => s + 1);
  }

  function handleBack() {
    setStep((s) => s - 1);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateStep(step)) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Submit failed');
      setSubmitted(true);
    } catch {
      setErrors({ _form: '提交失败，请稍后重试或发送邮件至 yuxiaris@gmail.com' });
    } finally {
      setSubmitting(false);
    }
  }

  const stepComponents = [
    <Step1 key={0} data={data} errors={errors} update={update} />,
    <Step2 key={1} data={data} errors={errors} update={update} />,
    <Step3 key={2} data={data} errors={errors} update={update} />,
    <Step4 key={3} data={data} errors={errors} update={update} />,
  ];

  return (
    <main>
      {/* ── Compact Hero ── */}
      <section
        className="flex items-center"
        style={{
          marginTop: 72,
          background: `linear-gradient(135deg, ${NAVY} 0%, #0F1A32 100%)`,
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-16 w-full text-center">
          <h1
            className="text-[2.5rem] font-bold text-white mb-3 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            开始您的案件评估
          </h1>
          <p className="text-white/70 text-lg">
            填写以下信息，律师将在24小时内与您联系
          </p>
        </div>
      </section>

      {/* ── Form + Sidebar ── */}
      <section className="bg-[#F9FAFB] py-[60px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col-reverse lg:flex-row gap-10">
            {/* Form Column (60%) */}
            <div className="w-full lg:w-[60%]">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
                {submitted ? (
                  <Confirmation />
                ) : (
                  <form onSubmit={handleSubmit}>
                    <ProgressDots current={step} />

                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      {STEPS[step]}
                    </h2>

                    {stepComponents[step]}

                    {errors._form && (
                      <p className="text-sm text-red-500 mt-4 p-3 bg-red-50 rounded-md">
                        {errors._form}
                      </p>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                      {step > 0 ? (
                        <button
                          type="button"
                          onClick={handleBack}
                          className="px-6 py-2.5 text-sm font-semibold rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          上一步
                        </button>
                      ) : (
                        <div />
                      )}

                      {step < STEPS.length - 1 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-6 py-2.5 text-sm font-semibold text-white rounded-md transition-colors"
                          style={{ backgroundColor: NAVY }}
                        >
                          下一步
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-6 py-2.5 text-sm font-semibold text-white rounded-md transition-colors disabled:opacity-60"
                          style={{ backgroundColor: GOLD }}
                        >
                          {submitting ? '提交中...' : '提交案件信息'}
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Trust Sidebar (40%) */}
            <div className="w-full lg:w-[40%]">
              <TrustSidebar />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
