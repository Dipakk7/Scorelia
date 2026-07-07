import React from 'react'

interface LogoProps {
  className?: string
  iconOnly?: boolean
  monochrome?: boolean
}

export const Logo: React.FC<LogoProps> = ({
  className = 'h-8 w-auto',
  iconOnly = false,
  monochrome = false,
}) => {
  const tealColor = monochrome ? 'currentColor' : '#0F9D9A'

  if (iconOnly) {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M38 74 C38 86, 68 86, 68 70 C68 54, 38 56, 38 40 C38 24, 68 24, 68 34"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M62 34 L68 41 L84 18"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="74" r="5" fill={tealColor} />
        <rect x="46" y="68" width="4" height="8" rx="1.5" fill="currentColor" />
        <rect x="53" y="60" width="4" height="16" rx="1.5" fill="currentColor" />
        <rect x="60" y="52" width="4" height="24" rx="1.5" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 240 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g transform="translate(10, 5) scale(0.5)">
        <path
          d="M38 74 C38 86, 68 86, 68 70 C68 54, 38 56, 38 40 C38 24, 68 24, 68 34"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M62 34 L68 41 L84 18"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="74" r="5" fill={tealColor} />
        <rect x="46" y="68" width="4" height="8" rx="1.5" fill="currentColor" />
        <rect x="53" y="60" width="4" height="16" rx="1.5" fill="currentColor" />
        <rect x="60" y="52" width="4" height="24" rx="1.5" fill="currentColor" />
      </g>
      <text
        x="68"
        y="38"
        fontFamily="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="700"
        fontSize="28"
        letterSpacing="-0.02em"
        fill="currentColor"
      >
        Scorelia
      </text>
    </svg>
  )
}
