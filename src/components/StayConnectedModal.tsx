import React, { useEffect, useState } from 'react';
import { X, Sparkles, Briefcase, Building2, Mail, Copy, Check } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { OxysquadLink } from './OxysquadLink';

interface StayConnectedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StayConnectedModal: React.FC<StayConnectedModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(siteConfig.emails.contact);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScrollTo = (id: string) => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div 
        className="relative bg-[#1A1C22] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10"
        role="dialog"
        aria-labelledby="stay-connected-title"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h3 id="stay-connected-title" className="text-lg font-bold text-white tracking-tight">
              Stay Connected with Setu247
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#747982] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[#747982] mb-6 leading-relaxed">
          How would you like to engage with our upcoming health-tech venture? Choose the option that best matches your objective:
        </p>

        {/* Options */}
        <div className="space-y-3">
          {/* Career Path */}
          <button
            onClick={() => handleScrollTo('careers')}
            className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/40 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 group-hover:bg-sky-500/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-sky-300">
                  I Want to Build / Explore Careers
                </p>
                <p className="text-xs text-[#747982]">
                  Share your resume and profile for upcoming talent opportunities.
                </p>
              </div>
            </div>
          </button>

          {/* Investor Path */}
          <button
            onClick={() => handleScrollTo('investors')}
            className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/40 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-blue-300">
                  Investor &amp; Strategic Interest
                </p>
                <p className="text-xs text-[#747982]">
                  Connect confidentially regarding institutional or venture opportunities.
                </p>
              </div>
            </div>
          </button>

          {/* Direct Email Path */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2.5 rounded-xl bg-white/5 text-[#E8E9EB]">
                <Mail className="w-5 h-5" />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white uppercase tracking-wider">
                  Direct Inquiries Desk
                </p>
                <p className="text-xs font-mono text-sky-400 truncate">
                  {siteConfig.emails.contact}
                </p>
              </div>
            </div>
            <button
              onClick={handleCopyEmail}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors shrink-0 ml-2"
              title="Copy email to clipboard"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4 text-[#747982]" />
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-[#747982]">
            Setu247 by{' '}
            <OxysquadLink className="text-[#747982] hover:text-sky-300">
              OXYSQUAD TECHNOLOGIES PVT LTD
            </OxysquadLink>{' '}
            • All inquiries handled discreetly
          </p>
        </div>
      </div>
    </div>
  );
};
