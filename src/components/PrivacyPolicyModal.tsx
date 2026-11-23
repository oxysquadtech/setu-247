import React, { useEffect } from 'react';
import { X, ShieldCheck, Lock } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { OxysquadLink } from './OxysquadLink';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
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
        className="relative bg-[#1A1C22] border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[85vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="privacy-modal-title"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <h3 id="privacy-modal-title" className="text-lg font-bold text-white tracking-tight">
              Privacy Notice & Data Protection
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#747982] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close privacy notice"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-xs sm:text-sm text-[#E8E9EB]/80 leading-relaxed">
          <p>
            This Privacy Notice governs information collected by <strong>Setu247</strong>, an upcoming health-tech venture by{' '}
            <OxysquadLink className="text-white font-semibold">
              OXYSQUAD TECHNOLOGIES PVT LTD
            </OxysquadLink>{' '}
            (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Company&rdquo;).
          </p>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1.5 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-sky-400" />
              1. Talent Application &amp; Recruitment Data
            </h4>
            <p>
              When you submit your resume, portfolio, or career application via this website, we collect your name, email, phone number, location, professional domain, submitted documents, and introductory message. This information is processed exclusively for evaluating current and prospective talent opportunities within Setu247 and{' '}
              <OxysquadLink className="text-white">
                Oxysquad Technologies Pvt Ltd
              </OxysquadLink>
              .
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1.5">
              2. Investor &amp; Strategic Communications
            </h4>
            <p>
              Information submitted via the Investor Relations desk (including fund names, work emails, and strategic interest) is treated with strict professional discretion and privileged confidentiality. We do not disclose inquiry details publicly.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1.5">
              3. Non-Disclosure &amp; Zero Third-Party Sale
            </h4>
            <p>
              We do not sell, rent, or trade your personal information to third parties or marketing brokers. Your documents and contact information are accessible only to authorized personnel directly involved in evaluation.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1.5">
              4. Security &amp; Storage
            </h4>
            <p>
              All submissions are stored using industry-standard access controls and secure transmission protocols. Uploaded documents are kept confidential and protected from unauthorized access.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1.5">
              5. Candidate &amp; User Inquiries
            </h4>
            <p>
              You may request review, modification, or complete deletion of your submitted application data at any time by contacting us directly at <span className="font-mono text-sky-400">{siteConfig.emails.contact}</span>.
            </p>
          </div>

          <p className="text-[11px] text-[#747982] pt-4 border-t border-white/10">
            Last Updated: 2026. Setu247 by{' '}
            <OxysquadLink className="text-[#747982] hover:text-sky-300">
              OXYSQUAD TECHNOLOGIES PVT LTD
            </OxysquadLink>
            . All rights reserved.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/15 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Acknowledge &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
