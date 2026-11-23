import React from 'react';
import { Compass, Sparkles, Layers } from 'lucide-react';

export const Vision: React.FC = () => {
  return (
    <section 
      id="vision" 
      className="relative py-28 sm:py-36 bg-[#F7F7F5] text-[#101114] transition-colors duration-500 overflow-hidden"
    >
      {/* Decorative Editorial Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="vision-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#101114" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#vision-grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Eyebrow Tag */}
        <div className="flex items-center gap-3 mb-8">
          <span className="h-px w-10 bg-[#101114]/30" />
          <span className="font-display text-xs uppercase tracking-[0.25em] text-[#747982] font-semibold">
            Brand Vision & Perspective
          </span>
        </div>

        {/* Section Heading & Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Main Headline Column */}
          <div className="lg:col-span-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.03em] text-[#101114] leading-[1.08] mb-8">
              Beyond Today. <br />
              <span className="text-[#747982] font-medium">Towards What’s Next.</span>
            </h2>

            {/* Abstract Bridge Architectural SVG Infographic */}
            <div className="relative p-8 rounded-2xl bg-white border border-[#E8E9EB] shadow-sm max-w-md hidden sm:block">
              <div className="flex items-center justify-between mb-6 border-b border-[#E8E9EB] pb-4">
                <span className="font-display text-[11px] font-semibold tracking-widest text-[#747982] uppercase">
                  Concept / Structural Bridge
                </span>
                <span className="text-[10px] bg-[#E8E9EB] px-2 py-0.5 rounded text-[#202329] font-mono">
                  Fig. 01 — Convergence
                </span>
              </div>
              
              <svg viewBox="0 0 280 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                {/* Baseline Axis */}
                <line x1="20" y1="70" x2="260" y2="70" stroke="#E8E9EB" strokeWidth="2" strokeDasharray="3 3" />
                
                {/* Arch Progression */}
                <path d="M 30 70 C 30 20 80 15 140 15 C 200 15 250 20 250 70" stroke="#101114" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 50 70 C 80 40 200 40 230 70" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
                
                {/* Nexus Points */}
                <circle cx="140" cy="15" r="4" fill="#0284C7" />
                <line x1="140" y1="15" x2="140" y2="70" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="2 2" />
                
                {/* Anchor Indicators */}
                <circle cx="30" cy="70" r="3" fill="#101114" />
                <circle cx="250" cy="70" r="3" fill="#101114" />
              </svg>

              <div className="flex justify-between items-center text-[11px] text-[#747982] mt-4 pt-3 border-t border-[#E8E9EB]/60">
                <span>Technological Foundation</span>
                <span className="font-semibold text-sky-700">Healthcare Frontier</span>
              </div>
            </div>
          </div>

          {/* Editorial Copy Column */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
            <div className="space-y-6 text-lg sm:text-xl text-[#202329] leading-relaxed font-normal">
              <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:text-[#101114] first-letter:mr-3 first-letter:float-left">
                Setu247 is an upcoming health-tech venture driven by a simple ambition: to contribute to the next chapter of technological progress in healthcare.
              </p>
              <p className="text-[#4B5563] text-base sm:text-lg">
                We believe meaningful progress begins with bold thinking, thoughtful innovation and the right people coming together.
              </p>
              <p className="text-xl sm:text-2xl font-semibold text-[#101114] tracking-tight border-l-2 border-sky-600 pl-4 py-1 italic">
                “Our journey is just beginning.”
              </p>
            </div>

            {/* Thoughtful Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#E8E9EB]">
              <div className="p-4 rounded-xl bg-white/70 border border-[#E8E9EB]">
                <Compass className="w-5 h-5 text-sky-600 mb-2" />
                <h4 className="text-sm font-bold text-[#101114] mb-1">Clear Purpose</h4>
                <p className="text-xs text-[#747982] leading-snug">Anchored in long-term human value.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/70 border border-[#E8E9EB]">
                <Layers className="w-5 h-5 text-sky-600 mb-2" />
                <h4 className="text-sm font-bold text-[#101114] mb-1">High Standards</h4>
                <p className="text-xs text-[#747982] leading-snug">Engineering with rigor and clarity.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/70 border border-[#E8E9EB]">
                <Sparkles className="w-5 h-5 text-sky-600 mb-2" />
                <h4 className="text-sm font-bold text-[#101114] mb-1">Open Curiosity</h4>
                <p className="text-xs text-[#747982] leading-snug">Embracing what lies over the horizon.</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
