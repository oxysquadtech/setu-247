import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onStayConnectedClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStayConnectedClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Our Vision', href: '#vision' },
    { label: 'Careers', href: '#careers' },
    { label: 'Investors', href: '#investors' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#101114]/85 backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl shadow-black/50'
          : 'bg-transparent py-5 sm:py-6 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Symbol */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, '#home')}
            className="group flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-lg p-1 -m-1"
            aria-label="Setu247 Home"
          >
            <BrandLogo symbolSize={34} showSubtitle={false} />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-xs lg:text-sm font-medium tracking-wide text-[#E8E9EB]/75 hover:text-white px-3.5 py-1.5 rounded-full transition-colors duration-200 hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onStayConnectedClick}
              className="group relative inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#202329] to-[#2A2E37] border border-white/15 rounded-full hover:border-sky-400/60 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <span>Stay Connected</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-sky-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onStayConnectedClick}
              className="text-xs px-3 py-1.5 font-medium rounded-full bg-white/10 text-white border border-white/10"
            >
              Connect
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#E8E9EB] hover:text-white rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#101114]/95 backdrop-blur-xl border-b border-white/10 px-4 pt-4 pb-6 space-y-3 shadow-2xl animate-in fade-in duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-base font-medium text-[#E8E9EB] hover:text-sky-400 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStayConnectedClick();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold tracking-wider uppercase text-white bg-sky-500/10 border border-sky-400/30 rounded-xl hover:bg-sky-500/20 transition-colors"
            >
              <span>Stay Connected</span>
              <ArrowUpRight className="w-4 h-4 text-sky-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
