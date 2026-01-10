'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Icon } from './Icon';

interface SafeImageProps {
  src: string | string[] | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  fallbackIcon?: string;
}

/**
 * SafeImage component that handles image loading errors gracefully
 * Uses unoptimized Next.js Image to bypass domain restrictions
 */
export function SafeImage({ 
  src, 
  alt, 
  fill = false, 
  width, 
  height, 
  className = '',
  fallbackIcon = 'image'
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Get the first image from array if it's an array
  React.useEffect(() => {
    if (Array.isArray(src)) {
      setImageSrc(src.length > 0 ? src[0] : null);
    } else {
      setImageSrc(src || null);
    }
    setHasError(false);
  }, [src]);

  // If no image source or error, show placeholder
  if (!imageSrc || hasError) {
    if (fill) {
      return (
        <div className={`absolute inset-0 bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-tropical)] flex items-center justify-center ${className}`}>
          <Icon name={fallbackIcon as any} className="w-16 h-16 text-white opacity-50" />
        </div>
      );
    }
    return (
      <div className={`w-full h-full bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-tropical)] flex items-center justify-center ${className}`} style={{ width, height }}>
        <Icon name={fallbackIcon as any} className="w-16 h-16 text-white opacity-50" />
      </div>
    );
  }

  // Use Next.js Image with unoptimized to bypass domain restrictions
  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        unoptimized={true}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width || 400}
      height={height || 300}
      className={className}
      unoptimized={true}
      onError={() => setHasError(true)}
    />
  );
}
