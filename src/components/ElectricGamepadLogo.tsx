import React from 'react';

interface ElectricGamepadLogoProps {
  className?: string;
  size?: number;
}

const ElectricGamepadLogo: React.FC<ElectricGamepadLogoProps> = ({ 
  className = "", 
  size = 32 
}) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Electric animation container */}
      <div className="absolute inset-0 animate-pulse">
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className="absolute inset-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Electric sparks/lightning */}
          <g className="animate-[pulse_1.5s_ease-in-out_infinite]">
            {/* Lightning bolts around the gamepad */}
            <path
              d="M4 8 L6 6 L8 10 L10 8"
              stroke="hsl(var(--accent))"
              strokeWidth="1"
              fill="none"
              className="opacity-70"
            />
            <path
              d="M24 6 L26 8 L28 4 L30 6"
              stroke="hsl(var(--accent))"
              strokeWidth="1"
              fill="none"
              className="opacity-60"
            />
            <path
              d="M2 18 L4 16 L6 20 L8 18"
              stroke="hsl(var(--primary))"
              strokeWidth="1"
              fill="none"
              className="opacity-80"
            />
            <path
              d="M24 26 L26 24 L28 28 L30 26"
              stroke="hsl(var(--primary))"
              strokeWidth="1"
              fill="none"
              className="opacity-70"
            />
          </g>
          
          {/* Electric glow circles */}
          <g className="animate-[pulse_2s_ease-in-out_infinite_alternate]">
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="hsl(var(--accent))"
              strokeWidth="0.5"
              fill="none"
              className="opacity-30"
            />
            <circle
              cx="16"
              cy="16"
              r="16"
              stroke="hsl(var(--primary))"
              strokeWidth="0.3"
              fill="none"
              className="opacity-20"
            />
          </g>
        </svg>
      </div>

      {/* Main gamepad icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        className="relative z-10 drop-shadow-lg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gamepad body with gradient */}
        <defs>
          <linearGradient id="gamepadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Main gamepad shape */}
        <path
          d="M8 16a8 8 0 0 0-8 8c0 1.5 1.2 2.7 2.7 2.7h2.6l2.7-2.7v-2.7a5.3 5.3 0 0 1 5.3-5.3h5.4a5.3 5.3 0 0 1 5.3 5.3v2.7l2.7 2.7h2.6c1.5 0 2.7-1.2 2.7-2.7a8 8 0 0 0-8-8H8z"
          fill="url(#gamepadGradient)"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          filter="url(#glow)"
          className="animate-[pulse_3s_ease-in-out_infinite]"
        />
        
        {/* D-pad */}
        <g fill="white" className="drop-shadow-sm">
          <rect x="10.5" y="17.5" width="1.5" height="4" rx="0.3" />
          <rect x="9" y="19" width="4" height="1.5" rx="0.3" />
        </g>
        
        {/* Action buttons */}
        <g fill="white" className="drop-shadow-sm">
          <circle cx="21" cy="17.5" r="1" />
          <circle cx="24" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
          <circle cx="21" cy="22.5" r="1" />
        </g>
        
        {/* Analog sticks with electric effect */}
        <g fill="hsl(var(--accent))" className="drop-shadow-sm">
          <circle cx="13" cy="24" r="1.8" stroke="hsl(var(--primary))" strokeWidth="0.5" />
          <circle cx="19" cy="25.5" r="1.8" stroke="hsl(var(--primary))" strokeWidth="0.5" />
        </g>
      </svg>
    </div>
  );
};

export default ElectricGamepadLogo;