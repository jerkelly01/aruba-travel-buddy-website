"use client";

import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import Image from "next/image";

export default function B25CraftMediterraneanPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="A Hidden Mediterranean Gem in Noord: B25 Craft Mediterranean"
            subtitle="Discover an intimate craft cocktail bar and tapas restaurant tucked away in Bakval, Noord."
            center
          />
        </Container>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            {/* Desktop Banner */}
            <div className="relative w-full h-[400px] mb-8 rounded-2xl overflow-hidden shadow-lg hidden sm:block">
              <Image 
                src="/b25-craft-mediterranean.png" 
                alt="B25 Craft Mediterranean" 
                fill 
                className="object-cover" 
              />
            </div>

            {/* Mobile Banner */}
            <div className="flex justify-center mb-8 sm:hidden">
              <Image 
                src="/b25-banner-mobile.jpg" 
                alt="B25 Craft Mediterranean Interior" 
                width={800}
                height={800}
                className="w-full h-auto rounded-2xl shadow-lg object-contain" 
              />
            </div>

            <p className="text-gray-700 leading-relaxed mb-8">
              Aruba is full of great places to eat, but every now and then you find a restaurant that feels different from the usual tourist experience. B25 Craft Mediterranean, located inside the Aruba Racquet Club in Bakval, Noord, is one of those places.
              <br /><br />
              Just a 5-minute drive from the hotel area, B25 offers a cozy and stylish escape with great food, craft cocktails, and a concept that stands out from the moment you walk in.
            </p>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">A Unique Setting with Character</h2>
                <p className="text-gray-700 leading-relaxed">
                  B25 is not just another restaurant. The space brings together an intimate craft cocktail bar with a classic 1920s-inspired feel, blended beautifully with a mid-1930s Cuban-style seating atmosphere in the restaurant area. The result is a warm, elegant, and relaxed setting that feels both vintage and fresh.
                  <br /><br />
                  With both indoor and outdoor seating, the restaurant works perfectly for a date night, dinner with friends, or a more elevated local dining experience away from the busy hotel strip. The ambiance is cozy, the vibe is smooth, and the staff makes the experience even better with attentive and welcoming service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Mediterranean Tapas with Big Flavor</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  The menu focuses on a Mediterranean tapas-style concept, making it ideal for sharing and trying different flavors throughout the evening. The dishes are creative, flavorful, and well-balanced, with enough variety to keep the table excited from start to finish.
                </p>

                <ul className="text-gray-700 space-y-2 mb-4">
                  <li>• <strong>Levant Trio:</strong> A flavorful introduction to the Mediterranean style of the menu. It is the kind of dish that immediately sets the tone for the rest of the meal.</li>
                  <li>• <strong>Panko-Crusted Halloumi Cheese:</strong> Brings the perfect contrast of crispy texture and rich, salty cheese. It is simple, but done in a way that makes it memorable.</li>
                  <li>• <strong>Marinated Beets:</strong> Worth ordering. They bring freshness, color, and depth to the table, proving that even a lighter dish can be packed with flavor.</li>
                </ul>
              </div>

              <div>
                <div className="flex justify-center mb-8">
                  <Image 
                    src="/b25-tapas.png" 
                    alt="Mediterranean Tapas including Levant Trio and Marinated Beets" 
                    width={500}
                    height={500}
                    className="w-full max-w-sm h-auto rounded-2xl shadow-lg object-contain" 
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">The Main Course You Should Not Skip</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  For the main part of the meal, the <strong>Fattoush Chicken Schnitzel</strong> is a strong choice. It combines comfort, crunch, and Mediterranean brightness in a way that feels familiar but still unique.
                  <br /><br />
                  The true standout, though, is the <strong>Kebab with a side of Saffron Sour Cherry Rice</strong>. This dish feels like a complete course on its own. The kebab is flavorful, while the saffron sour cherry rice adds something unexpected, aromatic, and unique. It is not the kind of side dish you forget. It elevates the entire plate.
                </p>

                <div className="flex justify-center mb-8">
                  <Image 
                    src="/b25-rice.jpg" 
                    alt="Saffron Sour Cherry Rice" 
                    width={500}
                    height={500}
                    className="w-full max-w-sm h-auto rounded-2xl shadow-lg object-contain" 
                  />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Save Room for Dessert</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  No dinner at B25 is complete without trying the <strong>Baklava Cheesecake</strong>.
                  <br /><br />
                  This dessert is easily one of the most unique and best-tasting desserts on the island. It brings together the richness of cheesecake with the sweet, nutty, layered flavor of baklava. It is creative, indulgent, and the perfect ending to the meal.
                </p>

                <div className="flex justify-center mb-8">
                  <Image 
                    src="/b25-cheesecake.jpg" 
                    alt="Baklava Cheesecake" 
                    width={500}
                    height={500}
                    className="w-full max-w-sm h-auto rounded-2xl shadow-lg object-contain" 
                  />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cocktails That Match the Concept</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  B25 also takes its cocktails seriously. The drink menu fits perfectly with the atmosphere: stylish, fun, and crafted with personality.
                </p>

                <ul className="text-gray-700 space-y-2 mb-4">
                  <li>• <strong>“Dude, Where’s My Car?”:</strong> The name already gets your attention, but the drink itself delivers. It is the kind of cocktail that makes you understand the joke, because after one, you may seriously consider forgetting the car and ordering another.</li>
                  <li>• <strong>“Fool Me Once”:</strong> A cocktail that keeps the experience playful while still feeling refined.</li>
                </ul>
                <p className="text-gray-600 italic">The drinks are not just an add-on here. They are part of the full B25 experience.</p>
              </div>

              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 justify-items-center">
                  <Image 
                    src="/dude-wheres-my-car.png" 
                    alt="Dude Where's My Car Cocktail" 
                    width={400}
                    height={600}
                    className="w-full max-w-xs h-auto rounded-2xl shadow-lg object-contain" 
                  />
                  <Image 
                    src="/fool-me-once.png" 
                    alt="Fool Me Once Cocktail" 
                    width={400}
                    height={600}
                    className="w-full max-w-xs h-auto rounded-2xl shadow-lg object-contain" 
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Final Thoughts</h2>
                <p className="text-gray-700 leading-relaxed">
                  B25 Craft Mediterranean is a strong recommendation for anyone looking for something different in Aruba. It has the food, the cocktails, the atmosphere, and the service to make the night feel special.
                  <br /><br />
                  It is close enough to the hotel area to be convenient, but tucked away enough to feel like a hidden local recommendation. From the Mediterranean tapas to the craft cocktails and cozy vintage-inspired ambiance, B25 offers a complete dining experience that deserves attention.
                  <br /><br />
                  For your next night out in Aruba, make the short drive to B25 Craft Mediterranean inside Aruba Racquet Club and come hungry. This is one of those places where you should order several plates, share everything, and let the flavors do the talking.
                </p>

                <div className="mt-8 max-w-md mx-auto bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Operating Hours</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex justify-between"><span>Monday</span> <span className="font-medium text-red-500">Closed</span></li>
                    <li className="flex justify-between"><span>Tuesday</span> <span className="font-medium">5:00 PM – 11:00 PM</span></li>
                    <li className="flex justify-between"><span>Wednesday</span> <span className="font-medium">5:00 PM – 11:00 PM</span></li>
                    <li className="flex justify-between"><span>Thursday</span> <span className="font-medium">5:00 PM – 11:00 PM</span></li>
                    <li className="flex justify-between"><span>Friday</span> <span className="font-medium">5:00 PM – 11:00 PM</span></li>
                    <li className="flex justify-between"><span>Saturday</span> <span className="font-medium">5:00 PM – 11:00 PM</span></li>
                    <li className="flex justify-between"><span>Sunday</span> <span className="font-medium text-red-500">Closed</span></li>
                  </ul>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=B25+Craft+Mediterranean+Aruba+Racquet+Club" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
                  >
                    📍 Get Directions to B25
                  </a>
                  <a 
                    href="/download" 
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-600 bg-white border-2 border-blue-600 hover:bg-blue-50 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
                  >
                    📱 Download Aruba Travel Buddy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
