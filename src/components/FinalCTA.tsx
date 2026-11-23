import React from 'react';
import { ArrowUpRight, Sparkles, Building2 } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  const scrollToCareers = () => {
    const el = document.getElementById('careers');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToInvestors = () => {
    const el = document.getElementById('investors');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-28 sm:py-36 bg-[#101114] text-[#E8E9EB] border-t border-white/10 overflow-hidden">
      {/* Background Graphic Horizon / Bridge Lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-sky-500/10 blur-[160px] rounded-full" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Subtle Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest uppercase text-sky-400 mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>JOIN THE CONVERGENCE</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.03em] text-white leading-[1.1] mb-6">
          The Next Chapter Starts <br />
          <span className="text-gradient-silver">With the Right People.</span>
        </h2>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg md:text-xl text-[#747982] max-w-2xl mx-auto mb-12 leading-relaxed">
          Whether you are a talented individual looking to contribute or an investor interested in exploring possibilities, we'd love to hear from you.
        </p>

        {/* Two CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={scrollToCareers}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-semibold tracking-wide text-[#101114] bg-white hover:bg-[#F7F7F5] transition-all duration-300 shadow-xl shadow-white/5 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <span>Explore Careers</span>
            <ArrowUpRight className="w-4 h-4 text-sky-600" />
          </button>

          <button
            onClick={scrollToInvestors}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-semibold tracking-wide text-[#E8E9EB] bg-[#202329]/90 border border-white/15 hover:border-sky-400/50 hover:bg-[#202329] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <Building2 className="w-4 h-4 text-sky-400" />
            <span>Investor Enquiry</span>
          </button>
        </div>

        {/* Bridge Horizon Silhouette */}
        <div className="mt-20 pt-8 border-t border-white/5 flex justify-center">
          <svg viewBox="0 0 320 40" fill="none" className="w-64 opacity-30">
            <path d="M 10 35 C 50 10 110 5 160 5 C 210 5 270 10 310 35" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
            <circle cx="160" cy="5" r="3" fill="#38BDF8" />
          </svg>
        </div>

      </div>
    </section>
  );
};
