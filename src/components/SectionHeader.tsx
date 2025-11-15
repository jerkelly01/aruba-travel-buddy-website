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
  dividerClassName?: string;
};

export default function SectionHeader({ 
  eyebrow, 
  title, 
  subtitle, 
  center = true, 
  compact = false,
  className = '', 
  titleClassName = '',
  subtitleClassName = '',
  dividerClassName = ''
}: Props) {
  const wrapperClassName = `${compact ? 'mb-0' : 'mb-4'} ${center ? 'text-center' : ''} ${className}`;
  const titleSizeClasses = compact 
    ? 'mt-0 text-base sm:text-lg lg:text-2xl' 
    : 'mt-1 text-2xl sm:text-3xl lg:text-4xl';
  const subtitleSpacingClasses = compact ? 'mt-0 text-xs sm:text-sm' : 'mt-2 text-base';
  const dividerSizingClasses = compact ? 'mt-1 w-12' : 'mt-2 w-16';

  return (
    <div className={wrapperClassName}>
      {eyebrow && (
        <span
          className={`${center ? 'mx-auto' : ''} inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase bg-gradient-to-r from-[var(--brand-aruba)]/10 to-[var(--brand-amber)]/10 text-[var(--brand-aruba)] border border-[var(--brand-aruba)]/20 mb-2`}
        >
          {eyebrow}
        </span>
      )}
      <h2 className={`${titleSizeClasses} font-bold text-gray-900 font-display leading-tight ${titleClassName}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`${subtitleSpacingClasses} text-gray-600 leading-relaxed ${center ? 'mx-auto max-w-3xl' : ''} ${subtitleClassName}`}>
          {subtitle}
        </p>
      )}
      {center && (
        <div className={`mx-auto ${dividerSizingClasses} h-1 rounded-full bg-gradient-to-r from-[var(--brand-aruba)] via-[var(--brand-amber)] to-[var(--brand-aruba)] ${dividerClassName}`} />
      )}
    </div>
  );
}
