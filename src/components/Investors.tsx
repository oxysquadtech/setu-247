import React, { useState, useRef } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Send, 
  ShieldCheck,
  Lock,
  ArrowRight,
  UploadCloud,
  FileText,
  X
} from 'lucide-react';
import { 
  InvestorEnquiryData, 
  submitInvestorEnquiry,
  validateProposalFile
} from '../services/formService';
import { siteConfig } from '../config/siteConfig';

export const Investors: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState<InvestorEnquiryData>({
    fullName: '',
    organisation: '',
    workEmail: '',
    phone: '',
    investorType: '',
    investmentAmount: '',
    message: '',
    proposalFile: null,
    honeypot: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success?: boolean;
    message?: string;
    referenceId?: string;
  } | null>(null);

  const investorTypes = [
    'Angel Investor',
    'Venture Capital',
    'Private Investment Firm',
    'Strategic Investor',
    'Institutional Investor',
    'Other',
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateProposalFile(file);
    if (!validation.valid) {
      setFormErrors(prev => ({ ...prev, proposal: validation.error || 'Invalid file' }));
      return;
    }

    setFormData(prev => ({ ...prev, proposalFile: file }));
    setFormErrors(prev => {
      const next = { ...prev };
      delete next.proposal;
      return next;
    });
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, proposalFile: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) errors.fullName = 'Please enter your name.';
    if (!formData.organisation.trim()) errors.organisation = 'Please enter your fund or organisation.';
    if (!formData.workEmail.trim()) {
      errors.workEmail = 'Please enter your professional work email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail)) {
      errors.workEmail = 'Please enter a valid work email address.';
    }
    if (!formData.investorType.trim()) errors.investorType = 'Please select an investor classification.';
    if (!formData.message.trim()) errors.message = 'Please provide brief details on your interest or focus area.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitResult(null);

    try {
      const result = await submitInvestorEnquiry(formData);
      setSubmitResult(result);

      if (result.success) {
        setFormData({
          fullName: '',
          organisation: '',
          workEmail: '',
          phone: '',
          investorType: '',
          investmentAmount: '',
          message: '',
          proposalFile: null,
          honeypot: '',
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch {
      setSubmitResult({
        success: false,
        message: `An unexpected issue occurred. You may reach out directly to ${siteConfig.emails.investors}.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section 
      id="investors" 
      className="relative py-28 sm:py-36 bg-[#101114] text-[#E8E9EB] border-t border-white/5 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-sky-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest uppercase text-sky-400 mb-6">
            <Building2 className="w-3.5 h-3.5" />
            <span>DISCREET & CONFIDENTIAL DIALOGUE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.03em] text-white leading-[1.1] mb-6">
            Interested in <br />
            <span className="text-gradient-silver">What’s Next?</span>
          </h2>

          <div className="space-y-4 text-base sm:text-lg text-[#747982] leading-relaxed max-w-2xl mx-auto">
            <p>
              We believe ambitious ideas grow stronger when the right people come together.
            </p>
            <p className="text-[#E8E9EB]/90">
              If you're an investor, strategic partner or institution interested in learning more about the upcoming Setu247 venture, we'd welcome a confidential conversation.
            </p>
          </div>
        </div>

        {/* Investor Enquiry Form Container */}
        <div className="max-w-2xl mx-auto">
          <div className="p-6 sm:p-10 rounded-3xl bg-[#202329]/80 border border-white/10 shadow-2xl backdrop-blur-xl">
            
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Connect With Our Team
                </h3>
                <p className="text-xs text-[#747982] mt-0.5">
                  Direct inquiry for investment firms, partners and family offices.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#747982]">
                <Lock className="w-3.5 h-3.5 text-sky-400" />
                <span>Confidential</span>
              </div>
            </div>

            {/* Submission Status Message */}
            {submitResult && (
              <div 
                className={`mb-8 p-6 rounded-2xl border transition-all ${
                  submitResult.success
                    ? 'bg-sky-500/10 border-sky-400/40 text-[#E8E9EB]'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                }`}
                role="status"
              >
                <div className="flex items-start gap-4">
                  {submitResult.success ? (
                    <CheckCircle2 className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-2">
                    <p className="font-semibold text-white text-base">
                      {submitResult.success ? 'Enquiry Transmitted' : 'Submission Alert'}
                    </p>
                    <p className="text-sm leading-relaxed text-[#E8E9EB]/90">
                      {submitResult.message}
                    </p>
                    {submitResult.referenceId && (
                      <p className="text-xs font-mono text-sky-400 pt-1">
                        Reference Code: {submitResult.referenceId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              
              {/* Anti-spam honeypot */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleInputChange}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              {/* Full Name & Organisation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="inv-fullName" className="block text-xs font-semibold uppercase tracking-wider text-[#E8E9EB]/90 mb-2">
                    Full Name <span className="text-sky-400">*</span>
                  </label>
                  <input
                    id="inv-fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Vikram Singhania"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-[#747982] focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm transition-colors ${
                      formErrors.fullName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="text-xs text-rose-400 mt-1.5">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="inv-organisation" className="block text-xs font-semibold uppercase tracking-wider text-[#E8E9EB]/90 mb-2">
                    Organisation / Fund <span className="text-sky-400">*</span>
                  </label>
                  <input
                    id="inv-organisation"
                    type="text"
                    name="organisation"
                    value={formData.organisation}
                    onChange={handleInputChange}
                    placeholder="e.g. Apex Health Ventures"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-[#747982] focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm transition-colors ${
                      formErrors.organisation ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                    }`}
                  />
                  {formErrors.organisation && (
                    <p className="text-xs text-rose-400 mt-1.5">{formErrors.organisation}</p>
                  )}
                </div>
              </div>

              {/* Work Email & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="inv-email" className="block text-xs font-semibold uppercase tracking-wider text-[#E8E9EB]/90 mb-2">
                    Work Email <span className="text-sky-400">*</span>
                  </label>
                  <input
                    id="inv-email"
                    type="email"
                    name="workEmail"
                    value={formData.workEmail}
                    onChange={handleInputChange}
                    placeholder="partner@fund.com"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-[#747982] focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm transition-colors ${
                      formErrors.workEmail ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                    }`}
                  />
                  {formErrors.workEmail && (
                    <p className="text-xs text-rose-400 mt-1.5">{formErrors.workEmail}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="inv-phone" className="block text-xs font-semibold uppercase tracking-wider text-[#E8E9EB]/90 mb-2">
                    Phone Number <span className="text-[#747982] lowercase">(optional)</span>
                  </label>
                  <input
                    id="inv-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#747982] focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
                  />
                </div>
              </div>

              {/* Row: Investor Type & Investment Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="inv-type" className="block text-xs font-semibold uppercase tracking-wider text-[#E8E9EB]/90 mb-2">
                    Investor Type <span className="text-sky-400">*</span>
                  </label>
                  <select
                    id="inv-type"
                    name="investorType"
                    value={formData.investorType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl bg-[#1a1c22] border text-white focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm transition-colors ${
                      formErrors.investorType ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                    }`}
                  >
                    <option value="" disabled className="text-gray-500">
                      Select your investment category...
                    </option>
                    {investorTypes.map(t => (
                      <option key={t} value={t} className="bg-[#202329] text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                  {formErrors.investorType && (
                    <p className="text-xs text-rose-400 mt-1.5">{formErrors.investorType}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="inv-investmentAmount" className="block text-xs font-semibold uppercase tracking-wider text-[#E8E9EB]/90 mb-2">
                    Investment Details / Range <span className="text-[#747982] lowercase">(optional)</span>
                  </label>
                  <input
                    id="inv-investmentAmount"
                    type="text"
                    name="investmentAmount"
                    value={formData.investmentAmount || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. ₹50L - ₹2 Cr, $100K - $500K"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#747982] focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
                  />
                </div>
              </div>

              {/* Proposal / Pitch Deck Upload (Document Attachment) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#E8E9EB]/90 mb-2">
                  Attach Business Proposal / Pitch Deck <span className="text-[#747982] font-normal lowercase">(optional, up to 25MB)</span>
                </label>

                {!formData.proposalFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all hover:border-sky-400/50 hover:bg-white/[0.02] ${
                      formErrors.proposal ? 'border-rose-500 bg-rose-500/5' : 'border-white/15'
                    }`}
                  >
                    <UploadCloud className="w-8 h-8 text-sky-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-white mb-1">
                      Click to attach pitch deck, one-pager, or proposal
                    </p>
                    <p className="text-xs text-[#747982]">
                      Accepts PDF, PPT, PPTX, DOC, DOCX up to 25MB. Strictly confidential.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-sky-400/30">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="w-6 h-6 text-sky-400 shrink-0" />
                      <div className="truncate">
                        <p className="text-sm font-medium text-white truncate">
                          {formData.proposalFile.name}
                        </p>
                        <p className="text-xs text-[#747982]">
                          {(formData.proposalFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1.5 text-[#747982] hover:text-rose-400 rounded-lg hover:bg-white/5 transition-colors"
                      aria-label="Remove attached document"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {formErrors.proposal && (
                  <p className="text-xs text-rose-400 mt-1.5">{formErrors.proposal}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="inv-message" className="block text-xs font-semibold uppercase tracking-wider text-[#E8E9EB]/90 mb-2">
                  Investment Interest / Message <span className="text-sky-400">*</span>
                </label>
                <textarea
                  id="inv-message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Share a brief overview of your fund thesis or specific interest in this dialogue..."
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-[#747982] focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm transition-colors resize-none ${
                    formErrors.message ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                  }`}
                />
                {formErrors.message && (
                  <p className="text-xs text-rose-400 mt-1.5">{formErrors.message}</p>
                )}
              </div>

              {/* Confidentiality Commitment */}
              <div className="flex items-center gap-2 pt-1 text-xs text-[#747982]">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>All discussions remain strictly confidential and privileged.</span>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-semibold tracking-wide uppercase text-[#101114] bg-white hover:bg-[#F7F7F5] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl shadow-white/5 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                      <span>Sending Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Investor Enquiry</span>
                      <Send className="w-4 h-4 text-sky-600" />
                    </>
                  )}
                </button>
              </div>

            </form>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#747982]">
              <span>Direct investor relations desk (Click to email):</span>
              <a
                href={`mailto:${siteConfig.emails.investors}?subject=Investor%20%2F%20Strategic%20Enquiry%20-%20Setu247&body=Hi%20Setu247%20Team%2C%0A%0AWe%20are%20interested%20in%20initiating%20a%20confidential%20dialogue%20regarding%20the%20Setu247%20health-tech%20venture.%0A%0AName%3A%20%0AFund%20%2F%20Organisation%3A%20%0AInvestor%20Type%3A%20%0A%0ABest%20regards%2C`}
                className="group/mail inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 font-mono transition-all border border-sky-400/20 hover:border-sky-400/40"
                title="Click to open your mail application"
              >
                <span>{siteConfig.emails.investors}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/mail:translate-x-0.5" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
