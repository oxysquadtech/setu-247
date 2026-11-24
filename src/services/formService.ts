import { siteConfig } from '../config/siteConfig';

export interface CareerApplicationData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  domain: string;
  experience?: string;
  skills?: string;
  linkedIn?: string;
  portfolio?: string;
  resumeFile?: File | null;
  resumeFileName?: string;
  resumeFileSize?: number;
  resumeBase64?: string;
  message: string;
  consent: boolean;
  honeypot?: string;
}

export interface InvestorEnquiryData {
  fullName: string;
  organisation: string;
  workEmail: string;
  phone?: string;
  investorType: string;
  investmentAmount?: string;
  message: string;
  proposalFile?: File | null;
  proposalFileName?: string;
  proposalFileSize?: number;
  proposalBase64?: string;
  honeypot?: string;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  referenceId?: string;
  error?: string;
}

// Convert a File to Base64 safely for fallback transmission or offline logging
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Validate file constraints (PDF, DOC, DOCX up to 25MB)
export const validateResumeFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 25 * 1024 * 1024; // 25 MB
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const name = file.name.toLowerCase();
  
  const hasValidExt = allowedExtensions.some(ext => name.endsWith(ext));
  if (!hasValidExt) {
    return {
      valid: false,
      error: 'Please upload a PDF document (.pdf is preferred, .doc/.docx also accepted).'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds the 25MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB detected).`
    };
  }

  return { valid: true };
};

// Validate investor proposal/pitch deck files (PDF, DOC, DOCX, PPT, PPTX up to 25MB)
export const validateProposalFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 25 * 1024 * 1024;
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx'];
  const name = file.name.toLowerCase();

  const hasValidExt = allowedExtensions.some(ext => name.endsWith(ext));
  if (!hasValidExt) {
    return {
      valid: false,
      error: 'Please upload a pitch deck or proposal (.pdf, .pptx, .docx accepted).'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds the 25MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB detected).`
    };
  }

  return { valid: true };
};

/**
 * Submit Job Application
 * Submits directly to /api/careers (Backend Notification Gateway)
 * No email activation or OTP required.
 */
export const submitCareerApplication = async (data: CareerApplicationData): Promise<SubmissionResponse> => {
  // Anti-spam honeypot verification
  if (data.honeypot && data.honeypot.trim() !== '') {
    return { success: false, message: 'Automated submission detected.' };
  }

  if (!data.consent) {
    return { success: false, message: 'Please consent to the privacy policy to proceed.' };
  }

  const endpoint = siteConfig.formService.careersEndpoint || '/api/careers';
  const referenceId = `SETU-TALENT-${Date.now().toString(36).toUpperCase()}`;

  // Build FormData for multipart transmission
  const formData = new FormData();
  formData.append('referenceId', referenceId);
  formData.append('fullName', data.fullName);
  formData.append('email', data.email);
  formData.append('phone', data.phone);
  formData.append('location', data.location);
  formData.append('domain', data.domain);
  formData.append('experience', data.experience || '');
  formData.append('skills', data.skills || '');
  formData.append('linkedIn', data.linkedIn || '');
  formData.append('portfolio', data.portfolio || '');
  formData.append('message', data.message);
  formData.append('timestamp', new Date().toISOString());

  if (data.resumeFile) {
    formData.append('resume', data.resumeFile);
    formData.append('attachment', data.resumeFile);
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const result = await response.json();

    // Store in local backup queue for local visibility
    try {
      const key = 'setu247_talent_submissions';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.unshift({
        referenceId,
        timestamp: new Date().toISOString(),
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        location: data.location,
        domain: data.domain,
        experience: data.experience || '',
        skills: data.skills || '',
        resumeFileName: data.resumeFile?.name || '',
      });
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {
      // ignore localstorage errors
    }

    return {
      success: true,
      referenceId,
      message: result.message || 'Thank you for your interest in Setu247. Your application has been received. Our team will review it and reach out if there is a suitable opportunity.',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network error';
    console.error('[Application Submission Error]', err);

    // Save offline record in localStorage so applicant data is never lost
    try {
      const key = 'setu247_talent_offline_queue';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.unshift({
        referenceId,
        timestamp: new Date().toISOString(),
        data,
      });
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {
      // ignore
    }

    return {
      success: false,
      message: `Notice: Submission could not connect to server (${msg}). Alternatively, please email your resume directly to ${siteConfig.emails.careers}.`,
    };
  }
};

/**
 * Submit Investor Enquiry
 * Submits directly to /api/investors (Backend Notification Gateway)
 * No email activation or OTP required.
 */
export const submitInvestorEnquiry = async (data: InvestorEnquiryData): Promise<SubmissionResponse> => {
  if (data.honeypot && data.honeypot.trim() !== '') {
    return { success: false, message: 'Automated submission detected.' };
  }

  const endpoint = siteConfig.formService.investorEndpoint || '/api/investors';
  const referenceId = `SETU-INV-${Date.now().toString(36).toUpperCase()}`;

  const formData = new FormData();
  formData.append('referenceId', referenceId);
  formData.append('fullName', data.fullName);
  formData.append('organisation', data.organisation);
  formData.append('workEmail', data.workEmail);
  formData.append('phone', data.phone || '');
  formData.append('investorType', data.investorType);
  formData.append('investmentAmount', data.investmentAmount || '');
  formData.append('message', data.message);
  formData.append('timestamp', new Date().toISOString());

  if (data.proposalFile) {
    formData.append('proposal', data.proposalFile);
    formData.append('attachment', data.proposalFile);
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const result = await response.json();

    // Local audit storage
    try {
      const key = 'setu247_investor_submissions';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.unshift({
        referenceId,
        timestamp: new Date().toISOString(),
        fullName: data.fullName,
        organisation: data.organisation,
        workEmail: data.workEmail,
        investorType: data.investorType,
        proposalFileName: data.proposalFile?.name || '',
      });
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {
      // ignore
    }

    return {
      success: true,
      referenceId,
      message: result.message || 'Thank you for your interest in Setu247. Your enquiry has been received. Our team will get in touch if there is a potential opportunity to connect.',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network error';
    console.error('[Investor Submission Error]', err);

    return {
      success: false,
      message: `Enquiry submission could not connect to server (${msg}). You may write confidentially to ${siteConfig.emails.investors}.`,
    };
  }
};
