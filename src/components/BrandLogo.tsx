import React from 'react';

interface BrandLogoProps {
  className?: string;
  symbolSize?: number;
  showSubtitle?: boolean;
  inverted?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  symbolSize = 32,
  showSubtitle = false,
  inverted = false,
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Original Abstract Bridge Mark */}
      <div 
        className="relative flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105"
        style={{ width: symbolSize, height: symbolSize }}
      >
        <svg 
          viewBox="0 0 40 40" 
          width={symbolSize} 
          height={symbolSize} 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          {/* Subtle ambient core glow */}
          <circle cx="20" cy="20" r="14" fill="#38BDF8" fillOpacity="0.12" />
          
          {/* Outer Arch - The Path of Progress */}
          <path 
            d="M 6 28 C 6 15 13 9 20 9 C 27 9 34 15 34 28" 
            stroke={inverted ? '#101114' : '#F7F7F5'} 
            strokeWidth="2.2" 
            strokeLinecap="round" 
          />
          
          {/* Inner Counter-Arch - The Structural Anchor */}
          <path 
            d="M 10 30 C 15 22 25 22 30 30" 
            stroke="#38BDF8" 
            strokeWidth="2" 
            strokeLinecap="round" 
            opacity="0.9"
          />
          
          {/* Central Nexus Column */}
          <line 
            x1="20" 
            y1="9" 
            x2="20" 
            y2="25" 
            stroke="#38BDF8" 
            strokeWidth="1.5" 
            strokeDasharray="2 2"
            opacity="0.75"
          />
          
          {/* Apex Keystone Beacon */}
          <circle cx="20" cy="9" r="2.5" fill="#38BDF8" />
          <circle cx="20" cy="9" r="4.5" stroke="#38BDF8" strokeWidth="0.8" opacity="0.5" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-baseline tracking-tight">
          <span className={`text-xl sm:text-2xl font-extrabold tracking-[-0.03em] ${inverted ? 'text-[#101114]' : 'text-white'}`}>
            SETU
          </span>
          <span className="text-xl sm:text-2xl font-light font-display tracking-tight text-sky-400 ml-0.5">
            247
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#747982] font-medium -mt-0.5">
            Health-Tech Venture
          </span>
        )}
      </div>
    </div>
  );
};
