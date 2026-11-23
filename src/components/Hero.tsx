import React from 'react';
import { HeroCanvas } from './HeroCanvas';
import { ArrowDown, Sparkles, ChevronRight } from 'lucide-react';
import { OxysquadLink } from './OxysquadLink';

export const Hero: React.FC = () => {
  const scrollToCareers = () => {
    const el = document.getElementById('careers');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToVision = () => {
    const el = document.getElementById('vision');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToInvestors = () => {
    const el = document.getElementById('investors');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-12 sm:pb-16 overflow-hidden bg-[#101114]"
    >
      {/* Dynamic Bridge Horizon Canvas Background */}
      <HeroCanvas />

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#101114] via-transparent to-[#101114] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto">
        
        {/* Small Announcement Pill */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#202329]/80 border border-white/10 backdrop-blur-md mb-8 sm:mb-10 shadow-lg shadow-black/40">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
          </span>
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#E8E9EB]/90">
            AN UPCOMING HEALTH-TECH VENTURE
          </span>
          <span className="text-white/20 hidden sm:inline">•</span>
          <OxysquadLink className="text-[10px] text-[#747982] uppercase tracking-wider hidden sm:inline">
            Oxysquad Technologies
          </OxysquadLink>
        </div>

        {/* Brand Display Subtitle & Primary Brand Typography */}
        <div className="mb-4">
          <p className="font-display text-sm sm:text-base tracking-[0.35em] uppercase text-sky-400/90 font-medium">
            SETU247
          </p>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-[-0.04em] text-white leading-[1.08] max-w-5xl mx-auto mb-6">
          Something Meaningful <br className="hidden sm:inline" />
          <span className="text-gradient-silver">Is Coming.</span>
        </h1>

        {/* Alternative Supporting Headline */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-light text-[#E8E9EB]/80 max-w-3xl mx-auto mb-6 tracking-tight">
          The Future of Health Technology Is Taking Shape.
        </h2>

        {/* Supporting Copy */}
        <p className="text-sm sm:text-base md:text-lg text-[#747982] max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed">
          We're building towards a new chapter in health technology. A thoughtful vision, a bold ambition and a journey designed to make a meaningful difference.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          {/* Main CTA */}
          <button
            onClick={scrollToCareers}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide text-[#101114] bg-white hover:bg-[#F7F7F5] transition-all duration-300 shadow-xl shadow-white/5 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>Be Part of the Journey</span>
          </button>

          {/* Secondary CTA */}
          <button
            onClick={scrollToCareers}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide text-[#E8E9EB] bg-[#202329]/90 border border-white/10 hover:border-sky-400/50 hover:bg-[#202329] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <span>Explore Opportunities</span>
            <ChevronRight className="w-4 h-4 text-sky-400" />
          </button>
        </div>

        {/* Discreet Investor Quick Link */}
        <div className="mt-8">
          <button
            onClick={scrollToInvestors}
            className="text-xs tracking-wider text-[#747982] hover:text-sky-400 transition-colors inline-flex items-center gap-1.5 focus:outline-none"
          >
            <span>Representing an investment institution or fund?</span>
            <span className="underline underline-offset-4 decoration-sky-400/40 hover:decoration-sky-400">
              Explore Investor Relations
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Scroll Indicator & Relationship Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5 text-xs text-[#747982]">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400/80" />
            <span>
              Setu247 — An upcoming venture by{' '}
              <OxysquadLink className="text-[#E8E9EB]">
                OXYSQUAD TECHNOLOGIES PVT LTD
              </OxysquadLink>
            </span>
          </div>
          
          <button
            onClick={scrollToVision}
            className="inline-flex items-center gap-2 text-[#747982] hover:text-[#E8E9EB] transition-colors focus:outline-none"
            aria-label="Scroll to vision section"
          >
            <span className="tracking-widest uppercase text-[10px]">Scroll to discover</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce text-sky-400/70" />
          </button>
        </div>
      </div>
    </section>
  );
};
