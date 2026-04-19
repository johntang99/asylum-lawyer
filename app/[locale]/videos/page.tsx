import Link from 'next/link';
import { loadAllItems } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import SectionHeader from '@/components/shared/SectionHeader';

export async function generateMetadata() {
  return {
    title: '视频中心 | 正道移民服务中心',
    description: '律师亲自解答庇护移民常见问题。观看视频了解庇护申请流程、面谈准备、政策变化等内容。',
  };
}

interface VideoItem {
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
  duration?: string;
  videoUrl?: string;
  publishDate?: string;
  author?: string;
}

export default async function VideosPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;

  // Load videos from content
  const videos = await loadAllItems<VideoItem>(undefined, locale, 'videos');

  // Sort by publishDate descending
  const sorted = [...videos].sort((a, b) => {
    const da = a.publishDate || '';
    const db = b.publishDate || '';
    return db.localeCompare(da);
  });

  return (
    <>
      {/* Hero */}
      <section
        className="min-h-[280px] flex items-center"
        style={{ marginTop: 72, background: 'linear-gradient(135deg, #1B2A4A 0%, #0F1A32 100%)' }}
      >
        <div className="max-w-[1280px] mx-auto px-6 w-full py-16">
          <nav className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <Link href={`/${locale}`} className="hover:text-white">首页</Link>
            <span className="mx-2">/</span>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>视频中心</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            视频中心
          </h1>
          <p className="text-lg" style={{ color: 'rgba(255,255,255,0.8)' }}>
            律师亲自解答庇护移民常见问题
          </p>
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-[80px] bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <SectionHeader label="视频" title="最新视频" subtitle="了解庇护移民的最新资讯和专业知识" />

          {sorted.length === 0 ? (
            <p className="text-center text-gray-500 py-12">暂无视频内容</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map((video) => (
                <Link
                  key={video.slug}
                  href={`/${locale}/videos/${video.slug}`}
                  className="group block rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  {(() => {
                    // Extract YouTube video ID for thumbnail
                    let ytId = '';
                    if (video.videoUrl) {
                      const m = video.videoUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                      if (m) ytId = m[1];
                    }
                    return (
                      <div
                        className="h-[200px] relative flex items-center justify-center overflow-hidden"
                        style={{
                          background: ytId ? undefined : 'linear-gradient(135deg, #1B2A4A, #0F1A32)',
                        }}
                      >
                        {ytId && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                            alt={video.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-xl group-hover:bg-white group-hover:scale-110 transition-all relative z-10"
                          style={{ color: '#1B2A4A' }}
                        >
                          ▶
                        </div>
                        {video.duration && (
                          <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-0.5 rounded z-10">
                            {video.duration}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#1B2A4A]">
                      {video.title}
                    </h3>
                    {video.category && (
                      <p className="text-xs text-gray-500">{video.category}</p>
                    )}
                    {video.publishDate && (
                      <p className="text-xs text-gray-400 mt-1">{video.publishDate}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-500 mb-4">有类似问题？咨询律师获取专业解答</p>
            <Link
              href={`/${locale}/consultation`}
              className="inline-block px-8 py-3 rounded-md text-white font-semibold transition-colors"
              style={{ backgroundColor: '#B8373D' }}
            >
              预约免费咨询
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
