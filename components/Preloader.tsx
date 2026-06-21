import React from 'react';

interface PreloaderProps {
  message?: string;
  fullscreen?: boolean;
}

export default function Preloader({ message = 'Growing your guide...', fullscreen = true }: PreloaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center select-none">
      {/* Growing sprout/breathing leaf SVG */}
      <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
        {/* Outer glowing pulsing background */}
        <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-950/30 rounded-full animate-breathe filter blur-sm"></div>
        
        {/* Leaf Sprout SVG */}
        <svg 
          width="64" 
          height="64" 
          viewBox="0 0 64 64" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 text-emerald-600 dark:text-emerald-400 animate-sway origin-bottom"
        >
          {/* Ground/Dirt line */}
          <path 
            d="M12 56C25.3333 56 38.6667 56 52 56" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
          
          {/* Sprout stem */}
          <path 
            d="M32 56V32C32 24.5 37.5 18.5 42 16" 
            stroke="currentColor" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
          
          {/* Left leaf */}
          <path 
            d="M32 40C22.5 40 18 31 19 25C25.5 24 30.5 28.5 32 35" 
            fill="currentColor" 
            fillOpacity="0.15" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* Right leaf */}
          <path 
            d="M32 30C41.5 28 45.5 19 44.5 13C38 14 33.5 19 32 25C31.5 27 31.8 28.5 32 30Z" 
            fill="currentColor" 
            fillOpacity="0.3" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* Small growing bud */}
          <circle cx="42" cy="16" r="3" fill="currentColor" className="animate-ping" />
        </svg>
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 animate-pulse tracking-wide font-sans">
        {message}
      </h3>
      
      {/* Tiny descriptive tip */}
      <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
        Calculating carbon metrics and preparing actionable insights locally...
      </p>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-55 flex items-center justify-center bg-background/90 dark:bg-background/95 backdrop-blur-md transition-opacity duration-300">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center p-6 border border-dashed border-emerald-200 dark:border-emerald-900/50 rounded-lg bg-emerald-50/20 dark:bg-emerald-950/5">
      {content}
    </div>
  );
}
