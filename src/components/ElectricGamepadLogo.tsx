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
        
        {/* Main gamepad shape - más reconocible */}
        <path
          d="M8 15a6 6 0 0 0-6 6c0 1.1.9 2 2 2h2.5l1.5-1.5v-1.5a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1.5l1.5 1.5H24c1.1 0 2-.9 2-2a6 6 0 0 0-6-6H8z"
          fill="url(#gamepadGradient)"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          filter="url(#glow)"
          className="animate-[pulse_3s_ease-in-out_infinite]"
        />
        
        {/* Shoulder buttons/triggers */}
        <rect x="6" y="13" width="3" height="1.5" rx="0.5" fill="hsl(var(--primary))" opacity="0.8" />
        <rect x="23" y="13" width="3" height="1.5" rx="0.5" fill="hsl(var(--primary))" opacity="0.8" />
        
        {/* D-pad más definido */}
        <g fill="white" className="drop-shadow-sm">
          <rect x="10" y="17" width="1.2" height="3.5" rx="0.2" />
          <rect x="8.9" y="18.1" width="3.5" height="1.2" rx="0.2" />
        </g>
        
        {/* Action buttons más grandes y definidos */}
        <g fill="white" className="drop-shadow-sm">
          <circle cx="20.5" cy="17" r="0.8" />
          <circle cx="22.5" cy="19" r="0.8" />
          <circle cx="18.5" cy="19" r="0.8" />
          <circle cx="20.5" cy="21" r="0.8" />
        </g>
        
        {/* Analog sticks más prominentes */}
        <g className="drop-shadow-sm">
          <circle cx="12.5" cy="22.5" r="1.5" fill="hsl(var(--accent))" stroke="hsl(var(--primary))" strokeWidth="0.5" />
          <circle cx="12.5" cy="22.5" r="0.8" fill="white" opacity="0.3" />
          
          <circle cx="19.5" cy="23.5" r="1.5" fill="hsl(var(--accent))" stroke="hsl(var(--primary))" strokeWidth="0.5" />
          <circle cx="19.5" cy="23.5" r="0.8" fill="white" opacity="0.3" />
        </g>
        
        {/* Centro del gamepad para más detalle */}
        <rect x="14" y="15.5" width="4" height="1" rx="0.5" fill="hsl(var(--primary))" opacity="0.6" />
        <circle cx="15" cy="16" r="0.3" fill="white" opacity="0.8" />
        <circle cx="17" cy="16" r="0.3" fill="white" opacity="0.8" />
      </svg>
    </div>
  );
};

export default ElectricGamepadLogo;