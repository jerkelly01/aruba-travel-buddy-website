import React from 'react';

export const metadata = {
  title: 'Taxi Fare Calculator | Aruba Travel Buddy',
  description: 'Calculate your official Aruba taxi fares easily.',
};

export default function TaxiFarePage() {
  return (
    <div className="fixed inset-0 pt-24 bg-white z-0">
      <iframe 
        src="https://www.taxi.aw/"
        className="w-full h-full border-0"
        title="Aruba Official Taxi Fare Calculator"
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}
