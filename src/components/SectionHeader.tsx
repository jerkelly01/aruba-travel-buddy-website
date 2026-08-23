import React from 'react';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  compact?: boolean;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export default function SectionHeader({ 
  eyebrow, 
  title, 
  subtitle, 
  center = true, 
  compact = false,
  className = '', 
  titleClassName = '',
  subtitleClassName = ''
}: Props) {
  const wrapperClassName = `flex flex-col ${compact ? 'mb-8' : 'mb-16'} ${center ? 'items-center text-center' : 'items-start text-left'} ${className}`;
  
  const titleSizeClasses = compact 
    ? 'text-2xl sm:text-3xl' 
    : 'text-4xl sm:text-5xl';
    
  const subtitleSpacingClasses = compact ? 'text-base' : 'text-lg';

  return (
    <div className={wrapperClassName}>
      {eyebrow && (
        <p className={`text-[var(--brand-aruba)] font-bold uppercase tracking-widest text-sm mb-2`}>
          {eyebrow}
        </p>
      )}
      
      <h2 className={`${titleSizeClasses} font-black text-gray-900 mb-6 font-display tracking-tight ${titleClassName}`}>
        {title}
      </h2>
      
      {subtitle && (
        <p className={`${subtitleSpacingClasses} text-gray-600 font-medium leading-relaxed ${center ? 'mx-auto max-w-2xl' : 'max-w-2xl'} ${subtitleClassName}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
