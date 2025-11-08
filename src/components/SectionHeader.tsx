import React from 'react';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
  titleClassName?: string;
};

export default function SectionHeader({ 
  eyebrow, 
  title, 
  subtitle, 
  center = true, 
  className = '', 
  titleClassName = '' 
}: Props) {
  return (
    <div className={`mb-16 ${center ? 'text-center' : ''} ${className}`}>
      {eyebrow && (
        <span
          className={`${center ? 'mx-auto' : ''} inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase bg-gradient-to-r from-[var(--brand-aruba)]/10 to-[var(--brand-amber)]/10 text-[var(--brand-aruba)] border border-[var(--brand-aruba)]/20 mb-4`}
        >
          {eyebrow}
        </span>
      )}
      <h2 className={`mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 font-display leading-tight ${titleClassName}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-6 text-xl text-gray-600 leading-relaxed ${center ? 'mx-auto max-w-3xl' : ''}`}>
          {subtitle}
        </p>
      )}
      {center && (
        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-[var(--brand-aruba)] via-[var(--brand-amber)] to-[var(--brand-aruba)]" />
      )}
    </div>
  );
}
