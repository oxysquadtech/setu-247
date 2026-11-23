import React from 'react';
import { Eye, ShieldCheck, HeartHandshake } from 'lucide-react';

export const Principles: React.FC = () => {
  const principles = [
    {
      num: '01',
      title: 'THINK BOLDLY',
      quote: 'Question conventions. Imagine what could be possible.',
      description: 'Progress in healthcare and technology requires challenging inherited assumptions and having the conviction to envision better paradigms.',
      icon: Eye,
      accent: 'from-sky-500/20 to-transparent',
    },
    {
      num: '02',
      title: 'BUILD THOUGHTFULLY',
      quote: 'Bring clarity, discipline and purpose to every step.',
      description: 'Foundations matter. Lasting impact is not rushed; it is engineered with uncompromising discipline, architectural intent and meticulous care.',
      icon: ShieldCheck,
      accent: 'from-blue-500/20 to-transparent',
    },
    {
      num: '03',
      title: 'CREATE MEANINGFULLY',
      quote: 'Focus on progress that can make a difference.',
      description: 'Technology is only as valuable as the human reality it uplifts. We align our focus strictly with progress that produces authentic value.',
      icon: HeartHandshake,
      accent: 'from-indigo-500/20 to-transparent',
    },
  ];

  return (
    <section className="relative py-28 sm:py-36 bg-[#101114] text-[#E8E9EB] border-t border-white/5 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-sky-950/20 blur-[160px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-sky-400 mb-4">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>Guiding Principles</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-white leading-tight mb-6">
            Big Ambitions. <br />
            <span className="text-gradient-silver">Meaningful Possibilities.</span>
          </h2>

          <div className="space-y-4 text-base sm:text-lg text-[#747982] leading-relaxed">
            <p>
              Some ideas deserve more than an announcement. They deserve the right foundation, the right people and the right moment.
            </p>
            <p className="text-[#E8E9EB]/90">
              We're bringing those elements together. More will be revealed when the time is right.
            </p>
          </div>
        </div>

        {/* Three Abstract Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {principles.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className="group relative p-8 sm:p-10 rounded-2xl bg-[#202329]/50 border border-white/10 hover:border-sky-400/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/5 flex flex-col justify-between"
              >
                {/* Top Corner Glow on Hover */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${item.accent} rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div>
                  {/* Top Bar with Number and Icon */}
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                    <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white/30 group-hover:text-sky-400 transition-colors">
                      {item.num}
                    </span>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-sky-400/40 group-hover:bg-sky-400/10 transition-colors">
                      <Icon className="w-5 h-5 text-[#E8E9EB] group-hover:text-sky-400 transition-colors" />
                    </div>
                  </div>

                  {/* Principle Title */}
                  <h3 className="font-display text-lg sm:text-xl font-bold tracking-wider uppercase text-white mb-3">
                    {item.title}
                  </h3>

                  {/* Principle Core Quote */}
                  <p className="text-base sm:text-lg font-medium text-sky-300/90 tracking-tight leading-snug mb-4">
                    “{item.quote}”
                  </p>
                </div>

                {/* Subtext description */}
                <p className="text-xs sm:text-sm text-[#747982] leading-relaxed pt-4 border-t border-white/5">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Notice of Confidentiality & Integrity */}
        <div className="mt-14 p-5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#747982]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
            <span>These principles define our organizational culture and standard of engineering.</span>
          </div>
          <span className="font-display tracking-widest uppercase text-[11px] text-[#747982]/80">
            Setu247 Cultural Foundation
          </span>
        </div>

      </div>
    </section>
  );
};
