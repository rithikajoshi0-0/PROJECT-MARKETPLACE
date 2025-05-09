import React from 'react';

const RiseLogo = () => {
  return (
    <div className="flex items-center">
      <svg
        viewBox="0 0 400 150"
        className="h-8 w-32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="riseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="100%" stopColor="#007bff" />
          </linearGradient>
        </defs>
        <text
          x="10"
          y="90"
          fontSize="80"
          fontFamily="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          fontWeight="900"
          fill="url(#riseGradient)"
        >
          RISE
        </text>

        {/* Upward arrow inside R */}
        <path
          d="M55 50 L60 40 L65 50"
          stroke="#00ffcc"
          strokeWidth="4"
          fill="none"
        />
        <line
          x1="60"
          y1="40"
          x2="60"
          y2="65"
          stroke="#00ffcc"
          strokeWidth="4"
        />
      </svg>

      <span className="hidden md:block text-sm text-green-400 font-semibold ml-2">
        Research • Innovation • Solutions • Exchange
      </span>
    </div>
  );
};

export default RiseLogo;
