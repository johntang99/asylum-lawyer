'use client';

import { ReactNode, useState } from 'react';

interface WechatQrPopupTriggerProps {
  wechatId: string;
  qrCodeUrl: string;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  helperText?: string;
}

export default function WechatQrPopupTrigger({
  wechatId,
  qrCodeUrl,
  children,
  className,
  style,
  helperText = '请使用微信扫码添加好友',
}: WechatQrPopupTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className}
        style={style}
      >
        {children ?? `微信: ${wechatId}`}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="微信二维码"
            className="w-full max-w-xs rounded-xl p-4 shadow-2xl"
            style={{ backgroundColor: '#ffffff' }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900">微信: {wechatId}</h4>
              <button
                type="button"
                aria-label="关闭二维码弹窗"
                className="rounded px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                关闭
              </button>
            </div>
            <img
              src={qrCodeUrl}
              alt={`微信二维码：${wechatId || '微信'}`}
              className="h-auto w-full rounded-lg border border-gray-200"
            />
            <p className="mt-2 text-center text-xs text-gray-500">{helperText}</p>
          </div>
        </div>
      )}
    </>
  );
}
