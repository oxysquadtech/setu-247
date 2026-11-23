import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Vision } from './components/Vision';
import { Principles } from './components/Principles';
import { Careers } from './components/Careers';
import { Investors } from './components/Investors';
import { Ownership } from './components/Ownership';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { TermsModal } from './components/TermsModal';
import { StayConnectedModal } from './components/StayConnectedModal';

export const App: React.FC = () => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [stayConnectedOpen, setStayConnectedOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#101114] text-[#E8E9EB] flex flex-col selection:bg-sky-500/30 selection:text-white">
      {/* Navigation Header */}
      <Header onStayConnectedClick={() => setStayConnectedOpen(true)} />

      {/* Main Single-Page Structure */}
      <main className="flex-grow">
        {/* SECTION B: Hero / Coming Soon */}
        <Hero />

        {/* SECTION C: Brand Vision (Editorial light contrast) */}
        <Vision />

        {/* SECTION D: A Bigger Vision & Guiding Principles */}
        <Principles />

        {/* SECTION E: Careers / We Are Hiring */}
        <Careers onOpenPrivacy={() => setPrivacyOpen(true)} />

        {/* SECTION F: Investor Relations */}
        <Investors />

        {/* SECTION G: Parent Company / Ownership */}
        <Ownership />

        {/* SECTION H: Final Call to Action */}
        <FinalCTA />
      </main>

      {/* SECTION I: Footer */}
      <Footer 
        onOpenPrivacy={() => setPrivacyOpen(true)} 
        onOpenTerms={() => setTermsOpen(true)} 
      />

      {/* Interactive Overlays */}
      <PrivacyPolicyModal 
        isOpen={privacyOpen} 
        onClose={() => setPrivacyOpen(false)} 
      />

      <TermsModal 
        isOpen={termsOpen} 
        onClose={() => setTermsOpen(false)} 
      />

      <StayConnectedModal 
        isOpen={stayConnectedOpen} 
        onClose={() => setStayConnectedOpen(false)} 
      />
    </div>
  );
};

export default App;
