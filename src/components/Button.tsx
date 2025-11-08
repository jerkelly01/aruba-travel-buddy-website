import Link from 'next/link';
import React from 'react';
import Icon, { IconName } from './Icon';

type Props = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  type?: 'button' | 'submit' | 'reset';
};

export default function Button({
  href,
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  iconPosition = 'left',
  type = 'button',
}: Props) {
  const base = 'inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-[var(--brand-aruba)] relative overflow-hidden';
  
  const sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg',
  }[size];
  
  const variants = {
    primary: 'bg-gradient-to-r from-[var(--brand-aruba)] to-[var(--brand-aruba-light)] text-white shadow-lg shadow-[rgba(0,188,212,0.3)] hover:shadow-xl hover:shadow-[rgba(0,188,212,0.4)] hover:from-[var(--brand-aruba-dark)] hover:to-[var(--brand-aruba)]',
    secondary: 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-[var(--brand-aruba)] hover:text-[var(--brand-aruba)] shadow-md hover:shadow-lg',
    ghost: 'text-[var(--brand-aruba)] hover:text-[var(--brand-aruba-dark)] hover:bg-[rgba(0,188,212,0.1)]',
    outline: 'border-2 border-[var(--brand-aruba)] text-[var(--brand-aruba)] bg-transparent hover:bg-[var(--brand-aruba)] hover:text-white',
  }[variant];

  // Combine classes - className prop will override variant styles when using Tailwind's important modifier or specific classes
  const cls = `${base} ${sizes} ${variants} ${className}`.trim();

  const content = (
    <>
      {icon && iconPosition === 'left' && <Icon name={icon} className="w-5 h-5 mr-2" />}
      <span className="relative z-10">{children}</span>
      {icon && iconPosition === 'right' && <Icon name={icon} className="w-5 h-5 ml-2" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {content}
    </button>
  );
}
