interface RockProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Rock({ width = 50, height = 50, className = '' }: RockProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 128 128" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <linearGradient 
        id="rock-gradient" 
        gradientUnits="userSpaceOnUse" 
        x1="87.616" 
        y1="21.04" 
        x2="41.548" 
        y2="138.084"
      >
        <stop offset="0" stopColor="#9e958e" />
        <stop offset=".46" stopColor="#8e8884" />
        <stop offset="1" stopColor="#757575" />
      </linearGradient>
      <path 
        d="M8.93 90.74c-.53-1.25-1.04-2.5-1.54-3.75c-3.77-9.51.96-18.09 5.18-26.49l6.12-12.16c1.23-2.45 3.12-4.51 5.44-5.95l17.6-10.92l17.39-17.98a8.147 8.147 0 0 1 3.97-2.27l11.84-2.86c5.73-1.37 8.19-1.15 10.04 1.48c6.41 9.1 10.7 16.59 16.41 25.66c3.11 4.94 10.29 16.29 10.74 17.04c1.38 2.32.82 4.26.77 6.92c-.12 6.13.96 12.29 3.2 18c.67 1.7 1.44 3.38 1.79 5.17c.32 1.61-.11 11.84-.44 15.3c-.27 2.81-6.91 13.3-9.29 14.57c-2.62 1.4-22.04 8.54-26.33 9.76s-22.89-3.03-32.55-4.51c-5.97-.91-11.95-1.83-17.92-2.74c-5.18-.79-10.33-.19-13.23-5.42c-3.41-6.12-6.47-12.41-9.19-18.85z" 
        fill="url(#rock-gradient)" 
      />
    </svg>
  );
}