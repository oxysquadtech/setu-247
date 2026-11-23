import React, { useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { OxysquadLink } from './OxysquadLink';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
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
        aria-labelledby="terms-modal-title"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            <h3 id="terms-modal-title" className="text-lg font-bold text-white tracking-tight">
              Terms &amp; Conditions
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#747982] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close terms modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-xs sm:text-sm text-[#E8E9EB]/80 leading-relaxed">
          <p>
            Welcome to the pre-launch preview website for <strong>Setu247</strong>, an upcoming health-tech venture by{' '}
            <OxysquadLink className="text-white font-semibold">
              OXYSQUAD TECHNOLOGIES PVT LTD
            </OxysquadLink>
            .
          </p>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1.5">
              1. Brand &amp; Pre-Launch Notice
            </h4>
            <p>
              This website serves exclusively to introduce brand intent, receive expressions of interest from potential candidates, and initiate confidential discussions with strategic investment partners. This site does not constitute an offer, sale, or distribution of healthcare products, clinical devices, or financial instruments.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1.5">
              2. Intellectual Property &amp; Confidentiality
            </h4>
            <p>
              All marks, logos, visual assets, text, design systems, and code displayed on this site are the exclusive property of{' '}
              <OxysquadLink className="text-white">
                OXYSQUAD TECHNOLOGIES PVT LTD
              </OxysquadLink>{' '}
              and Setu247. All proprietary concepts, methods, and strategic developments remain confidential.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1.5">
              3. Communications &amp; Submissions
            </h4>
            <p>
              By transmitting information via our forms, you confirm that the information provided is accurate and that you possess all legal rights to submit any accompanying resumes or documents. We reserve the right to review submissions at our sole discretion.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1.5">
              4. Disclaimer
            </h4>
            <p>
              Content is provided on an &ldquo;as is&rdquo; basis for preliminary informational purposes. Any forward-looking brand statements indicate conceptual direction and do not represent formal guarantees or commercial warranties.
            </p>
          </div>

          <p className="text-[11px] text-[#747982] pt-4 border-t border-white/10">
            For inquiries regarding terms, contact: <a href={`mailto:${siteConfig.emails.contact}?subject=Terms%20Inquiry%20-%20Setu247`} className="font-mono text-sky-400 hover:text-sky-300 underline underline-offset-2" title="Click to email">{siteConfig.emails.contact}</a>
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/15 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
