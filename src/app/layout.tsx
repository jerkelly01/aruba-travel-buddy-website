import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import RouteWrapper from "@/components/RouteWrapper";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Aruba Travel Buddy - Your Personal Travel Guide",
  description: "Discover the best of Aruba with personalized recommendations, offline maps, and smart itinerary planning - all in one app.",
  keywords: ["Aruba", "travel", "guide", "itinerary", "vacation", "tourism"],
  icons: {
    icon: [
      { url: '/favicon.ico?v=2', sizes: 'any' },
      { url: '/logo.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=2',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} ${playfair.variable}`}>
        <Providers>
          <AnalyticsTracker />
          <Navbar />
          <main className="pt-24">
            <RouteWrapper>{children}</RouteWrapper>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
