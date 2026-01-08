import React from 'react';

interface GamepadIconProps {
  filled?: boolean;
  halfFilled?: boolean;
  fillPercentage?: number;
  className?: string;
}

const GamepadIcon: React.FC<GamepadIconProps> = ({ 
  filled = false, 
  halfFilled = false, 
  fillPercentage = 50,
  className = "" 
}) => {
  const clipId = `partial-fill-${Math.random().toString(36).substr(2, 9)}`;
  const opacity = filled ? 1 : halfFilled ? 0.5 : 0.3;
  const greyOpacity = filled || halfFilled ? 1 : 0.3;

  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 254 150"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {halfFilled && (
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={254 * (fillPercentage / 100)} height="150" />
          </clipPath>
        </defs>
      )}
      
      <g clipPath={halfFilled ? `url(#${clipId})` : undefined} opacity={greyOpacity}>
        {/* Puente central */}
        <path 
          d="M217.532 3H39.9068C32.8997 3 27.2193 5.676 27.2193 8.97701V62.023C27.2193 65.324 32.8997 68 39.9068 68H217.532C224.539 68 230.219 65.324 230.219 62.023V8.97701C230.219 5.676 224.539 3 217.532 3Z" 
          fill={filled || halfFilled ? "hsl(var(--primary))" : "none"}
          stroke={filled || halfFilled ? "hsl(var(--primary))" : "currentColor"}
          strokeWidth="3"
          opacity={opacity}
        />
        
        {/* Grip izquierdo */}
        <path 
          d="M7.83849 52.537C8.82343 41.2791 12.3412 30.2427 17.5476 19.3541L22.754 8.46554C27.4351 3.58117 36.075 2.06824 47.895 3.10236L42.1824 68.3983L83.5526 72.0178L83.0929 77.2715C82.3707 85.5273 80.8041 93.7092 79.2375 101.891L76.564 113.001C75.1287 119.682 72.9148 125.539 70.7666 130.645L67.7741 135.677C64.9129 139.208 61.2075 142.665 56.789 144.547C52.3706 146.43 48.0835 146.811 43.9277 145.691L33.9275 143.303C29.9031 140.683 26.8542 136.634 24.7153 131.91L21.1505 124.035C17.5857 116.16 14.0865 107.535 12.3416 98.3073L9.94941 86.754C7.94184 80.5281 6.0656 72.8013 6.72223 65.296L7.83849 52.537Z" 
          fill={filled || halfFilled ? "hsl(var(--primary))" : "none"}
          stroke={filled || halfFilled ? "hsl(var(--primary))" : "currentColor"}
          strokeWidth="3"
          opacity={opacity}
        />
        
        {/* Grip derecho */}
        <path 
          d="M245.692 53.1161L246.814 65.9404C247.474 73.4842 245.667 81.2438 243.727 87.4947L241.427 99.0982C239.751 108.367 236.364 117.025 232.911 124.928L229.459 132.832C227.387 137.574 224.427 141.634 220.512 144.257L210.773 146.629C206.726 147.743 202.547 147.349 198.237 145.445C193.926 143.542 190.306 140.058 187.508 136.502L184.578 131.437C182.471 126.3 180.298 120.409 178.881 113.692L176.246 102.52C174.698 94.2942 173.149 86.068 172.423 77.7699L171.961 72.4892L212.267 68.963L206.525 3.33233C218.041 2.32483 226.464 3.8683 231.039 8.7891L236.142 19.7449C241.245 30.7007 244.702 41.8004 245.692 53.1161Z" 
          fill={filled || halfFilled ? "hsl(var(--primary))" : "none"}
          stroke={filled || halfFilled ? "hsl(var(--primary))" : "currentColor"}
          strokeWidth="3"
          opacity={opacity}
        />
        
        {/* Botones simplificados para tamaño pequeño */}
        {(filled || halfFilled) && (
          <>
            <circle cx="43.7779" cy="38.5117" r="4" fill="hsl(var(--accent))" opacity={opacity} />
            <circle cx="83.9693" cy="68" r="8" fill="hsl(var(--accent))" opacity={opacity} />
            <circle cx="166.469" cy="68" r="8" fill="hsl(var(--accent))" opacity={opacity} />
            <circle cx="212.377" cy="27.6719" r="4" fill="hsl(var(--accent))" opacity={opacity} />
          </>
        )}
      </g>
    </svg>
  );
};

export default GamepadIcon;