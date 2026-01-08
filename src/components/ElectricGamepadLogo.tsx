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
      <img 
        src="/gamepad-favicon.svg" 
        alt="Juega Y Calla Logo" 
        width={size} 
        height={size}
        className="w-full h-full"
      />
    </div>
  );
};

export default ElectricGamepadLogo;
