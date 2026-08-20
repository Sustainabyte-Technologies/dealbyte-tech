'use client';

import React from 'react';

interface FullPageWatermarkProps {
  opacity?: number;
  size?: string; // e.g. '700px' or '60%'
  className?: string;
  isTransparent?: boolean;
}

export default function FullPageWatermark({
  opacity = 0.08,
  size = '650px',
  className = '',
  isTransparent = true,
}: FullPageWatermarkProps) {
  const bgUrl = isTransparent ? '/watermark-transparent.png' : '/watermark-logo.png';

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden print:hidden ${className}`}
      aria-hidden="true"
    >
      <div
        className="w-full h-full bg-center bg-no-repeat transition-all duration-500"
        style={{
          backgroundImage: `url('${bgUrl}')`,
          backgroundSize: size,
          opacity: opacity,
        }}
      />
    </div>
  );
}
