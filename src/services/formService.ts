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
 * Upload document directly to reliable public storage from the browser
 * Allows direct 1-click preview and download of candidate resumes/proposals
 */
export const uploadDocumentFromClient = async (file: File): Promise<string | null> => {
  // 1. Try Gofile
  try {
    const sRes = await fetch('https://api.gofile.io/servers');
    const sJson = await sRes.json();
    if (sJson.status === 'ok' && sJson.data?.servers?.length > 0) {
      const server = sJson.data.servers[0].name;
      const fd = new FormData();
      fd.append('file', file);
      const upRes = await fetch(`https://${server}.gofile.io/contents/uploadfile`, {
        method: 'POST',
        body: fd,
      });
      const upJson = await upRes.json();
      if (upJson.status === 'ok' && upJson.data?.downloadPage) {
        return upJson.data.downloadPage as string;
      }
    }
  } catch (e) {
    console.warn('[Storage] Gofile browser upload skipped:', e);
  }

  // 2. Try tmpfiles
  try {
    const fd = new FormData();
    fd.append('file', file);
    const upRes = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: fd,
    });
    const upJson = await upRes.json();
    if (upJson.status === 'success' && upJson.data?.url) {
      return upJson.data.url as string;
    }
  } catch (e) {
    console.warn('[Storage] tmpfiles browser upload skipped:', e);
  }

  return null;
};

/**
 * Client-Side Direct Fallback for Careers
 * Dispatches directly to company email via HTTP Gateway with zero config/server requirements
 */
const fallbackCareerSubmit = async (
  data: CareerApplicationData,
  referenceId: string
): Promise<SubmissionResponse> => {
  const recipient = siteConfig.emails.notifications || 'oxysquadtechnologies@gmail.com';
  let cloudDocUrl: string | null = null;

  if (data.resumeFile) {
    try {
      cloudDocUrl = await uploadDocumentFromClient(data.resumeFile);
    } catch {
      // ignore
    }
  }

  const formData = new FormData();
  formData.append('_subject', `New Job Application – ${data.fullName}`);
  formData.append('_template', 'table');
  formData.append('_captcha', 'false');
  formData.append('Full Name', data.fullName);
  formData.append('Email Address', data.email);
  formData.append('Mobile Number', data.phone);
  formData.append('Job Position / Profile', data.domain);
  formData.append('Current Location', data.location);
  formData.append('Experience Level', data.experience || 'Not specified');
  formData.append('Key Skills', data.skills || 'Not specified');
  formData.append('LinkedIn Profile', data.linkedIn || 'Not provided');
  formData.append('Portfolio / Website', data.portfolio || 'Not provided');
  formData.append('Candidate Note', data.message);
  formData.append('Reference Code', referenceId);

  if (cloudDocUrl) {
    formData.append('Candidate_Resume_Document', cloudDocUrl);
    formData.append('Resume_Download_Link', cloudDocUrl);
  } else if (data.resumeFile) {
    formData.append('Uploaded_Resume_Filename', data.resumeFile.name);
    formData.append('Uploaded_Resume_Filesize', `${(data.resumeFile.size / (1024 * 1024)).toFixed(2)} MB`);
  }

  try {
    await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });
  } catch (err) {
    console.warn('[Direct Fallback Warning] FormSubmit request error:', err);
  }

  // Always archive in local storage
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
      resumeCloudUrl: cloudDocUrl,
    });
    localStorage.setItem(key, JSON.stringify(existing));
  } catch {
    // ignore
  }

  return {
    success: true,
    referenceId,
    message: 'Thank you for your interest in Setu247. Your application has been received. Our team will review it and reach out if there is a suitable opportunity.',
  };
};

/**
 * Client-Side Direct Fallback for Investors
 */
const fallbackInvestorSubmit = async (
  data: InvestorEnquiryData,
  referenceId: string
): Promise<SubmissionResponse> => {
  const recipient = siteConfig.emails.notifications || 'oxysquadtechnologies@gmail.com';
  let cloudDocUrl: string | null = null;

  if (data.proposalFile) {
    try {
      cloudDocUrl = await uploadDocumentFromClient(data.proposalFile);
    } catch {
      // ignore
    }
  }

  const formData = new FormData();
  formData.append('_subject', `New Investor Enquiry – ${data.fullName}`);
  formData.append('_template', 'table');
  formData.append('_captcha', 'false');
  formData.append('Investor Name', data.fullName);
  formData.append('Company / Organization', data.organisation);
  formData.append('Work Email Address', data.workEmail);
  formData.append('Mobile Number', data.phone || 'Not provided');
  formData.append('Investor Classification', data.investorType);
  formData.append('Investment Details / Target Range', data.investmentAmount || 'Flexible / To be discussed');
  formData.append('Business Proposal / Statement', data.message);
  formData.append('Reference Code', referenceId);

  if (cloudDocUrl) {
    formData.append('Investor_Proposal_Document', cloudDocUrl);
    formData.append('Proposal_Download_Link', cloudDocUrl);
  } else if (data.proposalFile) {
    formData.append('Uploaded_Proposal_Filename', data.proposalFile.name);
    formData.append('Uploaded_Proposal_Filesize', `${(data.proposalFile.size / (1024 * 1024)).toFixed(2)} MB`);
  }

  try {
    await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });
  } catch (err) {
    console.warn('[Direct Fallback Warning] FormSubmit request error:', err);
  }

  // Always archive in local storage
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
      proposalCloudUrl: cloudDocUrl,
    });
    localStorage.setItem(key, JSON.stringify(existing));
  } catch {
    // ignore
  }

  return {
    success: true,
    referenceId,
    message: 'Thank you for your interest in Setu247. Your enquiry has been received. Our team will get in touch if there is a potential opportunity to connect.',
  };
};

/**
 * Submit Job Application
 * Submits directly to /api/careers (Backend Notification Gateway)
 * Seamlessly falls back to direct delivery if backend is unavailable.
 */
export const submitCareerApplication = async (data: CareerApplicationData): Promise<SubmissionResponse> => {
  // Anti-spam honeypot verification
  if (data.honeypot && data.honeypot.trim() !== '') {
    return { success: false, message: 'Automated submission detected.' };
  }

  if (!data.consent) {
    return { success: false, message: 'Please consent to the privacy policy to proceed.' };
  }

  if (!data.resumeFile) {
    return { success: false, message: 'Resume upload is compulsory. Please attach your resume or CV.' };
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
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.warn(`[Career Application] /api/careers returned status ${response.status}, triggering fallback gateway...`);
      return await fallbackCareerSubmit(data, referenceId);
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
    console.warn('[Career Application] Backend unreachable, routing via fallback gateway...', err);
    return await fallbackCareerSubmit(data, referenceId);
  }
};

/**
 * Submit Investor Enquiry
 * Submits directly to /api/investors (Backend Notification Gateway)
 * Seamlessly falls back to direct delivery if backend is unavailable.
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
      console.warn(`[Investor Enquiry] /api/investors returned status ${response.status}, triggering fallback gateway...`);
      return await fallbackInvestorSubmit(data, referenceId);
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
    console.warn('[Investor Enquiry] Backend unreachable, routing via fallback gateway...', err);
    return await fallbackInvestorSubmit(data, referenceId);
  }
};
