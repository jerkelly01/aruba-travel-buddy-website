import React from 'react';

export const metadata = {
  title: 'Taxi Fare Calculator | Aruba Travel Buddy',
  description: 'Calculate your official Aruba taxi fares easily.',
};

export default function TaxiFarePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-24">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[var(--brand-aruba)] to-[var(--brand-aruba-light)] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-shadow-sm">
            Taxi Fare Calculator
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-medium">
            Calculate your official Aruba taxi fares instantly using the official government rates.
          </p>
        </div>
      </div>

      {/* Main Content - Iframe */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-200px)]">
        <div className="w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <iframe 
            src="https://www.taxi.aw/"
            className="w-full h-full border-0"
            title="Aruba Official Taxi Fare Calculator"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
