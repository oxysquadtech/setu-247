import { siteConfig } from '../config/siteConfig';

export interface CareerApplicationData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  domain: string;
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
  message: string;
  honeypot?: string;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  referenceId?: string;
  error?: string;
}

// Convert a File to Base64 safely for transmission or storage
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Validate file constraints (PDF, DOC, DOCX up to 5MB)
export const validateResumeFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5 MB
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
      error: `File size exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB detected).`
    };
  }

  return { valid: true };
};

export const submitCareerApplication = async (data: CareerApplicationData): Promise<SubmissionResponse> => {
  // Anti-spam honeypot verification
  if (data.honeypot && data.honeypot.trim() !== '') {
    return { success: false, message: 'Automated submission detected.' };
  }

  if (!data.consent) {
    return { success: false, message: 'Please consent to the privacy policy to proceed.' };
  }

  const endpoint = siteConfig.formService.careersEndpoint;
  const referenceId = `SETU-TALENT-${Date.now().toString(36).toUpperCase()}`;

  // Prepare payload
  let payload: Record<string, unknown> = {
    referenceId,
    timestamp: new Date().toISOString(),
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    location: data.location,
    domain: data.domain,
    linkedIn: data.linkedIn || '',
    portfolio: data.portfolio || '',
    message: data.message,
    resumeFileName: data.resumeFileName || (data.resumeFile ? data.resumeFile.name : ''),
    resumeFileSize: data.resumeFileSize || (data.resumeFile ? data.resumeFile.size : 0),
  };

  if (data.resumeFile) {
    try {
      const base64 = await fileToBase64(data.resumeFile);
      payload.resumeBase64 = base64;
    } catch {
      // Continue even if base64 conversion failed
    }
  }

  if (endpoint) {
    try {
      let response: Response;

      if (endpoint.includes('formsubmit.co')) {
        const formDataObj = new FormData();
        formDataObj.append('_subject', `Setu247 Job Application: ${data.fullName} — ${data.domain}`);
        formDataObj.append('_template', 'table');
        formDataObj.append('_captcha', 'false');
        formDataObj.append('_replyto', data.email);
        formDataObj.append('Applicant Full Name', data.fullName);
        formDataObj.append('Applicant Email', data.email);
        formDataObj.append('Applicant Phone', data.phone);
        formDataObj.append('Current Location', data.location);
        formDataObj.append('Position / Domain', data.domain);
        formDataObj.append('LinkedIn Profile', data.linkedIn || 'Not provided');
        formDataObj.append('Portfolio / Website', data.portfolio || 'Not provided');
        formDataObj.append('Short Introduction / Message', data.message);
        formDataObj.append('Application Reference', referenceId);
        formDataObj.append('Submitted Date', new Date().toLocaleString());

        if (data.resumeFile) {
          formDataObj.append('Resume Attachment', data.resumeFile);
        }

        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
          body: formDataObj,
        });
      } else {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      let responseData: Record<string, unknown> | null = null;
      try {
        responseData = await response.json();
      } catch {
        // non-json response
      }

      // Check if FormSubmit returned an activation required notice
      if (responseData && (responseData.success === 'false' || responseData.success === false)) {
        const msg = String(responseData.message || '');
        if (msg.toLowerCase().includes('activation') || msg.toLowerCase().includes('activate')) {
          return {
            success: true,
            referenceId,
            message: `One-Time Setup: An activation link has been sent to ${siteConfig.emails.careers}. Please open your Gmail and click 'Activate Form' once to enable instant email delivery for all future applications.`,
          };
        }
      }

      // Also store local audit backup
      try {
        const key = 'setu247_talent_submissions';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push({ ...payload, resumeBase64: payload.resumeBase64 ? '[Captured file data]' : undefined });
        localStorage.setItem(key, JSON.stringify(existing));
      } catch {
        // quota fallback
      }

      return {
        success: true,
        referenceId,
        message: 'Thank you for your interest in Setu247. Your application has been received and delivered directly to the Oxysquad hiring desk.',
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      return {
        success: false,
        message: `Submission failed: ${msg}. Alternatively, you may reach out directly to ${siteConfig.emails.careers}.`,
      };
    }
  }

  return {
    success: false,
    message: `Application service is currently in maintenance. Please email your resume directly to ${siteConfig.emails.careers}.`,
  };
};

export const submitInvestorEnquiry = async (data: InvestorEnquiryData): Promise<SubmissionResponse> => {
  if (data.honeypot && data.honeypot.trim() !== '') {
    return { success: false, message: 'Automated submission detected.' };
  }

  const endpoint = siteConfig.formService.investorEndpoint;
  const referenceId = `SETU-INV-${Date.now().toString(36).toUpperCase()}`;

  const payload = {
    referenceId,
    timestamp: new Date().toISOString(),
    fullName: data.fullName,
    organisation: data.organisation,
    workEmail: data.workEmail,
    phone: data.phone || '',
    investorType: data.investorType,
    message: data.message,
  };

  if (endpoint) {
    try {
      let response: Response;

      if (endpoint.includes('formsubmit.co')) {
        const formDataObj = new FormData();
        formDataObj.append('_subject', `Setu247 Investor Dialogue: ${data.fullName} (${data.organisation})`);
        formDataObj.append('_template', 'table');
        formDataObj.append('_captcha', 'false');
        formDataObj.append('_replyto', data.workEmail);
        formDataObj.append('_cc', 'Oxysquadtechnologies@gmail.com');
        formDataObj.append('Full Name', data.fullName);
        formDataObj.append('Organisation / Fund', data.organisation);
        formDataObj.append('Work Email', data.workEmail);
        formDataObj.append('Phone Number', data.phone || 'Not provided');
        formDataObj.append('Investor Type', data.investorType);
        formDataObj.append('Investment Interest / Message', data.message);
        formDataObj.append('Reference Code', referenceId);
        formDataObj.append('Submitted Date', new Date().toLocaleString());

        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
          body: formDataObj,
        });
      } else {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      let responseData: Record<string, unknown> | null = null;
      try {
        responseData = await response.json();
      } catch {
        // non-json response
      }

      if (responseData && (responseData.success === 'false' || responseData.success === false)) {
        const msg = String(responseData.message || '');
        if (msg.toLowerCase().includes('activation') || msg.toLowerCase().includes('activate')) {
          return {
            success: true,
            referenceId,
            message: `One-Time Setup: An activation link has been sent to ${siteConfig.emails.investors}. Please click 'Activate Form' once to enable instant email delivery for all future investor enquiries.`,
          };
        }
      }

      // Local storage audit
      try {
        const key = 'setu247_investor_submissions';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push(payload);
        localStorage.setItem(key, JSON.stringify(existing));
      } catch {
        // Ignore
      }

      return {
        success: true,
        referenceId,
        message: 'Thank you for your interest in Setu247. Your enquiry has been received and delivered directly to our investor desk.',
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      return {
        success: false,
        message: `Enquiry submission failed: ${msg}. You may write confidentially to ${siteConfig.emails.investors}.`,
      };
    }
  }

  return {
    success: false,
    message: `Enquiry service is temporarily unavailable. Please reach out directly to ${siteConfig.emails.investors}.`,
  };
};
