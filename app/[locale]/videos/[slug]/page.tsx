import Link from 'next/link';
import { loadAllItems, loadContent, getRequestSiteId } from '@/lib/content';
import type { Locale } from '@/lib/i18n';

interface VideoData {
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
  duration?: string;
  videoUrl?: string;
  publishDate?: string;
  author?: string;
  contentMarkdown?: string;
}

export async function generateStaticParams() {
  const siteId = await getRequestSiteId();
  const videos = await loadAllItems<VideoData>(siteId, 'zh', 'videos');
  return videos.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }) {
  const siteId = await getRequestSiteId();
  const video = await loadContent<VideoData>(siteId, params.locale as Locale, `videos/${params.slug}.json`);
  if (!video) return { title: '视频 | 宇律师事务所' };
  return {
    title: `${video.title} | 宇律师事务所`,
    description: video.excerpt || video.title,
  };
}

export default async function VideoDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = params.locale as Locale;
  const siteId = await getRequestSiteId();
  const video = await loadContent<VideoData>(siteId, locale, `videos/${params.slug}.json`);

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ marginTop: 72 }}>
        <p className="text-gray-500">视频未找到</p>
      </div>
    );
  }

  // Convert YouTube URL to embed URL
  let embedUrl = '';
  if (video.videoUrl) {
    embedUrl = video.videoUrl
      .replace('watch?v=', 'embed/')
      .replace('youtu.be/', 'youtube.com/embed/');
  }

  return (
    <>
      {/* Hero */}
      <section
        className="min-h-[200px] flex items-end"
        style={{ marginTop: 72, background: 'linear-gradient(135deg, #1B2A4A 0%, #0F1A32 100%)' }}
      >
        <div className="max-w-[1280px] mx-auto px-6 w-full py-8">
          <nav className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <Link href={`/${locale}`} className="hover:text-white">首页</Link>
            <span className="mx-2">/</span>
            <Link href={`/${locale}/videos`} className="hover:text-white">视频中心</Link>
            <span className="mx-2">/</span>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>{video.title}</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
            {video.title}
          </h1>
          <div className="flex items-center gap-4 mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {video.category && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#C9963B', color: 'white' }}>
                {video.category}
              </span>
            )}
            {video.duration && <span>时长: {video.duration}</span>}
            {video.publishDate && <span>{video.publishDate}</span>}
          </div>
        </div>
      </section>

      {/* Video Player */}
      <section className="py-12 bg-white">
        <div className="max-w-[900px] mx-auto px-6">
          {/* Video Embed */}
          {embedUrl ? (
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-900 mb-8">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
              />
            </div>
          ) : (
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center mb-8">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">▶</div>
                <p>视频即将上线</p>
              </div>
            </div>
          )}

          {/* Summary */}
          {video.excerpt && (
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">{video.excerpt}</p>
          )}

          {/* Transcript / Content */}
          {video.contentMarkdown && (
            <div className="border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-gray-800">文字版内容</h2>
              </div>
              <div className="px-6 py-6 text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                {video.contentMarkdown.replace(/^#\s.*\n\n?/, '').replace(/#{2,}\s/g, '\n')}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 text-center p-8 rounded-lg" style={{ background: 'linear-gradient(135deg, #1B2A4A 0%, #0F1A32 100%)' }}>
            <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              有类似问题？免费咨询律师
            </h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
              每个案件情况不同，让专业律师为您分析
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href={`/${locale}/consultation`}
                className="px-6 py-3 rounded-md text-white font-semibold"
                style={{ backgroundColor: '#B8373D' }}
              >
                预约免费咨询
              </Link>
              <Link
                href="mailto:yuxiaris@gmail.com"
                className="px-6 py-3 rounded-md font-semibold border-2 border-white text-white"
              >
                发送邮件至 yuxiaris@gmail.com
              </Link>
            </div>
          </div>

          {/* Back to videos */}
          <div className="mt-8 text-center">
            <Link href={`/${locale}/videos`} className="text-sm font-semibold" style={{ color: '#C9963B' }}>
              ← 返回视频中心
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
