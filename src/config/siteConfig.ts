/**
 * Central Configuration for Setu247
 * 
 * All brand metadata, company details, contact emails, and form endpoints
 * are managed here so they can easily be updated in a single place.
 */

export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
}

export interface SiteConfig {
  brandName: string;
  wordmark: string;
  parentCompany: string;
  ownershipStatement: string;
  copyright: string;
  footerSubline: string;
  emails: {
    contact: string;
    careers: string;
    investors: string;
  };
  parentCompanyWebsite?: string;
  socials: SocialLinks;
  formService: {
    careersEndpoint: string;
    investorEndpoint: string;
    enableMockStorage: boolean;
  };
}

export const siteConfig: SiteConfig = {
  brandName: 'Setu247',
  wordmark: 'SETU247',
  parentCompany: 'OXYSQUAD TECHNOLOGIES PVT LTD',
  ownershipStatement: 'Setu247 — An upcoming health-tech venture by OXYSQUAD TECHNOLOGIES PVT LTD.',
  copyright: '© 2026 Setu247. All rights reserved.',
  footerSubline: 'Something meaningful is taking shape.',
  
  emails: {
    contact: import.meta.env.VITE_CONTACT_EMAIL || 'info@oxysquad.com',
    careers: import.meta.env.VITE_CAREERS_EMAIL || 'oxysquadtechnologies@gmail.com',
    investors: import.meta.env.VITE_INVESTOR_EMAIL || 'info@oxysquad.com',
  },

  // Note: Only non-empty URLs will display social icons per brand rules
  parentCompanyWebsite: import.meta.env.VITE_PARENT_COMPANY_URL || 'https://www.oxysquad.com/',
  socials: {
    twitter: import.meta.env.VITE_SOCIAL_TWITTER || '',
    linkedin: import.meta.env.VITE_SOCIAL_LINKEDIN || '',
    github: import.meta.env.VITE_SOCIAL_GITHUB || '',
  },

  formService: {
    careersEndpoint: import.meta.env.VITE_CAREERS_ENDPOINT || 'https://formsubmit.co/ajax/Oxysquadtechnologies@gmail.com',
    investorEndpoint: import.meta.env.VITE_INVESTOR_ENDPOINT || 'https://formsubmit.co/ajax/info@oxysquad.com',
    enableMockStorage: true,
  },
};
