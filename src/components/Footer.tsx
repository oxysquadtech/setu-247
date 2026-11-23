import React from 'react';
import { BrandLogo } from './BrandLogo';
import { siteConfig } from '../config/siteConfig';
import { Mail, ArrowUp, ArrowUpRight } from 'lucide-react';
import { OxysquadLink } from './OxysquadLink';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenTerms }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Vision', href: '#vision' },
    { label: 'Careers', href: '#careers' },
    { label: 'Investors', href: '#investors' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="relative bg-[#0D0E10] text-[#747982] pt-20 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand & Venture Relationship */}
          <div className="md:col-span-6 space-y-4">
            <BrandLogo symbolSize={36} showSubtitle={false} />
            <p className="text-sm text-[#E8E9EB]/90 font-medium">
              An upcoming health-tech venture by{' '}
              <OxysquadLink className="text-white">
                OXYSQUAD TECHNOLOGIES PVT LTD
              </OxysquadLink>
              .
            </p>
            <p className="text-xs text-[#747982] max-w-md leading-relaxed">
              Committed to exploring the next frontier of technological progress in healthcare through thoughtful design, disciplined engineering and visionary talent.
            </p>

            {/* Direct Contact Email */}
            <div className="pt-2">
              <a
                href={`mailto:${siteConfig.emails.contact}?subject=General%20Enquiry%20-%20Setu247`}
                className="group/mail inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-sky-500/10 border border-white/10 hover:border-sky-400/40 text-xs text-[#E8E9EB] hover:text-white transition-all shadow-sm"
                title="Click to open your mail application"
              >
                <Mail className="w-4 h-4 text-sky-400 group-hover/mail:scale-110 transition-transform" />
                <span className="text-[#747982] group-hover/mail:text-[#E8E9EB]">General Enquiries:</span>
                <span className="font-mono text-sky-400 group-hover/mail:underline underline-offset-2">
                  {siteConfig.emails.contact}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-sky-400/70 group-hover/mail:translate-x-0.5 group-hover/mail:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8E9EB]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Governance & Privacy */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8E9EB]">
              Governance & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-white transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-white transition-colors text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <span className="text-[#747982]/60">ISO & Compliance (Pre-launch)</span>
              </li>
            </ul>

            <div className="pt-4">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 text-xs text-[#747982] hover:text-sky-400 transition-colors"
                aria-label="Back to top"
              >
                <span>Back to top</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Footer Sub-Bar: Copyright & Meaningful Taking Shape Line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#747982]">
          <div>
            <p>{siteConfig.copyright}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            <span className="font-display tracking-wider text-[#E8E9EB]/75 italic">
              {siteConfig.footerSubline}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
