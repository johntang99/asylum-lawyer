'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

/* ── Constants ── */
const NAVY = '#1B2A4A';
const GOLD = '#C9963B';

const DEFAULT_CONSULTATION_CONTENT = {
  hero: {
    title: '开始您的案件评估',
    subtitle: '填写以下信息，律师将在24小时内与您联系',
  },
  steps: ['基本信息', '当前状况', '案件详情', '补充信息'],
  sidebar: {
    name: '宇律师',
    title: '移民律师 · CA Bar #123456',
    badges: ['24小时内回复', '免费初次咨询', '严格保密'],
    contact: {
      email: 'yuxiaris@gmail.com',
      wechat: 'yuxiaris',
    },
  },
  form: {
    step1: {
      nameLabel: '姓名',
      namePlaceholder: '请输入您的姓名',
      emailLabel: '电子邮箱',
      emailPlaceholder: '请输入您的电子邮箱',
      phoneLabel: '电话号码',
      phonePlaceholder: '请输入电话号码（选填）',
      wechatLabel: '微信号',
      wechatPlaceholder: '请输入微信号（选填）',
      languageLabel: '首选语言',
      languageOptions: ['普通话'],
    },
    step2: {
      inUsLabel: '您目前在美国吗？',
      inUsOptions: ['是', '否'],
      hasNtaLabel: '是否收到出庭通知（NTA）？',
      hasNtaOptions: ['是', '否', '不确定'],
      filedI589Label: '是否已提交I-589？',
      filedI589Options: ['是', '否'],
      overOneYearLabel: '来美是否已超过一年？',
      overOneYearOptions: ['是', '否', '不确定'],
    },
    step3: {
      hasDateLabel: '是否有面谈或开庭日期？',
      hasDateOptions: ['是', '否'],
      courtDateLabel: '日期',
      nationalityLabel: '国籍',
      nationalityPlaceholder: '请输入您的国籍',
      mainQuestionLabel: '最想咨询的问题',
      mainQuestionPlaceholder: '请详细描述您最想咨询的问题（至少20字）',
    },
    step4: {
      hasFamilyLabel: '家属是否需要一起申请？',
      hasFamilyOptions: ['是', '否'],
      otherApplicationsLabel: '其他移民申请',
      otherApplicationsPlaceholder: '如有其他移民申请，请在此说明（选填）',
      additionalInfoLabel: '补充信息',
      additionalInfoPlaceholder: '任何其他您希望律师了解的信息（选填）',
    },
    buttons: {
      back: '上一步',
      next: '下一步',
      submit: '提交案件信息',
      submitting: '提交中...',
    },
    errors: {
      nameRequired: '请输入姓名',
      emailRequired: '请输入电子邮箱',
      emailInvalid: '请输入有效的邮箱地址',
      selectRequired: '请选择',
      dateRequired: '请选择日期',
      nationalityRequired: '请输入国籍',
      mainQuestionRequired: '请描述您的问题',
      mainQuestionMin: '请至少输入20个字',
      formSubmitFailed: '提交失败，请稍后重试或发送邮件至 yuxiaris@gmail.com',
    },
  },
  confirmation: {
    title: '感谢您提交案件信息',
    message: '我们已收到您的案件评估请求，将尽快与您联系。',
    nextStepsTitle: '接下来的步骤：',
    nextSteps: [
      '我们将在24小时内审核您的信息',
      '律师将通过您提供的联系方式与您联系',
      '安排免费初次咨询，讨论您的案件详情',
    ],
    emergencyPrefix: '如有紧急事项，请发送邮件至',
    emergencyEmail: 'yuxiaris@gmail.com',
    linkLabel: '查看常见问题',
    linkHref: '/services',
  },
} as const;

function isPlainObject(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override as T) ?? base;
  }

  const merged: Record<string, any> = { ...base };
  Object.entries(override).forEach(([key, value]) => {
    const baseValue = merged[key];
    if (Array.isArray(value)) {
      merged[key] = [...value];
      return;
    }
    if (isPlainObject(baseValue) && isPlainObject(value)) {
      merged[key] = deepMerge(baseValue, value);
      return;
    }
    merged[key] = value;
  });

  return merged as T;
}

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
  language: '普通话',
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

function ProgressDots({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((label, i) => {
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

function TrustSidebar({
  sidebar,
}: {
  sidebar: {
    name: string;
    title: string;
    badges: readonly string[];
    contact: { email: string; wechat: string };
  };
}) {
  return (
    <div className="lg:sticky" style={{ top: 96 }}>
      <h3 className="text-lg font-bold text-gray-900">{sidebar.name}</h3>
      <p className="text-sm text-gray-500 mb-4">{sidebar.title}</p>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-5">
        {sidebar.badges.map((badge, index) => (
          <span
            key={`${badge}-${index}`}
            className="text-xs font-medium px-3 py-1 rounded-full text-white"
            style={{
              backgroundColor: index === 0 ? '#16a34a' : index === 1 ? GOLD : NAVY,
            }}
          >
            {badge}
          </span>
        ))}
      </div>

      {/* Contact Info */}
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-semibold">邮箱：</span>
          <Link href={`mailto:${sidebar.contact.email}`} style={{ color: NAVY }}>
            {sidebar.contact.email}
          </Link>
        </p>
        <p>
          <span className="font-semibold">微信：</span>
          {sidebar.contact.wechat}
        </p>
      </div>
    </div>
  );
}

/* ── Confirmation Screen ── */

function Confirmation({
  confirmation,
  locale,
}: {
  confirmation: {
    title: string;
    message: string;
    nextStepsTitle: string;
    nextSteps: readonly string[];
    emergencyPrefix: string;
    emergencyEmail: string;
    linkLabel: string;
    linkHref: string;
  };
  locale: string;
}) {
  const linkHref =
    typeof confirmation.linkHref === 'string' &&
    confirmation.linkHref.startsWith('http')
      ? confirmation.linkHref
      : typeof confirmation.linkHref === 'string' &&
          confirmation.linkHref.startsWith('/')
        ? `/${locale}${confirmation.linkHref}`
        : `/${locale}/services`;

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

      <h2 className="text-2xl font-bold text-gray-900 mb-3">{confirmation.title}</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">{confirmation.message}</p>

      <div className="text-left max-w-sm mx-auto mb-8">
        <h3 className="font-semibold text-gray-900 mb-3">{confirmation.nextStepsTitle}</h3>
        <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
          {confirmation.nextSteps.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ol>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        {confirmation.emergencyPrefix}{' '}
        <Link
          href={`mailto:${confirmation.emergencyEmail}`}
          className="font-semibold"
          style={{ color: NAVY }}
        >
          {confirmation.emergencyEmail}
        </Link>
      </p>

      <Link
        href={linkHref}
        className="inline-block text-sm font-semibold underline"
        style={{ color: NAVY }}
      >
        {confirmation.linkLabel}
      </Link>
    </div>
  );
}

/* ── Step Forms ── */

function Step1({
  data,
  errors,
  update,
  copy,
}: {
  data: FormData;
  errors: Record<string, string>;
  update: (field: keyof FormData, value: string) => void;
  copy: Record<string, any>;
}) {
  const options = Array.isArray(copy?.languageOptions) && copy.languageOptions.length
    ? copy.languageOptions
    : ['普通话'];
  return (
    <div className="space-y-5">
      <div>
        <Label required>{copy?.nameLabel || '姓名'}</Label>
        <TextInput
          value={data.name}
          onChange={(v) => update('name', v)}
          placeholder={copy?.namePlaceholder || '请输入您的姓名'}
          error={errors.name}
        />
      </div>
      <div>
        <Label required>{copy?.emailLabel || '电子邮箱'}</Label>
        <TextInput
          value={data.email}
          onChange={(v) => update('email', v)}
          placeholder={copy?.emailPlaceholder || '请输入您的电子邮箱'}
          type="email"
          error={errors.email}
        />
      </div>
      <div>
        <Label>{copy?.phoneLabel || '电话号码'}</Label>
        <TextInput
          value={data.phone}
          onChange={(v) => update('phone', v)}
          placeholder={copy?.phonePlaceholder || '请输入电话号码（选填）'}
          type="tel"
          error={errors.phone}
        />
      </div>
      <div>
        <Label>{copy?.wechatLabel || '微信号'}</Label>
        <TextInput
          value={data.wechat}
          onChange={(v) => update('wechat', v)}
          placeholder={copy?.wechatPlaceholder || '请输入微信号（选填）'}
        />
      </div>
      <div>
        <Label>{copy?.languageLabel || '首选语言'}</Label>
        <select
          value={data.language}
          onChange={(e) => update('language', e.target.value)}
          className="w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2"
          style={{ padding: '12px 16px' }}
        >
          {options.map((option: string) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Step2({
  data,
  errors,
  update,
  copy,
}: {
  data: FormData;
  errors: Record<string, string>;
  update: (field: keyof FormData, value: string) => void;
  copy: Record<string, any>;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label required>{copy?.inUsLabel || '您目前在美国吗？'}</Label>
        <RadioPills
          options={copy?.inUsOptions || ['是', '否']}
          value={data.inUS}
          onChange={(v) => update('inUS', v)}
          error={errors.inUS}
        />
      </div>
      <div>
        <Label required>{copy?.hasNtaLabel || '是否收到出庭通知（NTA）？'}</Label>
        <RadioPills
          options={copy?.hasNtaOptions || ['是', '否', '不确定']}
          value={data.hasNTA}
          onChange={(v) => update('hasNTA', v)}
          error={errors.hasNTA}
        />
      </div>
      <div>
        <Label required>{copy?.filedI589Label || '是否已提交I-589？'}</Label>
        <RadioPills
          options={copy?.filedI589Options || ['是', '否']}
          value={data.filedI589}
          onChange={(v) => update('filedI589', v)}
          error={errors.filedI589}
        />
      </div>
      <div>
        <Label required>{copy?.overOneYearLabel || '来美是否已超过一年？'}</Label>
        <RadioPills
          options={copy?.overOneYearOptions || ['是', '否', '不确定']}
          value={data.overOneYear}
          onChange={(v) => update('overOneYear', v)}
          error={errors.overOneYear}
        />
      </div>
    </div>
  );
}

function Step3({
  data,
  errors,
  update,
  copy,
}: {
  data: FormData;
  errors: Record<string, string>;
  update: (field: keyof FormData, value: string) => void;
  copy: Record<string, any>;
}) {
  const hasDateOptions = copy?.hasDateOptions || ['是', '否'];
  const affirmativeValue = hasDateOptions[0] || '是';
  return (
    <div className="space-y-5">
      <div>
        <Label required>{copy?.hasDateLabel || '是否有面谈或开庭日期？'}</Label>
        <RadioPills
          options={hasDateOptions}
          value={data.hasDate}
          onChange={(v) => update('hasDate', v)}
          error={errors.hasDate}
        />
      </div>
      {data.hasDate === affirmativeValue && (
        <div>
          <Label required>{copy?.courtDateLabel || '日期'}</Label>
          <TextInput value={data.courtDate} onChange={(v) => update('courtDate', v)} type="date" error={errors.courtDate} />
        </div>
      )}
      <div>
        <Label required>{copy?.nationalityLabel || '国籍'}</Label>
        <TextInput
          value={data.nationality}
          onChange={(v) => update('nationality', v)}
          placeholder={copy?.nationalityPlaceholder || '请输入您的国籍'}
          error={errors.nationality}
        />
      </div>
      <div>
        <Label required>{copy?.mainQuestionLabel || '最想咨询的问题'}</Label>
        <textarea
          value={data.mainQuestion}
          onChange={(e) => update('mainQuestion', e.target.value)}
          placeholder={copy?.mainQuestionPlaceholder || '请详细描述您最想咨询的问题（至少20字）'}
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
  copy,
}: {
  data: FormData;
  errors: Record<string, string>;
  update: (field: keyof FormData, value: string) => void;
  copy: Record<string, any>;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label required>{copy?.hasFamilyLabel || '家属是否需要一起申请？'}</Label>
        <RadioPills
          options={copy?.hasFamilyOptions || ['是', '否']}
          value={data.hasFamily}
          onChange={(v) => update('hasFamily', v)}
          error={errors.hasFamily}
        />
      </div>
      <div>
        <Label>{copy?.otherApplicationsLabel || '其他移民申请'}</Label>
        <textarea
          value={data.otherApplications}
          onChange={(e) => update('otherApplications', e.target.value)}
          placeholder={copy?.otherApplicationsPlaceholder || '如有其他移民申请，请在此说明（选填）'}
          rows={3}
          className="w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 resize-none"
          style={{ padding: '12px 16px' }}
        />
      </div>
      <div>
        <Label>{copy?.additionalInfoLabel || '补充信息'}</Label>
        <textarea
          value={data.additionalInfo}
          onChange={(e) => update('additionalInfo', e.target.value)}
          placeholder={copy?.additionalInfoPlaceholder || '任何其他您希望律师了解的信息（选填）'}
          rows={3}
          className="w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 resize-none"
          style={{ padding: '12px 16px' }}
        />
      </div>
    </div>
  );
}

/* ── Main Component ── */

interface IntakeFormProps {
  locale: string;
  content?: Record<string, any>;
}

export default function IntakeForm({ locale, content }: IntakeFormProps) {
  const consultationContent = deepMerge(DEFAULT_CONSULTATION_CONTENT, content ?? {});
  const stepTitles =
    Array.isArray(consultationContent.steps) && consultationContent.steps.length === 4
      ? consultationContent.steps
      : [...DEFAULT_CONSULTATION_CONTENT.steps];
  const step1Copy = consultationContent.form?.step1 ?? DEFAULT_CONSULTATION_CONTENT.form.step1;
  const step2Copy = consultationContent.form?.step2 ?? DEFAULT_CONSULTATION_CONTENT.form.step2;
  const step3Copy = consultationContent.form?.step3 ?? DEFAULT_CONSULTATION_CONTENT.form.step3;
  const step4Copy = consultationContent.form?.step4 ?? DEFAULT_CONSULTATION_CONTENT.form.step4;
  const buttonCopy =
    consultationContent.form?.buttons ?? DEFAULT_CONSULTATION_CONTENT.form.buttons;
  const errorCopy = consultationContent.form?.errors ?? DEFAULT_CONSULTATION_CONTENT.form.errors;
  const hasDateAffirmative =
    Array.isArray(step3Copy?.hasDateOptions) && step3Copy.hasDateOptions.length
      ? step3Copy.hasDateOptions[0]
      : '是';
  const sidebarCopy =
    consultationContent.sidebar ?? DEFAULT_CONSULTATION_CONTENT.sidebar;
  const confirmationCopy =
    consultationContent.confirmation ?? DEFAULT_CONSULTATION_CONTENT.confirmation;
  const languageOptions =
    Array.isArray(step1Copy.languageOptions) && step1Copy.languageOptions.length
      ? step1Copy.languageOptions
      : ['普通话'];
  const initialData: FormData = {
    ...INITIAL,
    language: languageOptions[0] || INITIAL.language,
  };

  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
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
      if (!data.name.trim()) errs.name = errorCopy.nameRequired || '请输入姓名';
      if (!data.email.trim()) {
        errs.email = errorCopy.emailRequired || '请输入电子邮箱';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errs.email = errorCopy.emailInvalid || '请输入有效的邮箱地址';
      }
    } else if (s === 1) {
      if (!data.inUS) errs.inUS = errorCopy.selectRequired || '请选择';
      if (!data.hasNTA) errs.hasNTA = errorCopy.selectRequired || '请选择';
      if (!data.filedI589) errs.filedI589 = errorCopy.selectRequired || '请选择';
      if (!data.overOneYear) errs.overOneYear = errorCopy.selectRequired || '请选择';
    } else if (s === 2) {
      if (!data.hasDate) errs.hasDate = errorCopy.selectRequired || '请选择';
      if (data.hasDate === hasDateAffirmative && !data.courtDate) {
        errs.courtDate = errorCopy.dateRequired || '请选择日期';
      }
      if (!data.nationality.trim()) {
        errs.nationality = errorCopy.nationalityRequired || '请输入国籍';
      }
      if (!data.mainQuestion.trim()) {
        errs.mainQuestion =
          errorCopy.mainQuestionRequired || '请描述您的问题';
      } else if (data.mainQuestion.trim().length < 20) {
        errs.mainQuestion = errorCopy.mainQuestionMin || '请至少输入20个字';
      }
    } else if (s === 3) {
      if (!data.hasFamily) errs.hasFamily = errorCopy.selectRequired || '请选择';
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
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) throw new Error('Submit failed');
      setSubmitted(true);
    } catch {
      setErrors({
        _form:
          errorCopy.formSubmitFailed ||
          '提交失败，请稍后重试或发送邮件至 yuxiaris@gmail.com',
      });
    } finally {
      setSubmitting(false);
    }
  }

  const stepComponents = [
    <Step1 key={0} data={data} errors={errors} update={update} copy={step1Copy} />,
    <Step2 key={1} data={data} errors={errors} update={update} copy={step2Copy} />,
    <Step3 key={2} data={data} errors={errors} update={update} copy={step3Copy} />,
    <Step4 key={3} data={data} errors={errors} update={update} copy={step4Copy} />,
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
            {consultationContent.hero?.title || DEFAULT_CONSULTATION_CONTENT.hero.title}
          </h1>
          <p className="text-white/70 text-lg">
            {consultationContent.hero?.subtitle || DEFAULT_CONSULTATION_CONTENT.hero.subtitle}
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
                  <Confirmation confirmation={confirmationCopy} locale={locale} />
                ) : (
                  <form onSubmit={handleSubmit}>
                    <ProgressDots current={step} steps={stepTitles} />

                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      {stepTitles[step]}
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
                          {buttonCopy.back || '上一步'}
                        </button>
                      ) : (
                        <div />
                      )}

                      {step < stepTitles.length - 1 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-6 py-2.5 text-sm font-semibold text-white rounded-md transition-colors"
                          style={{ backgroundColor: NAVY }}
                        >
                          {buttonCopy.next || '下一步'}
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-6 py-2.5 text-sm font-semibold text-white rounded-md transition-colors disabled:opacity-60"
                          style={{ backgroundColor: GOLD }}
                        >
                          {submitting
                            ? buttonCopy.submitting || '提交中...'
                            : buttonCopy.submit || '提交案件信息'}
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Trust Sidebar (40%) */}
            <div className="w-full lg:w-[40%]">
              <TrustSidebar sidebar={sidebarCopy} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
