'use client';

import { useState } from 'react';

interface ContactFormProps {
  email: string;
}

export default function ContactForm({ email }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale: 'zh',
          type: 'contact',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });
      if (res.ok) {
        setStatus('sent');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        // Fallback: open mailto
        window.location.href = `mailto:${email}?subject=${encodeURIComponent('在线咨询 - ' + formData.name)}&body=${encodeURIComponent(formData.message)}`;
        setStatus('sent');
      }
    } catch {
      // Fallback: open mailto
      window.location.href = `mailto:${email}?subject=${encodeURIComponent('在线咨询 - ' + formData.name)}&body=${encodeURIComponent(formData.message)}`;
      setStatus('sent');
    }
  };

  if (status === 'sent') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">留言已发送</h3>
        <p className="text-gray-600 text-sm mb-4">我们将在24小时内回复您。</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="text-sm font-medium"
          style={{ color: '#1B2A4A' }}
        >
          发送新留言
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8">
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            姓名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="请输入您的姓名"
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-transparent"
          />
        </div>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            电子邮箱 <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="请输入您的电子邮箱"
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-transparent"
          />
        </div>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            电话 / 微信
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="请输入电话号码或微信号（可选）"
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-transparent"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            简要说明
          </label>
          <textarea
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="请简要描述您的情况和需求"
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-transparent resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full py-3 text-white font-semibold rounded-md text-sm transition-colors disabled:opacity-50"
          style={{ backgroundColor: '#C9963B' }}
        >
          {status === 'sending' ? '发送中...' : '提交留言'}
        </button>
      </form>
    </div>
  );
}
