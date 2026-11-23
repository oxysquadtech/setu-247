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
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      return {
        success: true,
        referenceId,
        message: 'Thank you for your interest in Setu247. Your application has been received. Our team will review it and reach out if there is a suitable opportunity.',
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      return {
        success: false,
        message: `Submission failed: ${msg}. Alternatively, you may reach out directly to ${siteConfig.emails.careers}.`,
      };
    }
  }

  // Fallback: Local Secure Storage Queue for Development / Initial Launch verification
  if (siteConfig.formService.enableMockStorage) {
    await new Promise(resolve => setTimeout(resolve, 800)); // Realistic network latency
    try {
      const key = 'setu247_talent_submissions';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      // Don't store oversized base64 in localStorage to preserve quota
      const record = { ...payload, resumeBase64: payload.resumeBase64 ? '[Captured file data]' : undefined };
      existing.push(record);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {
      // Storage quota exceeded or disabled
    }

    return {
      success: true,
      referenceId,
      message: 'Thank you for your interest in Setu247. Your application has been received. Our team will review it and reach out if there is a suitable opportunity.',
    };
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
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      return {
        success: true,
        referenceId,
        message: 'Thank you for your interest in Setu247. Your enquiry has been received. Our team will get in touch if there is a potential opportunity to connect.',
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      return {
        success: false,
        message: `Enquiry submission failed: ${msg}. You may write confidentially to ${siteConfig.emails.investors}.`,
      };
    }
  }

  // Local storage queue fallback
  if (siteConfig.formService.enableMockStorage) {
    await new Promise(resolve => setTimeout(resolve, 750));
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
      message: 'Thank you for your interest in Setu247. Your enquiry has been received. Our team will get in touch if there is a potential opportunity to connect.',
    };
  }

  return {
    success: false,
    message: `Enquiry service is temporarily unavailable. Please reach out directly to ${siteConfig.emails.investors}.`,
  };
};
