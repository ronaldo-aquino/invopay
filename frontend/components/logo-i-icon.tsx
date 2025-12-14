import React from "react";

interface LogoIIconProps {
  className?: string;
  size?: number;
  gradient?: boolean;
  animated?: boolean;
}

export function LogoIIcon({
  className = "",
  size = 24,
  gradient = false,
  animated = false,
}: LogoIIconProps) {
  const uniqueId = React.useId();
  const gradientId = `logoIGradient-${uniqueId}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {gradient && (
          <>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="50%" stopColor="hsl(var(--primary) / 0.9)" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.7)" />
            </linearGradient>
            {animated && (
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                values="0 0; 0 8; 0 0"
                dur="2s"
                repeatCount="indefinite"
              />
            )}
          </>
        )}
      </defs>

      {/* Main vertical line */}
      <rect
        x="10"
        y="4"
        width="4"
        height="24"
        rx="2"
        fill={gradient ? `url(#${gradientId})` : "currentColor"}
        className={animated ? "animate-pulse" : ""}
      />

      {/* Dot */}
      <circle cx="12" cy="8" r="3" fill={gradient ? `url(#${gradientId})` : "currentColor"} />
    </svg>
  );
}
