"use client";

import { useEffect, useState } from "react";
import SmartImage from "./SmartImage";

function formatReviewDate(date) {
  if (!date) return "Recent project";

  const reviewDate = new Date(date);
  if (Number.isNaN(reviewDate.getTime())) return "Recent project";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(reviewDate);
}

export default function TestimonialsCarousel({ reviews }) {
  const reviewCount = reviews.length;
  const [activeIndex, setActiveIndex] = useState(Math.min(1, reviewCount - 1));
  const [displayIndex, setDisplayIndex] = useState(Math.min(1, reviewCount - 1));
  const activeReview = reviews[displayIndex] || reviews[activeIndex] || reviews[0];
  const quote = activeReview?.message || "";

  function getReviewerPositionClass(index) {
    const diff = (index - activeIndex + reviewCount) % reviewCount;

    if (diff === 0) return "translate-x-0 translate-y-0 scale-100 opacity-100 z-20";
    if (diff === reviewCount - 1) return "translate-x-8 -translate-y-24 scale-90 opacity-70 z-10";
    if (diff === 1) return "translate-x-8 translate-y-24 scale-90 opacity-70 z-10";
    return "translate-x-14 translate-y-32 scale-75 opacity-0 pointer-events-none z-0";
  }

  useEffect(() => {
    const lastIndex = Math.max(reviewCount - 1, 0);
    setActiveIndex((index) => Math.min(index, lastIndex));
    setDisplayIndex((index) => Math.min(index, lastIndex));
  }, [reviewCount]);

  useEffect(() => {
    if (activeIndex === displayIndex) return undefined;

    const fadeTimer = window.setTimeout(() => {
      setDisplayIndex(activeIndex);
    }, 220);

    return () => window.clearTimeout(fadeTimer);
  }, [activeIndex, displayIndex]);

  useEffect(() => {
    if (reviewCount < 2) return undefined;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotionQuery.matches) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % reviewCount);
    }, 7800);

    return () => window.clearInterval(timer);
  }, [reviewCount]);

  if (!activeReview) return null;

  return (
    <div className="relative overflow-hidden bg-background-dark py-16 text-slate-100 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_22%,rgba(198,167,94,0.16),transparent_34%),linear-gradient(120deg,rgba(255,255,255,0.03),transparent_52%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="relative min-h-[30rem] overflow-hidden rounded-[2px] border border-white/10 bg-surface px-7 py-12 shadow-[0_30px_90px_rgba(0,0,0,0.42)] md:px-14 lg:min-h-[31rem] lg:px-20 lg:py-16">
          <div className="mb-12">
            <div className="mb-3 h-1 w-11 bg-primary" />
            <p className="text-base font-black tracking-tight text-white">Client Reviews</p>
          </div>

          <div className="grid min-h-[18rem] items-center gap-12 lg:grid-cols-[0.9fr_1.35fr] lg:gap-20">
            <div className="relative mx-auto h-60 w-full max-w-sm md:-ml-8">
              <div className="absolute left-12 top-1/2 h-[18rem] w-32 -translate-y-1/2 rounded-l-full border-l border-slate-600/60" />
              <div className="relative flex h-full items-center">
                {reviews.map((review, index) => {
                  const isActive = index === activeIndex;
                  const rating = Number(review.rating);
                  const displayRating = Number.isFinite(rating) && rating >= 1 && rating <= 5 ? rating.toFixed(1) : "4.9";

                  return (
                    <button
                      key={review.id || `${review.name}-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`absolute left-4 grid w-80 grid-cols-[4rem_1fr] items-center gap-4 rounded-full px-2 py-2 text-left transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${getReviewerPositionClass(index)}`}
                    >
                      <span className={`relative z-10 flex size-12 items-center justify-center rounded-full bg-background-dark shadow-[0_10px_28px_rgba(0,0,0,0.32)] ring-4 transition-colors duration-700 ${isActive ? "ring-primary/45" : "ring-surface"}`}>
                        {review.avatar_url ? (
                          <SmartImage src={review.avatar_url} alt={review.name} className="size-12 rounded-full object-cover" />
                        ) : (
                          <span className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-base font-black text-primary">
                            {review.name?.charAt(0)}
                          </span>
                        )}
                      </span>
                      <span>
                        <span className={`block font-black transition-all duration-700 ${isActive ? "text-lg text-white" : "text-xs text-slate-300"}`}>
                          {review.name}
                        </span>
                        <span className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                          <span className="text-base leading-none text-primary">★</span>
                          <span className="font-black text-primary">{displayRating}</span>
                          <span>on {formatReviewDate(review.created_at)}</span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <figure className={`relative grid min-h-64 max-w-2xl transition-all duration-700 ease-out lg:pt-8 ${activeIndex === displayIndex ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
              <div className="invisible col-start-1 row-start-1 grid" aria-hidden="true">
                {reviews.map((review, index) => {
                  const sizingQuote = review.message || "";

                  return (
                    <div key={review.id || `${review.name}-size-${index}`} className="col-start-1 row-start-1 flex flex-col justify-center">
                      <blockquote className="min-h-32 font-serif text-base italic leading-8 md:text-lg md:leading-9">
                        {sizingQuote && (
                          <>
                            <span className="font-sans text-4xl font-black not-italic leading-none">{sizingQuote.charAt(0)}</span>
                            {sizingQuote.slice(1)}
                          </>
                        )}
                      </blockquote>
                      {review.role && (
                        <div className="mt-7 text-sm font-bold uppercase tracking-[0.22em]">
                          {review.role}
                        </div>
                      )}
                      {reviewCount > 3 && <div className="mt-9 h-1.5" />}
                    </div>
                  );
                })}
              </div>

              <div className="relative col-start-1 row-start-1 flex flex-col justify-center">
                <span className="absolute -left-9 top-0 text-5xl font-black leading-none text-primary">“</span>
                <blockquote className="min-h-32 font-serif text-base italic leading-8 text-slate-100 md:text-lg md:leading-9">
                  {quote && (
                    <>
                      <span className="font-sans text-4xl font-black not-italic leading-none text-primary">{quote.charAt(0)}</span>
                      {quote.slice(1)}
                    </>
                  )}
                </blockquote>
                {activeReview.role && (
                  <figcaption className="mt-7 text-sm font-bold uppercase tracking-[0.22em] text-primary">
                    {activeReview.role}
                  </figcaption>
                )}
                {reviewCount > 3 && (
                  <div className="mt-9 flex flex-wrap gap-2" aria-label="Testimonial slides">
                    {reviews.map((review, index) => (
                      <button
                        key={review.id || `${review.name}-dot-${index}`}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-8 bg-primary" : "w-3 bg-white/20 hover:bg-primary/60"}`}
                        aria-label={`Show review from ${review.name || "client"}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </figure>
          </div>
        </div>
      </div>
    </div>
  );
}
