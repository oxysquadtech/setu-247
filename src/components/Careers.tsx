import React, { useState, useRef } from 'react';
import { 
  Briefcase, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  X, 
  Loader2, 
  Send,
  Lock,
  ArrowRight
} from 'lucide-react';
import { 
  CareerApplicationData, 
  submitCareerApplication, 
  validateResumeFile 
} from '../services/formService';
import { siteConfig } from '../config/siteConfig';
import { OxysquadLink } from './OxysquadLink';

interface CareersProps {
  onOpenPrivacy: () => void;
}

export const Careers: React.FC<CareersProps> = ({ onOpenPrivacy }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<CareerApplicationData>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    domain: '',
    linkedIn: '',
    portfolio: '',
    resumeFile: null,
    message: '',
    consent: false,
    honeypot: '',
  });

  const [customDomain, setCustomDomain] = useState('');
  const isOtherDomain = formData.domain === 'Other / Multidisciplinary Role';

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success?: boolean;
    message?: string;
    referenceId?: string;
  } | null>(null);

  const roleGroups = [
    {
      department: 'Technology Team',
      roles: [
        'Lead Software Architect',
        'Full Stack Developer',
        'Mobile App Developer (iOS / Android)',
        'UI / UX Designer',
        'QA / Tester',
        'DevOps Engineer',
        'Data Science & AI Engineer',
      ],
    },
    {
      department: 'Healthcare Team',
      roles: [
        'Medical Director / Consultant',
        'Clinical Operations Manager',
        'Health Records Manager',
        'Teleconsultation Support',
        'Nurse / Patient Care Coordinator',
        'Clinical Specialist (Doctor / Radiologist / Pathologist)',
      ],
    },
    {
      department: 'Operations Team',
      roles: [
        'Operations Manager',
        'Product Manager',
        'Customer Support Lead',
        'Patient Relations Executive',
        'Service Delivery Executive',
        'Data Management Executive',
      ],
    },
    {
      department: 'Sales & Marketing Team',
      roles: [
        'Head of Sales',
        'Business Development Manager',
        'Digital Marketing Manager',
        'Content & Social Media Executive',
        'Partnerships Manager',
      ],
    },
    {
      department: 'Finance & Accounts Team',
      roles: [
        'Finance Manager',
        'Accountant',
        'Billing Executive',
        'IT & Compliance Executive',
      ],
    },
    {
      department: 'HR & Admin Team',
      roles: [
        'HR Manager',
        'Recruitment Executive',
        'Admin Executive',
        'Office Assistant',
      ],
    },
    {
      department: 'Executive Leadership',
      roles: [
        'Chief Technology Officer (CTO)',
        'Chief Operating Officer (COO)',
        'Chief Financial Officer (CFO)',
        'Chief Medical Officer (CMO)',
        'Chief People Officer (CHRO)',
        'Chief Business Officer (CBO)',
      ],
    },
    {
      department: 'Other Roles',
      roles: [
        'Other / Multidisciplinary Role',
      ],
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

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

    const validation = validateResumeFile(file);
    if (!validation.valid) {
      setFormErrors(prev => ({ ...prev, resume: validation.error || 'Invalid file' }));
      return;
    }

    setFormData(prev => ({ ...prev, resumeFile: file }));
    setFormErrors(prev => {
      const next = { ...prev };
      delete next.resume;
      return next;
    });
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, resumeFile: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) errors.fullName = 'Please enter your full name.';
    if (!formData.email.trim()) {
      errors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!formData.phone.trim()) errors.phone = 'Please enter your phone number.';
    if (!formData.location.trim()) errors.location = 'Please enter your current location.';
    if (!formData.domain.trim()) {
      errors.domain = 'Please select your area of interest.';
    } else if (isOtherDomain && !customDomain.trim()) {
      errors.customDomain = 'Please specify the position you are applying for.';
    }
    if (!formData.message.trim()) errors.message = 'Please provide a brief introduction or note.';
    if (!formData.consent) errors.consent = 'You must acknowledge the privacy notice to proceed.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitResult(null);

    try {
      const payload: CareerApplicationData = {
        ...formData,
        domain: isOtherDomain && customDomain.trim() ? `Other: ${customDomain.trim()}` : formData.domain,
      };

      const result = await submitCareerApplication(payload);
      setSubmitResult(result);

      if (result.success) {
        // Clear inputs
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          location: '',
          domain: '',
          linkedIn: '',
          portfolio: '',
          resumeFile: null,
          message: '',
          consent: false,
          honeypot: '',
        });
        setCustomDomain('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch {
      setSubmitResult({
        success: false,
        message: `An unexpected issue occurred. Please email your application directly to ${siteConfig.emails.careers}.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section 
      id="careers" 
      className="relative py-28 sm:py-36 bg-[#101114] text-[#E8E9EB] border-t border-white/10 overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest uppercase text-sky-400 mb-6">
            <Briefcase className="w-3.5 h-3.5" />
            <span>WE’RE OPEN TO MEETING GREAT TALENT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.03em] text-white leading-[1.1] mb-6">
            Don't Just Look for a Job. <br />
            <span className="text-gradient-silver">Help Build Something.</span>
          </h2>

          <div className="space-y-4 text-base sm:text-lg text-[#747982] leading-relaxed max-w-2xl mx-auto">
            <p>
              Setu247 is preparing for its next chapter, and we're looking for ambitious, curious and driven individuals who want to contribute to something meaningful in health technology.
            </p>
            <p className="text-[#E8E9EB]/90">
              If you have the zeal to build, the curiosity to learn and the determination to make an impact, we'd love to hear from you.
            </p>
          </div>
        </div>

        {/* Talent Application Card Container */}
        <div className="max-w-3xl mx-auto">
          <div className="p-6 sm:p-10 md:p-12 rounded-3xl bg-[#202329]/70 border border-white/10 shadow-2xl backdrop-blur-xl">
            
            {/* Form Title & Privacy Tag */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-white/10 gap-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Share Your Profile
                </h3>
                <p className="text-xs sm:text-sm text-[#747982] mt-0.5">
                  General expressions of interest across engineering, product, health tech & operations.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#747982]">
                <Lock className="w-3.5 h-3.5 text-sky-400" />
                <span>Strictly Confidential</span>
              </div>
            </div>

            {/* Submission State Banner */}
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
                      {submitResult.success ? 'Application Successfully Received' : 'Submission Note'}
                    </p>
                    <p className="text-sm leading-relaxed text-[#E8E9EB]/90">
                      {submitResult.message}
                    </p>
                    {submitResult.referenceId && (
                      <p className="text-xs font-mono text-sky-400 pt-1">
                        Application Reference: {submitResult.referenceId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Application Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              
              {/* Anti-Spam Honeypot (Hidden) */}
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

              {/* Row 1: Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="careers-fullName" className="block text-xs font-semibold uppercase tracking-wider text-[#E8E9EB]/90 mb-2">
                    Full Name <span className="text-sky-400">*</span>
                  </label>
                  <input
                    id="careers-fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Maya Sharma"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-[#747982] focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm transition-colors ${
                      formErrors.fullName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="text-xs text-rose-400 mt-1.5">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="careers-email" className="block text-xs font-semibold uppercase tracking-wider text-[#E8E9EB]/90 mb-2">
                    Email Address <span className="text-sky-400">*</span>
                  </label>
                  <input
                    id="careers-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="maya@example.com"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-[#747982] focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm transition-colors ${
                      formErrors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-rose-400 mt-1.5">{formErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Phone Number & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="careers-phone" className="block text-xs font-semibold uppercase tracking-wider text-[#E8E9EB]/90 mb-2">
                    Phone Number <span className="text-sky-400">*</span>
                  </label>
                  <input
                    id="careers-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-[#747982] focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm transition-colors ${
                      formErrors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="text-xs text-rose-400 mt-1.5">{formErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="careers-location" className="block text-xs font-semibold uppercase tracking-wider text-[#E8E9EB]/90 mb-2">
                    Current Location <span className="text-sky-400">*</span>
                  </label>
                  <input
                    id="careers-location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Bengaluru, India"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-[#747982] focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm transition-colors ${
                      formErrors.location ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                    }`}
                  />
                  {formErrors.location && (
                    <p className="text-xs text-rose-400 mt-1.5">{formErrors.location}</p>
                  )}
                </div>
              </div>

              {/* Row 3: Area of Interest / Domain */}
              <div>
                <label htmlFor="careers-domain" className="block text-xs font-semibold uppercase tracking-wider text-[#E8E9EB]/90 mb-2">
                  Area of Interest / Professional Domain <span className="text-sky-400">*</span>
                </label>
                <select
                  id="careers-domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl bg-[#1a1c22] border text-white focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm transition-colors ${
                    formErrors.domain ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                  }`}
                >
                  <option value="" disabled className="text-gray-500">
                    Select a position or professional domain...
                  </option>
                  {roleGroups.map(group => (
                    <optgroup key={group.department} label={`— ${group.department} —`} className="bg-[#14161b] text-sky-400 font-semibold py-1">
                      {group.roles.map(role => (
                        <option key={role} value={role} className="bg-[#202329] text-white font-normal pl-4">
                          {role}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {formErrors.domain && (
                  <p className="text-xs text-rose-400 mt-1.5">{formErrors.domain}</p>
                )}

                {/* Dynamic custom position text box when "Other / Multidisciplinary Role" is selected */}
                {isOtherDomain && (
                  <div className="mt-4 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
                    <label htmlFor="careers-customDomain" className="block text-xs font-semibold uppercase tracking-wider text-sky-400 mb-2">
                      Please Specify Your Position / Role <span className="text-sky-400">*</span>
                    </label>
                    <input
                      id="careers-customDomain"
                      type="text"
                      name="customDomain"
                      value={customDomain}
                      onChange={(e) => {
                        setCustomDomain(e.target.value);
                        if (formErrors.customDomain) {
                          setFormErrors(prev => {
                            const next = { ...prev };
                            delete next.customDomain;
                            return next;
                          });
                        }
                      }}
                      placeholder="e.g. Clinical Pharmacologist, Bio-informatics Specialist, Regulatory Affairs..."
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-[#747982] focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm transition-colors ${
                        formErrors.customDomain ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                      }`}
                      autoFocus
                    />
                    {formErrors.customDomain && (
                      <p className="text-xs text-rose-400 mt-1.5">{formErrors.customDomain}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Row 4: LinkedIn & Portfolio (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="careers-linkedin" className="block text-xs font-semibold uppercase tracking-wider text-[#E8E9EB]/90 mb-2">
                    LinkedIn Profile <span className="text-[#747982] lowercase">(optional)</span>
                  </label>
                  <input
                    id="careers-linkedin"
                    type="url"
                    name="linkedIn"
                    value={formData.linkedIn}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#747982] focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="careers-portfolio" className="block text-xs font-semibold uppercase tracking-wider text-[#E8E9EB]/90 mb-2">
                    Portfolio / Website / GitHub <span className="text-[#747982] lowercase">(optional)</span>
                  </label>
                  <input
                    id="careers-portfolio"
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#747982] focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
                  />
                </div>
              </div>

              {/* Row 5: Resume Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#E8E9EB]/90 mb-2">
                  Resume Upload <span className="text-[#747982] font-normal lowercase">(PDF preferred, up to 5MB)</span>
                </label>

                {!formData.resumeFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all hover:border-sky-400/50 hover:bg-white/[0.02] ${
                      formErrors.resume ? 'border-rose-500 bg-rose-500/5' : 'border-white/15'
                    }`}
                  >
                    <UploadCloud className="w-8 h-8 text-sky-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-white mb-1">
                      Click to browse or drop your resume here
                    </p>
                    <p className="text-xs text-[#747982]">
                      Accepts PDF, DOC, DOCX up to 5MB. Handled with confidentiality.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-sky-400/30">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="w-6 h-6 text-sky-400 shrink-0" />
                      <div className="truncate">
                        <p className="text-sm font-medium text-white truncate">
                          {formData.resumeFile.name}
                        </p>
                        <p className="text-xs text-[#747982]">
                          {(formData.resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1.5 text-[#747982] hover:text-rose-400 rounded-lg hover:bg-white/5 transition-colors"
                      aria-label="Remove selected resume"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {formErrors.resume && (
                  <p className="text-xs text-rose-400 mt-1.5">{formErrors.resume}</p>
                )}
              </div>

              {/* Row 6: Short Introduction */}
              <div>
                <label htmlFor="careers-message" className="block text-xs font-semibold uppercase tracking-wider text-[#E8E9EB]/90 mb-2">
                  Short Introduction / Message <span className="text-sky-400">*</span>
                </label>
                <textarea
                  id="careers-message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us what drives you, what you've built, and why health technology excites you..."
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-[#747982] focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm transition-colors resize-none ${
                    formErrors.message ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                  }`}
                />
                {formErrors.message && (
                  <p className="text-xs text-rose-400 mt-1.5">{formErrors.message}</p>
                )}
              </div>

              {/* Privacy Consent Checkbox */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-sky-500 focus:ring-sky-400"
                  />
                  <span className="text-xs text-[#747982] leading-relaxed">
                    I agree to allow Setu247 and{' '}
                    <OxysquadLink
                      className="text-[#E8E9EB]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      OXYSQUAD TECHNOLOGIES PVT LTD
                    </OxysquadLink>{' '}
                    to process my details for talent discovery and recruitment evaluation in accordance with the{' '}
                    <button
                      type="button"
                      onClick={onOpenPrivacy}
                      className="text-sky-400 underline underline-offset-2 hover:text-sky-300"
                    >
                      Privacy Notice
                    </button>. Submissions remain strictly private and will never be shared externally.
                  </span>
                </label>
                {formErrors.consent && (
                  <p className="text-xs text-rose-400 mt-1.5">{formErrors.consent}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold tracking-wide uppercase text-[#101114] bg-white hover:bg-[#F7F7F5] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl shadow-white/5 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                      <span>Transmitting Application...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <Send className="w-4 h-4 text-sky-600" />
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Direct Email Backup Notice */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#747982]">
              <span>Prefer to email directly? Click to open mailbox:</span>
              <a
                href={`mailto:${siteConfig.emails.careers}?subject=Application%20for%20Setu247%20-%20Talent%20Team&body=Hi%20Setu247%20Talent%20Team%2C%0A%0AI%20am%20interested%20in%20opportunities%20at%20Setu247.%0A%0AName%3A%20%0ALocation%3A%20%0ADomain%20%2F%20Role%3A%20%0ALinkedIn%20%2F%20Portfolio%3A%20%0A%0APlease%20find%20attached%20my%20resume.%0A%0ABest%20regards%2C`}
                className="group/mail inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 font-mono transition-all border border-sky-400/20 hover:border-sky-400/40"
                title="Click to open your mail application"
              >
                <span>{siteConfig.emails.careers}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/mail:translate-x-0.5" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
