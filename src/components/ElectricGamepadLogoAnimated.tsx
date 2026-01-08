import React from 'react';

interface ElectricGamepadLogoAnimatedProps {
  className?: string;
  size?: number;
}

const ElectricGamepadLogoAnimated: React.FC<ElectricGamepadLogoAnimatedProps> = ({ 
  className = "", 
  size = 32 
}) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Efectos eléctricos de fondo */}
      <div className="absolute inset-0 animate-pulse">
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className="absolute inset-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Rayos eléctricos */}
          <g className="animate-[pulse_2.5s_ease-in-out_infinite]">
            {/* Rayos superiores */}
            <path
              d="M2 4 L4 2 L6 6 L8 4"
              stroke="hsl(var(--accent))"
              strokeWidth="1"
              fill="none"
              className="opacity-70"
            />
            <path
              d="M10 2 L12 4 L14 1 L16 3"
              stroke="hsl(var(--accent))"
              strokeWidth="1"
              fill="none"
              className="opacity-60"
            />
            <path
              d="M24 2 L26 4 L28 1 L30 3"
              stroke="hsl(var(--primary))"
              strokeWidth="1"
              fill="none"
              className="opacity-65"
            />
            {/* Rayos laterales izquierdos */}
            <path
              d="M1 10 L3 12 L1 14 L3 16"
              stroke="hsl(var(--primary))"
              strokeWidth="1"
              fill="none"
              className="opacity-75"
            />
            <path
              d="M2 20 L4 22 L2 24 L4 26"
              stroke="hsl(var(--accent))"
              strokeWidth="1"
              fill="none"
              className="opacity-70"
            />
            {/* Rayos laterales derechos */}
            <path
              d="M29 10 L31 12 L29 14 L31 16"
              stroke="hsl(var(--accent))"
              strokeWidth="1"
              fill="none"
              className="opacity-80"
            />
            <path
              d="M28 20 L30 22 L28 24 L30 26"
              stroke="hsl(var(--primary))"
              strokeWidth="1"
              fill="none"
              className="opacity-65"
            />
            {/* Rayos inferiores */}
            <path
              d="M2 28 L4 30 L6 27 L8 29"
              stroke="hsl(var(--primary))"
              strokeWidth="1"
              fill="none"
              className="opacity-70"
            />
            <path
              d="M24 28 L26 30 L28 27 L30 29"
              stroke="hsl(var(--accent))"
              strokeWidth="1"
              fill="none"
              className="opacity-75"
            />
          </g>
          
          {/* Círculos de brillo eléctrico */}
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

      {/* Logo principal */}
      <div className="relative z-10">
        <img 
          src="/gamepad-favicon.svg" 
          alt="Juega Y Calla Logo" 
          width={size} 
          height={size}
          className="w-full h-full drop-shadow-lg"
        />
      </div>
    </div>
  );
};

export default ElectricGamepadLogoAnimated;
