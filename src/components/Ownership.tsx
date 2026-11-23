import React from 'react';
import { Shield, Sparkles, Building, ExternalLink } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { OxysquadLink } from './OxysquadLink';

export const Ownership: React.FC = () => {
  return (
    <section className="relative py-28 sm:py-36 bg-[#14161B] text-[#E8E9EB] border-t border-white/5 overflow-hidden">
      {/* Structural grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="ownership-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#FFFFFF" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#ownership-grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-sky-400 mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>Corporate Foundation</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-white leading-tight mb-6">
            Backed by a <br />
            <span className="text-gradient-silver">Technology-Driven Foundation.</span>
          </h2>

          <div className="space-y-4 text-base sm:text-lg text-[#747982] leading-relaxed">
            <p>
              Setu247 is an upcoming health-tech venture by{' '}
              <OxysquadLink className="text-white font-medium">
                OXYSQUAD TECHNOLOGIES PVT LTD
              </OxysquadLink>
              .
            </p>
            <p className="text-[#E8E9EB]/90">
              With an ambition to explore meaningful opportunities at the intersection of technology and healthcare, Setu247 represents a new chapter in our journey.
            </p>
          </div>
        </div>

        {/* Corporate Relationship Display Card */}
        <div className="max-w-4xl p-8 sm:p-12 rounded-3xl bg-[#202329]/60 border border-white/10 backdrop-blur-xl relative overflow-hidden">
          
          {/* Subtle accent light */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Visual Typography Hierarchy */}
            <div className="md:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono tracking-widest text-[#747982] uppercase">
                Enterprise Relationship
              </span>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                    SETU
                  </span>
                  <span className="text-3xl sm:text-4xl font-light font-display text-sky-400">
                    247
                  </span>
                </div>
                
                <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#747982] font-semibold mt-2">
                  An upcoming health-tech venture by
                </p>
                
                <p className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                  <OxysquadLink className="text-white">
                    OXYSQUAD TECHNOLOGIES PVT LTD
                  </OxysquadLink>
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#747982] leading-relaxed pt-2">
                Operating under unified governance, long-term technical vision and strict privacy-first architecture.
              </p>
            </div>

            {/* Right Column: Key Attributes & Future-Proof Details */}
            <div className="md:col-span-5 flex flex-col space-y-3 pt-6 md:pt-0 md:border-l md:border-white/10 md:pl-8">
              
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Building className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Parent Entity
                  </span>
                </div>
                <p className="text-xs text-[#E8E9EB]/80 font-mono">
                  <OxysquadLink className="text-[#E8E9EB]/80">
                    OXYSQUAD TECHNOLOGIES PVT LTD
                  </OxysquadLink>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Strategic Focus
                  </span>
                </div>
                <p className="text-xs text-[#E8E9EB]/80">
                  Health-Technology Innovations
                </p>
              </div>

              {siteConfig.parentCompanyWebsite && (
                <a
                  href={siteConfig.parentCompanyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-sky-400 hover:text-sky-300 pt-1"
                >
                  <span>Visit Parent Company</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
