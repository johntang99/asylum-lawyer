'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { HeroVariant } from '@/lib/section-variants';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface HeroSectionProps {
  variant?: HeroVariant;
  headline: string;
  subheadline?: string;
  image?: string;
  backgroundImage?: string;
  video?: string;
  gallery?: string[];
  photoOverlayOpacity?: number;
  photoContentPosition?: 'center' | 'center-below' | 'left' | 'left-below' | 'lower';
  cta?: {
    primary?: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
  stats?: Array<{ value: string; label: string }>;
}

function HeroCTA({ cta }: { cta?: HeroSectionProps['cta'] }) {
  if (!cta) return null;
  return (
    <div className="flex flex-wrap gap-4 mb-12">
      {cta.primary && (
        <Link
          href={cta.primary.href}
          className="inline-block px-[36px] py-[16px] text-white font-semibold rounded-md transition-colors hover:brightness-110"
          style={{ backgroundColor: '#B8373D' }}
        >
          {cta.primary.label}
        </Link>
      )}
      {cta.secondary && (
        <Link
          href={cta.secondary.href}
          className="inline-block px-[36px] py-[16px] font-semibold rounded-md border border-white text-white bg-transparent transition-colors hover:bg-white/10"
        >
          {cta.secondary.label}
        </Link>
      )}
    </div>
  );
}

function HeroStats({ stats, theme = 'dark' }: { stats: HeroSectionProps['stats']; theme?: 'dark' | 'light' }) {
  if (!stats?.length) return null;
  const valueColor = theme === 'dark' ? '#C9963B' : '#C9963B';
  const labelClass = theme === 'dark' ? 'text-white/70' : 'text-gray-500';
  return (
    <div className="flex flex-wrap gap-12">
      {stats.map((stat, i) => (
        <div key={i}>
          <div
            className="text-[2rem] font-bold"
            style={{ color: valueColor, fontFamily: 'var(--font-body, Inter, sans-serif)' }}
          >
            {stat.value}
          </div>
          <div className={`text-xs uppercase tracking-widest mt-1 ${labelClass}`}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatsBar({ stats }: { stats?: HeroSectionProps['stats'] }) {
  if (!stats?.length) return null;
  return (
    <section
      className="py-8"
      style={{ backgroundColor: '#1B2A4A', borderTop: '1px solid rgba(255,255,255,0.1)' }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div
                className="text-[2rem] font-bold"
                style={{ color: '#C9963B' }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-white/70 uppercase tracking-widest mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HeroSection({
  variant = 'stats-bar',
  headline,
  subheadline,
  image,
  backgroundImage,
  video,
  gallery,
  photoOverlayOpacity = 0.6,
  photoContentPosition = 'left',
  cta,
  stats,
}: HeroSectionProps) {
  const heroImage = image || backgroundImage;
  const normalizedPhotoContentPosition =
    photoContentPosition === 'lower' ? 'left-below' : photoContentPosition;
  const isBelowPosition =
    normalizedPhotoContentPosition === 'center-below' ||
    normalizedPhotoContentPosition === 'left-below';
  const isCenterAlignedPosition =
    normalizedPhotoContentPosition === 'center' ||
    normalizedPhotoContentPosition === 'center-below';

  const galleryImages = useMemo(
    () =>
      Array.isArray(gallery)
        ? gallery.filter((src): src is string => typeof src === 'string' && src.trim().length > 0)
        : [],
    [gallery]
  );

  const galleryBackgroundImages = useMemo(() => {
    if (variant !== 'gallery-background') return galleryImages;
    const merged = [backgroundImage, image, ...galleryImages].filter(
      (src): src is string => typeof src === 'string' && src.trim().length > 0
    );
    return Array.from(new Set(merged));
  }, [variant, backgroundImage, image, galleryImages]);

  const useGalleryBackground =
    variant === 'gallery-background' && galleryBackgroundImages.length > 0;
  const shouldRotateGallery = useGalleryBackground && galleryBackgroundImages.length > 1;
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  useEffect(() => {
    setActiveGalleryIndex(0);
  }, [variant, galleryImages, backgroundImage, image]);

  useEffect(() => {
    if (!shouldRotateGallery) return;
    const timerId = window.setInterval(() => {
      setActiveGalleryIndex((current) => (current + 1) % galleryBackgroundImages.length);
    }, 3000);
    return () => window.clearInterval(timerId);
  }, [shouldRotateGallery, galleryBackgroundImages.length]);

  switch (variant) {
    case 'split-photo-right':
      return (
        <>
          <section
            className="min-h-[520px] flex items-center"
            style={{
              marginTop: '72px',
              background: 'linear-gradient(135deg, #1B2A4A 0%, #0F1A32 100%)',
            }}
          >
            <div className="max-w-[1200px] mx-auto px-6 py-20 w-full">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h1
                    className="text-[2.5rem] lg:text-[3rem] font-bold text-white mb-4 leading-tight"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {headline}
                  </h1>
                  {subheadline && (
                    <p className="text-[1.125rem] text-white/85 leading-relaxed mb-8">
                      {subheadline}
                    </p>
                  )}
                  <HeroCTA cta={cta} />
                </div>
                {heroImage && (
                  <div className="relative w-full max-w-xl mx-auto lg:mx-0">
                    <div className="bg-white/10 rounded-lg overflow-hidden">
                      <Image
                        src={heroImage}
                        alt={headline}
                        width={600}
                        height={600}
                        className="w-full h-auto object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
          {stats && <StatsBar stats={stats} />}
        </>
      );

    case 'split-photo-left':
      return (
        <>
          <section
            className="min-h-[520px] flex items-center"
            style={{
              marginTop: '72px',
              background: 'linear-gradient(135deg, #1B2A4A 0%, #0F1A32 100%)',
            }}
          >
            <div className="max-w-[1200px] mx-auto px-6 py-20 w-full">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {heroImage && (
                  <div className="relative w-full max-w-xl mx-auto lg:mx-0 order-2 lg:order-1">
                    <div className="bg-white/10 rounded-lg overflow-hidden">
                      <Image
                        src={heroImage}
                        alt={headline}
                        width={600}
                        height={600}
                        className="w-full h-auto object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  </div>
                )}
                <div className="order-1 lg:order-2">
                  <h1
                    className="text-[2.5rem] lg:text-[3rem] font-bold text-white mb-4 leading-tight"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {headline}
                  </h1>
                  {subheadline && (
                    <p className="text-[1.125rem] text-white/85 leading-relaxed mb-8">
                      {subheadline}
                    </p>
                  )}
                  <HeroCTA cta={cta} />
                </div>
              </div>
            </div>
          </section>
          {stats && <StatsBar stats={stats} />}
        </>
      );

    case 'centered':
      return (
        <>
          <section
            className="min-h-[520px] flex items-center"
            style={{
              marginTop: '72px',
              background: heroImage
                ? undefined
                : 'linear-gradient(135deg, #1B2A4A 0%, #0F1A32 100%)',
            }}
          >
            {heroImage && (
              <>
                <div className="absolute inset-0 z-0">
                  <Image src={heroImage} alt={headline} fill className="object-cover" sizes="100vw" priority />
                </div>
                <div className="absolute inset-0 z-0 bg-[#0F1A32]/70" />
              </>
            )}
            <div className="max-w-[1200px] mx-auto px-6 py-20 w-full relative z-10 text-center">
              <div className="max-w-[800px] mx-auto">
                <h1
                  className="text-[2.5rem] lg:text-[3rem] font-bold text-white mb-4 leading-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {headline}
                </h1>
                {subheadline && (
                  <p className="text-[1.125rem] text-white/85 leading-relaxed mb-8">
                    {subheadline}
                  </p>
                )}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  {cta?.primary && (
                    <Link
                      href={cta.primary.href}
                      className="inline-block px-[36px] py-[16px] text-white font-semibold rounded-md transition-colors hover:brightness-110"
                      style={{ backgroundColor: '#B8373D' }}
                    >
                      {cta.primary.label}
                    </Link>
                  )}
                  {cta?.secondary && (
                    <Link
                      href={cta.secondary.href}
                      className="inline-block px-[36px] py-[16px] font-semibold rounded-md border border-white text-white bg-transparent transition-colors hover:bg-white/10"
                    >
                      {cta.secondary.label}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
          {stats && <StatsBar stats={stats} />}
        </>
      );

    case 'gallery-background':
    case 'photo-background':
      return (
        <>
          <section
            className="relative min-h-[600px] flex items-center"
            style={{ marginTop: '72px' }}
          >
            {(heroImage || useGalleryBackground) && (
              <>
                {shouldRotateGallery ? (
                  <div className="absolute inset-0 z-0">
                    {galleryBackgroundImages.map((galleryImage, index) => (
                      <div
                        key={`${galleryImage}-${index}`}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                          index === activeGalleryIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <Image src={galleryImage} alt={`${headline} ${index + 1}`} fill className="object-cover" sizes="100vw" priority={index === 0} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={useGalleryBackground ? galleryBackgroundImages[0] : heroImage!}
                      alt={headline}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      priority
                    />
                  </div>
                )}
                <div
                  className="absolute inset-0 z-0"
                  style={{ backgroundColor: `rgba(15, 26, 50, ${photoOverlayOpacity})` }}
                />
              </>
            )}
            <div
              className={`max-w-[1200px] mx-auto px-6 py-20 w-full relative z-10 min-h-[600px] flex ${
                isBelowPosition ? 'items-end pb-12' : 'items-center'
              }`}
            >
              <div
                className={`relative max-w-[700px] ${
                  isCenterAlignedPosition ? 'mx-auto text-center' : 'text-left'
                } ${isBelowPosition ? 'translate-y-6 md:translate-y-10' : ''}`}
              >
                <div className="absolute -inset-x-10 -inset-y-8 -z-10 pointer-events-none">
                  <div
                    className="w-full h-full"
                    style={{
                      background:
                        isCenterAlignedPosition
                          ? 'radial-gradient(120% 140% at 50% 75%, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.44) 34%, rgba(0,0,0,0.22) 58%, rgba(0,0,0,0.09) 72%, rgba(0,0,0,0) 86%)'
                          : 'radial-gradient(120% 140% at 18% 75%, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.44) 34%, rgba(0,0,0,0.22) 58%, rgba(0,0,0,0.09) 72%, rgba(0,0,0,0) 86%)',
                      filter: 'blur(8px)',
                    }}
                  />
                </div>
                <h1
                  className="text-[2.5rem] lg:text-[3rem] font-bold text-white mb-4 leading-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {headline}
                </h1>
                {subheadline && (
                  <p className="text-[1.125rem] text-white/85 leading-relaxed mb-8 whitespace-pre-line">
                    {subheadline}
                  </p>
                )}
                <HeroCTA cta={cta} />
              </div>
            </div>
          </section>
          {stats && <StatsBar stats={stats} />}
        </>
      );

    case 'overlap':
      return (
        <>
          <section
            className="relative min-h-[600px]"
            style={{ marginTop: '72px' }}
          >
            {heroImage && (
              <div className="absolute inset-0 z-0">
                <Image src={heroImage} alt={headline} fill className="object-cover" sizes="100vw" priority />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F1A32]/70 to-[#0F1A32]/30" />
              </div>
            )}
            <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-20">
              <div className="max-w-2xl">
                <div className="bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-lg shadow-xl">
                  <h1
                    className="text-[2rem] lg:text-[2.5rem] font-bold text-gray-900 mb-4 leading-tight"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {headline}
                  </h1>
                  {subheadline && (
                    <p className="text-[1rem] text-gray-600 leading-relaxed mb-8">
                      {subheadline}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4">
                    {cta?.primary && (
                      <Link
                        href={cta.primary.href}
                        className="inline-block px-[36px] py-[16px] text-white font-semibold rounded-md transition-colors hover:brightness-110"
                        style={{ backgroundColor: '#B8373D' }}
                      >
                        {cta.primary.label}
                      </Link>
                    )}
                    {cta?.secondary && (
                      <Link
                        href={cta.secondary.href}
                        className="inline-block px-[36px] py-[16px] font-semibold rounded-md border-2 transition-colors"
                        style={{ borderColor: '#1B2A4A', color: '#1B2A4A' }}
                      >
                        {cta.secondary.label}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
          {stats && <StatsBar stats={stats} />}
        </>
      );

    case 'video-background':
      return (
        <>
          <section
            className="relative min-h-[600px] flex items-center overflow-hidden"
            style={{ marginTop: '72px' }}
          >
            {video && (
              <>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover z-0"
                >
                  <source src={video} type="video/mp4" />
                </video>
                <div className="absolute inset-0 z-0 bg-[#0F1A32]/60" />
              </>
            )}
            <div className="max-w-[1200px] mx-auto px-6 py-20 w-full relative z-10">
              <div className="max-w-[700px]">
                <h1
                  className="text-[2.5rem] lg:text-[3rem] font-bold text-white mb-4 leading-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {headline}
                </h1>
                {subheadline && (
                  <p className="text-[1.125rem] text-white/85 leading-relaxed mb-8">
                    {subheadline}
                  </p>
                )}
                <HeroCTA cta={cta} />
              </div>
            </div>
          </section>
          {stats && <StatsBar stats={stats} />}
        </>
      );

    // 'stats-bar' (default — original asylum site layout)
    case 'stats-bar':
    default:
      return (
        <section
          className="min-h-[520px] flex items-center"
          style={{
            marginTop: '72px',
            background: 'linear-gradient(135deg, #1B2A4A 0%, #0F1A32 100%)',
          }}
        >
          <div className="max-w-[1200px] mx-auto px-6 py-20 w-full">
            <div className="max-w-[700px]">
              <h1
                className="text-[3rem] font-bold text-white mb-4 leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {headline}
              </h1>
              {subheadline && (
                <p className="text-[1.125rem] text-white/85 leading-relaxed mb-8">
                  {subheadline}
                </p>
              )}
              <HeroCTA cta={cta} />
              <HeroStats stats={stats} />
            </div>
          </div>
        </section>
      );
  }
}
