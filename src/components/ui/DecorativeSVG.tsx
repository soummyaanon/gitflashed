import React from 'react'

export const CircuitLines: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path 
      d="M10 90 Q 50 50 90 90" 
      stroke="currentColor" 
      strokeWidth="0.15"
      strokeLinecap="round"
    />
    <path 
      d="M10 10 Q 50 50 90 10" 
      stroke="currentColor" 
      strokeWidth="0.15"
      strokeLinecap="round"
    />
    <circle cx="50" cy="50" r="1" fill="currentColor" />
    <text 
      x="50" 
      y="55" 
      textAnchor="middle" 
      fill="currentColor" 
      fontSize="8"
      fontFamily="monospace"
      opacity="0.5"
    >
      CHILLGIT
    </text>
  </svg>
)

export const Pulse: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path 
      d="M25 50 Q 50 20 75 50" 
      stroke="currentColor" 
      strokeWidth="0.25"
      strokeLinecap="round"
    />
    <line 
      x1="0" 
      y1="50" 
      x2="100" 
      y2="50" 
      stroke="currentColor" 
      strokeWidth="0.1" 
      strokeDasharray="1,3"
    />
  </svg>
)

export const ChillGitText: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <text 
      x="100" 
      y="35" 
      textAnchor="middle" 
      fill="currentColor" 
      fontSize="32"
      fontFamily="monospace"
      fontWeight="bold"
      filter="url(#glow)"
      letterSpacing="0.1em"
    >
      CHILLGIT
    </text>
  </svg>
)

