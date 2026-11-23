import React from 'react';
import { siteConfig } from '../config/siteConfig';

interface OxysquadLinkProps {
  children?: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const OXYSQUAD_URL = 'https://www.oxysquad.com/';

export const OxysquadLink: React.FC<OxysquadLinkProps> = ({
  children = 'OXYSQUAD TECHNOLOGIES PVT LTD',
  className = '',
  href,
  onClick,
}) => {
  const targetUrl = href || siteConfig.parentCompanyWebsite || OXYSQUAD_URL;

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`underline underline-offset-4 decoration-sky-400 hover:text-sky-300 hover:decoration-sky-300 transition-colors ${className}`}
    >
      {children}
    </a>
  );
};
