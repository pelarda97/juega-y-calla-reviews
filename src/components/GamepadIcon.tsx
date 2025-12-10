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
  const getColors = () => {
    if (filled) {
      return {
        body: "fill-primary stroke-primary",
        buttons: "fill-white",
        sticks: "fill-accent"
      };
    } else if (halfFilled) {
      return {
        body: "fill-primary/50 stroke-primary",
        buttons: "fill-white/50",
        sticks: "fill-accent/50"
      };
    } else {
      return {
        body: "fill-none stroke-muted-foreground",
        buttons: "fill-none stroke-muted-foreground",
        sticks: "fill-none stroke-muted-foreground"
      };
    }
  };

  const colors = getColors();
  const clipId = `partial-fill-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {halfFilled && (
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={24 * (fillPercentage / 100)} height="24" />
          </clipPath>
        </defs>
      )}
      
      {/* Empty gamepad base */}
      <g>
        <path
          d="M6 12a6 6 0 0 0-6 6c0 1.1.9 2 2 2h2l2-2v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2l2 2h2c1.1 0 2-.9 2-2a6 6 0 0 0-6-6H6z"
          className="fill-none stroke-muted-foreground"
          strokeWidth="1.5"
        />
        <rect x="8" y="13" width="1" height="3" className="fill-none stroke-muted-foreground" strokeWidth="0.5" />
        <rect x="7" y="14" width="3" height="1" className="fill-none stroke-muted-foreground" strokeWidth="0.5" />
        <circle cx="16" cy="13" r="0.7" className="fill-none stroke-muted-foreground" strokeWidth="0.5" />
        <circle cx="18" cy="15" r="0.7" className="fill-none stroke-muted-foreground" strokeWidth="0.5" />
        <circle cx="14" cy="15" r="0.7" className="fill-none stroke-muted-foreground" strokeWidth="0.5" />
        <circle cx="16" cy="17" r="0.7" className="fill-none stroke-muted-foreground" strokeWidth="0.5" />
        <circle cx="10" cy="18" r="1.2" className="fill-none stroke-muted-foreground" strokeWidth="0.5" />
        <circle cx="14" cy="19" r="1.2" className="fill-none stroke-muted-foreground" strokeWidth="0.5" />
      </g>
      
      {/* Filled overlay */}
      {(filled || halfFilled) && (
        <g clipPath={halfFilled ? `url(#${clipId})` : undefined}>
          <path
            d="M6 12a6 6 0 0 0-6 6c0 1.1.9 2 2 2h2l2-2v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2l2 2h2c1.1 0 2-.9 2-2a6 6 0 0 0-6-6H6z"
            className="fill-primary stroke-primary"
            strokeWidth="1.5"
          />
          <rect x="8" y="13" width="1" height="3" className="fill-white" strokeWidth="0.5" />
          <rect x="7" y="14" width="3" height="1" className="fill-white" strokeWidth="0.5" />
          <circle cx="16" cy="13" r="0.7" className="fill-white" strokeWidth="0.5" />
          <circle cx="18" cy="15" r="0.7" className="fill-white" strokeWidth="0.5" />
          <circle cx="14" cy="15" r="0.7" className="fill-white" strokeWidth="0.5" />
          <circle cx="16" cy="17" r="0.7" className="fill-white" strokeWidth="0.5" />
          <circle cx="10" cy="18" r="1.2" className="fill-accent" strokeWidth="0.5" />
          <circle cx="14" cy="19" r="1.2" className="fill-accent" strokeWidth="0.5" />
        </g>
      )}
    </svg>
  );
};

export default GamepadIcon;