import React from 'react';

export const metadata = {
  title: 'Taxi Fare Calculator | Aruba Travel Buddy',
  description: 'Calculate your official Aruba taxi fares easily.',
};

export default function TaxiFarePage() {
  return (
    <div className="h-screen w-full pt-24 bg-gray-50 flex flex-col">
      <div className="flex-1 w-full h-full">
        <iframe 
          src="https://www.taxi.aw/"
          className="w-full h-full border-0"
          title="Aruba Official Taxi Fare Calculator"
          loading="lazy"
          allowFullScreen
        />
      </div>
    </div>
  );
}
