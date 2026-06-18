"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface TestimonialItem {
  name?: string;
  type?: string;
  year?: string;
  quote?: string;
  rating?: string;
}

interface TestimonialsCarouselProps {
  items: TestimonialItem[];
}

export default function TestimonialsCarousel({ items }: TestimonialsCarouselProps) {
  const safeItems = useMemo(
    () => items.filter((item) => item && (item.quote || item.name)),
    [items]
  );
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [autoPaused, setAutoPaused] = useState(false);

  if (safeItems.length === 0) return null;

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    setCanScrollPrev(track.scrollLeft > 4);
    setCanScrollNext(track.scrollLeft < maxScrollLeft - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollState();
    track.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [safeItems.length, updateScrollState]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || safeItems.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    let lastTs = 0;
    let carryPx = 0;
    const speedPxPerSecond = 96;

    const tick = (ts: number) => {
      const el = trackRef.current;
      if (!el) return;

      if (lastTs === 0) lastTs = ts;
      const dt = Math.min(64, ts - lastTs);
      lastTs = ts;

      if (!autoPaused) {
        const maxScrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
        if (maxScrollLeft > 4) {
          // Use integer pixel steps to avoid sub-pixel no-op on some browsers.
          const stepRaw = (speedPxPerSecond * dt) / 1000 + carryPx;
          const step = Math.max(1, Math.floor(stepRaw));
          carryPx = Math.max(0, stepRaw - step);
          const next = el.scrollLeft + step;
          if (next >= maxScrollLeft - 1) {
            el.scrollLeft = 0;
            carryPx = 0;
          } else {
            el.scrollLeft = next;
          }
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [safeItems.length, autoPaused]);

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const amount = Math.max(280, Math.floor(track.clientWidth * 0.75));
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      <div
        ref={trackRef}
        className="flex gap-4 md:gap-6 overflow-x-auto pb-4 px-6 md:px-8 lg:px-10"
        aria-label="客户评价横向滚动列表"
        onPointerEnter={() => setAutoPaused(true)}
        onPointerLeave={() => setAutoPaused(false)}
      >
        {safeItems.map((testimonial, i) => (
          <div
            key={`${testimonial.name || "review"}-${i}`}
            className="flex-shrink-0 w-[86%] sm:w-[68%] md:w-[46%] lg:w-[34%] xl:w-[28%]"
          >
            <article
              className="rounded-xl p-6 md:p-7 h-full"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <div className="text-lg mb-3" style={{ color: "#C9963B" }}>
                {testimonial.rating || "★★★★★"}
              </div>
              <p className="text-[15px] md:text-base text-gray-200 leading-relaxed mb-5">
                {testimonial.quote}
              </p>
              <div className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.16)" }}>
                <div className="text-white font-bold">{testimonial.name}</div>
                {(testimonial.type || testimonial.year) && (
                  <div className="text-gray-400 text-sm mt-1">
                    {[testimonial.type, testimonial.year].filter(Boolean).join(" · ")}
                  </div>
                )}
              </div>
            </article>
          </div>
        ))}
      </div>

      {safeItems.length > 1 && canScrollPrev && (
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          className="hidden md:flex absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border text-white items-center justify-center"
          style={{
            backgroundColor: "rgba(15,26,50,0.78)",
            borderColor: "rgba(255,255,255,0.22)",
          }}
          aria-label="向前查看评价"
        >
          ‹
        </button>
      )}

      {safeItems.length > 1 && canScrollNext && (
        <button
          type="button"
          onClick={() => scrollByPage(1)}
          className="hidden md:flex absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border text-white items-center justify-center"
          style={{
            backgroundColor: "rgba(15,26,50,0.78)",
            borderColor: "rgba(255,255,255,0.22)",
          }}
          aria-label="向后查看评价"
        >
          ›
        </button>
      )}
    </div>
  );
}
