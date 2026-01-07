'use client';

import Image from 'next/image';
import Link from 'next/link';
import Icon from './Icon';

interface LocationCardProps {
  location: {
    id: string;
    name: string;
    description?: string;
    images?: string[];
    address?: string;
    location?: string;
    contact_info?: {
      phone?: string;
      website?: string;
    };
    featured?: boolean;
  };
}

export default function LocationCard({ location }: LocationCardProps) {
  const imageUrl = location.images && location.images.length > 0 
    ? location.images[0] 
    : '/ChatGPT Image Oct 16, 2025 at 09_43_31 PM copy.png';
  
  const address = location.address || location.location || '';

  return (
    <Link href={`/explore-aruba/location/${location.id}`}>
      <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-full">
        <div className="relative h-56 overflow-hidden">
          <Image
            src={imageUrl}
            alt={location.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          {location.featured && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-yellow-400/90 backdrop-blur-sm text-sm font-semibold text-gray-900">
                Featured
              </span>
            </div>
          )}
        </div>
        <div className="p-6 bg-white">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--brand-aruba)] transition-colors duration-200 font-display line-clamp-2">
            {location.name}
          </h3>
          {location.description && (
            <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
              {location.description}
            </p>
          )}
          {address && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <Icon name="map-pin" className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{address}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

