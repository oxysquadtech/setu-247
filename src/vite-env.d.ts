/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTACT_EMAIL?: string;
  readonly VITE_CAREERS_EMAIL?: string;
  readonly VITE_INVESTOR_EMAIL?: string;
  readonly VITE_CAREERS_ENDPOINT?: string;
  readonly VITE_INVESTOR_ENDPOINT?: string;
  readonly VITE_PARENT_COMPANY_URL?: string;
  readonly VITE_SOCIAL_TWITTER?: string;
  readonly VITE_SOCIAL_LINKEDIN?: string;
  readonly VITE_SOCIAL_GITHUB?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
