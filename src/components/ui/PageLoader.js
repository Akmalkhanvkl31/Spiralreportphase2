// src/components/PageLoader.jsx
import React from 'react';

const PageLoader = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
    <div className="absolute inset-0 bg-gray-50/90 backdrop-blur-sm"></div>
    <div className="relative flex flex-col items-center">
      <div className="w-32 h-32 relative">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <defs>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#EF4444', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#DC2626', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path 
            d="M25,25 C25,15 35,15 40,25 C45,35 55,35 60,25 C65,15 75,15 75,25 C75,35 65,35 60,25 C55,15 45,15 40,25 C35,35 25,35 25,25" 
            fill="none" 
            stroke="#E5E7EB" 
            strokeWidth="4" 
            strokeLinecap="round"
          />
          <path 
            d="M25,25 C25,15 35,15 40,25 C45,35 55,35 60,25 C65,15 75,15 75,25 C75,35 65,35 60,25 C55,15 45,15 40,25 C35,35 25,35 25,25" 
            fill="none" 
            stroke="url(#redGradient)" 
            strokeWidth="4" 
            strokeLinecap="round" 
            filter="url(#glow)" 
            style={{ 
              strokeDasharray: '180', 
              strokeDashoffset: '180', 
              animation: 'drawInfinity 2s ease-in-out infinite' 
            }} 
          />
        </svg>
      </div>
      <div className="mt-6 text-center">
        <h2 className="text-gray-900 text-lg font-medium mb-2">Loading</h2>
        <div className="flex items-center justify-center gap-1.5">
          <div 
            className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" 
            style={{ backgroundColor: '#EF4444', animationDelay: '0ms', animationDuration: '1s' }}
          />
          <div 
            className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" 
            style={{ backgroundColor: '#EF4444', animationDelay: '200ms', animationDuration: '1s' }}
          />
          <div 
            className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" 
            style={{ backgroundColor: '#EF4444', animationDelay: '400ms', animationDuration: '1s' }}
          />
        </div>
      </div>
      <style>{`
        @keyframes drawInfinity {
          0% { stroke-dashoffset: 180; }
          45%, 55% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -180; }
        }
      `}</style>
    </div>
  </div>
);

export default PageLoader;