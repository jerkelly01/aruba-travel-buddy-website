import React from 'react';

export const metadata = {
  title: 'Taxi Fare Calculator | Aruba Travel Buddy',
  description: 'Calculate your official Aruba taxi fares easily.',
};

export default function TaxiFarePage() {
  return (
    <div className="h-[calc(100vh-96px)] w-full">
      <iframe 
        src="https://www.taxi.aw/"
        className="w-full h-full border-0 block"
        style={{ display: 'block' }}
        title="Aruba Official Taxi Fare Calculator"
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}
