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

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const amount = Math.max(280, Math.floor(track.clientWidth * 0.75));
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
      >
        {safeItems.map((testimonial, i) => (
          <div
            key={`${testimonial.name || "review"}-${i}`}
            className="snap-start flex-shrink-0 w-[86%] sm:w-[72%] md:w-[48%] lg:w-[32%]"
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
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full border text-white items-center justify-center"
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
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full border text-white items-center justify-center"
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
