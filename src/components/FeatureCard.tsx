import React from 'react';
import Icon, { IconName } from './Icon';

type Props = {
  icon: IconName;
  title: string;
  description: string;
  highlights?: string[];
};

export default function FeatureCard({ icon, title, description, highlights }: Props) {
  return (
    <div className="relative bg-white rounded-xl p-8 shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow h-full">
      <div className="absolute -inset-px rounded-xl pointer-events-none opacity-40" style={{background: 'linear-gradient(135deg, var(--brand-sun) 0%, transparent 30%, var(--brand-wave) 70%, transparent 100%)'}} />
      <div className="relative flex items-center justify-center w-12 h-12 rounded-lg mb-6 bg-[var(--brand-wave)]/10 text-[var(--brand-wave)]">
        <Icon name={icon} className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 font-display">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
      {highlights && highlights.length > 0 && (
        <ul className="mt-4 space-y-2">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex items-start text-gray-600 text-sm">
              <Icon name="check" className="mt-0.5 mr-2 w-4 h-4 text-[var(--brand-wave)]" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
