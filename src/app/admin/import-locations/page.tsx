'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { mapLocationsApi } from '@/lib/admin-api';

// All locations from the app
const APP_LOCATIONS = [
  // Beaches (15)
  { id: 'eagle_beach', name: 'Eagle Beach', type: 'beach', category: 'beach', coordinate: { latitude: 12.550274875454315, longitude: -70.05704907038385 }, description: 'One of the most beautiful beaches in the world, known for its pristine white sand and calm waters.', address: 'Eagle Beach, Aruba', photos: ['local:eagle beach.png', 'local:eagle beach 1.png', 'local:eagle beach 2.png'] },
  { id: 'palm_beach', name: 'Palm Beach', type: 'beach', category: 'beach', coordinate: { latitude: 12.574383563420247, longitude: -70.04582323792525 }, description: 'Popular beach with water sports, resorts, and vibrant nightlife.', address: 'Hyatt Regency Aruba Resort, Palm Beach, Aruba', photos: ['local:palm beach.png', 'local:palm beach 1.png', 'local:palm beach 2.png'] },
  { id: 'arashi_beach', name: 'Arashi Beach', type: 'beach', category: 'beach', coordinate: { latitude: 12.610624798460535, longitude: -70.0534174774951 }, description: 'Great for snorkeling and diving with excellent underwater visibility.', address: 'Arashi Beach, Aruba', photos: ['local:Arashi Beach.png', 'local:arashi beach 1.png', 'local:arashi beach 2.png'] },
  { id: 'baby_beach', name: 'Baby Beach', type: 'beach', category: 'beach', coordinate: { latitude: 12.414492503272646, longitude: -69.88081181374633 }, description: 'Shallow waters perfect for families with children.', address: 'Baby Beach, Aruba', photos: ['local:baby beach aruba.png', 'local:baby beach 1.png', 'local:baby beach 2.png'] },
  { id: 'mangel_halto', name: 'Mangel Halto Beach', type: 'beach', category: 'beach', coordinate: { latitude: 12.464157254453244, longitude: -69.9693743897331 }, description: 'Secluded beach popular with locals, great for snorkeling.', address: 'Mangel Halto, Aruba', photos: ['local:mangel halto beach.png', 'local:mangel halto 1.png', 'local:mangel halto 2.png'] },
  { id: 'boca_catalina', name: 'Boca Catalina', type: 'beach', category: 'beach', coordinate: { latitude: 12.604505048606592, longitude: -70.0514888772983 }, description: 'Small, quiet beach perfect for snorkeling and relaxation.', address: 'Boca Catalina, Aruba', photos: ['local:boca catalina.png', 'local:boca catalina 1.png', 'local:boca catalina 2.png'] },
  { id: 'malmok_beach', name: 'Malmok Beach', type: 'beach', category: 'beach', coordinate: { latitude: 12.59737852089334, longitude: -70.04980323442956 }, description: 'Popular snorkeling beach with calm waters and abundant marine life.', address: 'Malmok, Aruba', photos: ['local:malmok beach aruba.png', 'local:malmok 1.png', 'local:malmok 2.png'] },
  { id: 'druif_beach', name: 'Druif Beach', type: 'beach', category: 'beach', coordinate: { latitude: 12.53155076567351, longitude: -70.0552460773203 }, description: 'Quiet beach between Eagle and Palm Beach, perfect for relaxation.', address: 'Druif Beach, Aruba', photos: ['local:druif beach 1.png', 'local:druif beach 2.png'] },
  { id: 'rodgers_beach', name: 'Rodgers Beach', type: 'beach', category: 'beach', coordinate: { latitude: 12.417704048620537, longitude: -69.88441130448008 }, description: 'Secluded beach on the east coast with dramatic cliffs and strong waves.', address: 'Rodgers Beach, Aruba', photos: ['local:rodgers beach aruba.png', 'local:rodgers beach 1.png', 'local:rodgers beach 2.png'] },
  { id: 'andicuri_beach', name: 'Andicuri Beach', type: 'beach', category: 'beach', coordinate: { latitude: 12.537493059758647, longitude: -69.95594991163237 }, description: 'Remote beach with strong waves, popular with surfers and bodyboarders.', address: 'Andicuri Beach, Aruba', photos: ['local:andicuri beach aruba.png', 'local:Andicuri Beach 1.png', 'local:Andicuri Beach 2.png'] },
  { id: 'dos_playa', name: 'Dos Playa', type: 'beach', category: 'beach', coordinate: { latitude: 12.504862472815688, longitude: -69.91800601313987 }, description: 'Two adjacent coves within Arikok National Park, great for hiking and photography.', address: 'Arikok National Park, Aruba', photos: ['local:dos playa aruba.png', 'local:dos playa 1.png', 'local:dos playa 2.png'] },
  { id: 'flamingo_beach', name: 'Flamingo Beach', type: 'beach', category: 'beach', coordinate: { latitude: 12.501184006994368, longitude: -70.02938747512418 }, description: 'Private beach on Renaissance Island famous for its resident pink flamingos.', address: 'Renaissance Island, Aruba', photos: ['local:flamingo beach aruba.png', 'local:flamingo beach 1.png', 'local:flamingo beach 2.png'] },
  { id: 'fishermans_hut_beach', name: 'Fisherman\'s Hut Beach', type: 'beach', category: 'beach', coordinate: { latitude: 12.585717666060098, longitude: -70.04606688648597 }, description: 'Popular beach known for windsurfing and kitesurfing with excellent wind conditions.', address: 'Hadicurari Beach, J.E. Irausquin Blvd, Noord, Aruba', photos: ['local:fishermans hut beach aruba.png', 'local:fisherman\'s hut beach 1.png', 'local:fisherman\'s hut beach 2.png'] },
  { id: 'savaneta_beach', name: 'Savaneta Beach', type: 'beach', category: 'beach', coordinate: { latitude: 12.45064485909309, longitude: -69.9536988751247 }, description: 'Historic fishing village beach with authentic local atmosphere.', address: 'Savaneta, Aruba', photos: ['local:savaneta beach aruba.png', 'local:savaneta beach 1.png', 'local:savaneta beach 2.png'] },
  { id: 'wariruri_beach', name: 'Wariruri Beach', type: 'beach', category: 'beach', coordinate: { latitude: 12.558868057547263, longitude: -69.988206857567 }, description: 'Remote beach with natural bridge formation and strong surf.', address: 'Wariruri Beach, Aruba', photos: ['local:wariruri beach aruba.png', 'local:wariruri beach 1.png', 'local:wariruri beach 2.png'] },
  
  // Cultural Spots (14)
  { id: 'california_lighthouse', name: 'California Lighthouse', type: 'culture', category: 'cultural_spot', coordinate: { latitude: 12.613806986563766, longitude: -70.05140167697627 }, description: 'Historic lighthouse built in 1910, offering panoramic views of the island.', address: 'California Lighthouse, Aruba', photos: ['local:california lighthouse aruba.png', 'local:california lighthouse 1.png', 'local:california lighthouse 2.png'] },
  { id: 'bushiribana_ruins', name: 'Bushiribana Gold Mill Ruins', type: 'culture', category: 'cultural_spot', coordinate: { latitude: 12.55374131752189, longitude: -69.97656767512365 }, description: 'Historic gold mill ruins from the 19th century gold rush era.', address: 'Bushiribana, Aruba', photos: ['local:bushiribana ruins aruba.png', 'local:Bushiri Gold Mill Ruins 1.png', 'local:Bushiri Gold Mill Ruins 2.png'] },
  { id: 'balashi_ruins', name: 'Balashi Gold Mill Ruins', type: 'culture', category: 'cultural_spot', coordinate: { latitude: 12.483637615579621, longitude: -69.97303427512443 }, description: 'Another historic gold mill site with well-preserved ruins.', address: 'Balashi, Aruba', photos: ['local:balashi gold mill ruins aruba.png', 'local:Balashi Gold Mill Ruins 1.png', 'local:Balashi Gold Mill Ruins 2.png'] },
  { id: 'numismatic_museum', name: 'Numismatic Museum', type: 'culture', category: 'cultural_spot', coordinate: { latitude: 12.520995632223459, longitude: -70.03986464980007 }, description: 'Museum showcasing Aruba\'s currency and coin history.', address: 'Oranjestad, Aruba', photos: ['local:numismatic museum aruba.png', 'local:Numismatic Museum 1.png', 'local:Numismatic Museum 2.png'] },
  { id: 'red_anchor', name: 'The Red Anchor', type: 'culture', category: 'cultural_spot', coordinate: { latitude: 12.434393308541278, longitude: -69.8768207616335 }, description: 'Iconic red anchor monument honoring Aruba\'s maritime heritage, popular photo spot.', address: 'San Nicolas, Aruba', photos: ['local:the red anchor aruba.png', 'local:The Red Anchor Aruba 1.png', 'local:The Red Anchor Aruba 2.png'] },
  { id: 'plaza_betico_croes', name: 'Plaza Betico Croes', type: 'culture', category: 'cultural_spot', coordinate: { latitude: 12.510250995824858, longitude: -70.0263628481413 }, description: 'Historic plaza honoring Gilberto François "Betico" Croes, pivotal figure in Aruba\'s autonomy.', address: 'Oranjestad, Aruba', photos: ['local:plaza betico croes aruba.png', 'local:Plaza Betico Croes 1.png', 'local:Plaza Betico Croes 2.png'] },
  { id: 'fort_zoutman', name: 'Fort Zoutman & Willem III Tower', type: 'culture', category: 'cultural_spot', coordinate: { latitude: 12.518008358829487, longitude: -70.0356648174516 }, description: 'Aruba\'s oldest structure (1798), now housing the Historical Museum with colonial artifacts.', address: 'Oranjestad, Aruba', photos: ['local:fort zoutman aruba.png', 'local:Fort Zoutman 1.png', 'local:Fort Zoutman 2.png'] },
  { id: 'alto_vista_chapel', name: 'Alto Vista Chapel', type: 'culture', category: 'cultural_spot', coordinate: { latitude: 12.576157516272943, longitude: -70.01095174628718 }, description: 'Historic chapel (1750) known as "Pilgrims Church," site of first Christian conversion on Aruba.', address: 'Alto Vista, Aruba', photos: ['local:alto vista chapel aruba.png', 'local:Alto Vista Chapel 1.png', 'local:Alto Vista Chapel 2.png'] },
  { id: 'national_archaeological_museum', name: 'National Archaeological Museum', type: 'culture', category: 'cultural_spot', coordinate: { latitude: 12.521262366157835, longitude: -70.03812647327094 }, description: 'Museum showcasing 5,000 years of Amerindian artifacts in historic Dutch Colonial building.', address: 'Oranjestad, Aruba', photos: ['local:national archaelogical museum aruba.png', 'local:national archaeological museum aruba 1.png', 'local:national archaeological museum aruba 2.png'] },
  { id: 'san_nicolas_art_murals', name: 'San Nicolas Art Murals', type: 'culture', category: 'cultural_spot', coordinate: { latitude: 12.436054432074318, longitude: -69.91075457539131 }, description: 'Street art capital of the Caribbean with vibrant murals by international artists since 2016.', address: 'San Nicolas, Aruba', photos: ['local:san nicolas art murals aruba.png', 'local:san nicolas art murals 1.png', 'local:san nicolas art murals 2.png'] },
  { id: 'museum_of_industry', name: 'Museum of Industry', type: 'culture', category: 'cultural_spot', coordinate: { latitude: 12.435937934113127, longitude: -69.90914366488958 }, description: 'Housed in restored water tower, showcasing Aruba\'s industrial history including gold mining and oil refining.', address: 'San Nicolas, Aruba', photos: ['local:musem of industry aruba.png', 'local:museum of industry aruba 1.png', 'local:museum of industry aruba 2.png'] },
  { id: 'eagle_refinery_main_office', name: 'Eagle Refinery Main Office', type: 'culture', category: 'cultural_spot', coordinate: { latitude: 12.53384455111749, longitude: -70.0532818414469 }, description: 'Historic building (1929) representing Aruba\'s oil refining history and economic development.', address: 'Oranjestad, Aruba', photos: ['local:eagle refinery main office.png', 'local:eagle refinery main office 1.png', 'local:eagle refinery main office 2.png'] },
  { id: 'addison_croes_merchants_house', name: 'Aruba Town Hall', type: 'culture', category: 'cultural_spot', coordinate: { latitude: 12.518819436740916, longitude: -70.03585290396023 }, description: 'Historic government building serving as the administrative center of Oranjestad and Aruba.', address: 'Oranjestad, Aruba', photos: ['local:aruba town hall.png', 'local:Aruba Town Hall 1.png', 'local:Aruba Town Hall 2.png'] },
  { id: 'sero_colorado_canons', name: 'Sero Colorado Canons', type: 'culture', category: 'cultural_spot', coordinate: { latitude: 12.418550789854441, longitude: -69.86910458762264 }, description: 'Historic canons from late 18th-early 19th century discovered in 1957, part of Sero Colorado Memorial with WWII bunker and lighthouse.', address: 'Sero Colorado, Aruba', photos: ['local:seroe colorado aruba.png', 'local:sero colorado canons 1.png', 'local:sero colorado canons 2.png'] },
  
  // Natural Wonders (13)
  { id: 'natural_pool', name: 'Natural Pool (Conchi)', type: 'eco', category: 'natural_wonder', coordinate: { latitude: 12.523859208548807, longitude: -69.93058983521186 }, description: 'Natural swimming pool formed by volcanic rock, accessible by 4WD.', address: 'Arikok National Park, Aruba', photos: ['local:natural pool aruba.png', 'local:natural pool aruba 1.png', 'local:natural pool aruba 2.png'] },
  { id: 'arikok_national_park', name: 'Arikok National Park', type: 'eco', category: 'natural_wonder', coordinate: { latitude: 12.499039606208482, longitude: -69.94642046163275 }, description: 'Protected natural area covering 18% of the island with diverse wildlife.', address: 'Arikok National Park, Aruba', photos: ['local:arikok national park aruba.png', 'local:arikok national park 1.png', 'local:arikok national park 2.png'] },
  { id: 'fontein_cave', name: 'Fontein Cave', type: 'eco', category: 'natural_wonder', coordinate: { latitude: 12.493198008190335, longitude: -69.90717360396053 }, description: 'Ancient cave with Arawak Indian drawings and unique limestone formations.', address: 'Arikok National Park, Aruba', photos: ['local:fontein cave.png', 'local:fontein cave 1.png', 'local:fontein cave 2.png'] },
  { id: 'quadiriki_cave', name: 'Quadiriki Cave', type: 'eco', category: 'natural_wonder', coordinate: { latitude: 12.482508941970917, longitude: -69.89986157697784 }, description: 'Twin caves with impressive stalactites and stalagmites, accessible by guided tour.', address: 'Arikok National Park, Aruba', photos: ['local:quadirikiri cave aruba.png', 'local:quadirikiri cave aruba 1.png', 'local:quadirikiri cave aruba 2.png'] },
  { id: 'huliba_cave', name: 'Huliba Cave', type: 'eco', category: 'natural_wonder', coordinate: { latitude: 12.472831578427812, longitude: -69.89662471930556 }, description: 'Known as the "Tunnel of Love" - a narrow cave passage with romantic legends.', address: 'Arikok National Park, Aruba', photos: ['local:huliba cave aruba.png', 'local:Huliba Cave 1.png', 'local:Huliba Cave 2.png'] },
  { id: 'natural_bridge', name: 'Natural Bridge', type: 'eco', category: 'natural_wonder', coordinate: { latitude: 12.472831578427812, longitude: -69.89662471930556 }, description: 'Historic limestone bridge that collapsed in 2005, with the nearby Baby Bridge still standing.', address: 'Santa Cruz, Aruba', photos: ['local:natural bridge aruba.png', 'local:Natural Bridge Aruba 1.png', 'local:Natural Bridge Aruba 2.png'] },
  { id: 'three_point_natural_bridge', name: 'Three Point Natural Bridge', type: 'eco', category: 'natural_wonder', coordinate: { latitude: 12.538131475815979, longitude: -69.95009608142075 }, description: 'Unique rock formation with three natural archways, perfect for photography.', address: 'Santa Cruz, Aruba', photos: ['local:three point bridge aruba.png', 'local:three point natural bridge aruba 1.png', 'local:three point natural bridge aruba 2.png'] },
  { id: 'boca_prins_sand_dunes', name: 'Boca Prins Sand Dunes', type: 'eco', category: 'natural_wonder', coordinate: { latitude: 12.497352150915525, longitude: -69.90755080112233 }, description: 'Stunning sand dunes in Arikok National Park, great for hiking and photography.', address: 'Arikok National Park, Aruba', photos: ['local:boca prins sand dunes.png', 'local:boca prins sand dunes aruba 1.png', 'local:boca prins sand dunes aruba 2.png'] },
  { id: 'black_rock_beach', name: 'Black Rock Beach', type: 'eco', category: 'natural_wonder', coordinate: { latitude: 12.538131475815979, longitude: -69.95009608142075 }, description: 'Unique beach with dark volcanic rocks contrasting against the white sand.', address: 'Santa Cruz, Aruba', photos: ['local:blackstone beach aruba.png', 'local:black rock beach aruba 1.png', 'local:black rock beach aruba 2.png'] },
  { id: 'ayo_rock_formations', name: 'Ayo Rock Formations', type: 'eco', category: 'natural_wonder', coordinate: { latitude: 12.53137179260238, longitude: -69.97072747267933 }, description: 'Massive boulders with ancient petroglyphs, offering scenic hiking trails.', address: 'Ayo, Aruba', photos: ['local:ayo rock formation aruba.png', 'local:ayo rock formation 1.png', 'local:ayo rock formation 2.png'] },
  { id: 'casibari_rock_formations', name: 'Casibari Rock Formations', type: 'eco', category: 'natural_wonder', coordinate: { latitude: 12.531267928027532, longitude: -69.9964103616325 }, description: 'Unique tonalite rock formations with trails leading to panoramic island views.', address: 'Casibari, Aruba', photos: ['local:casibari rock formation aruba.png', 'local:casibari rock formation aruba 1.png', 'local:casibari rock formation aruba 2.png'] },
  { id: 'hooiberg', name: 'Hooiberg (Haystack Mountain)', type: 'eco', category: 'natural_wonder', coordinate: { latitude: 12.517039308460657, longitude: -69.99446962173884 }, description: '165-meter volcanic formation with 600+ steps leading to 360-degree island views.', address: 'Paradera, Aruba', photos: ['local:hooiberg aruba.png', 'local:hooiberg aruba 1.png', 'local:hooiberg aruba 2.png'] },
  { id: 'yamanota_berg', name: 'Jamanota', type: 'eco', category: 'natural_wonder', coordinate: { latitude: 12.487730986272965, longitude: -69.94061708524627 }, description: 'Highest point in Aruba at 188 meters, offering challenging hiking and scenic vistas.', address: 'Jamanota, Aruba', photos: ['local:jamanota aruba.png', 'local:jamanota aruba 1.png', 'local:jamanota aruba 2.png'] },
];

function convertImagePaths(photos: string[] | undefined): string[] {
  if (!photos || !Array.isArray(photos)) return [];
  return photos.map(photo => {
    if (photo.startsWith('local:')) {
      const filename = photo.replace('local:', '').trim();
      // For now, use placeholder - images need to be uploaded separately
      return `/images/${filename}`;
    }
    return photo;
  });
}

export default function ImportLocationsPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: APP_LOCATIONS.length, success: 0, errors: 0 });
  const [errors, setErrors] = useState([]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleImport = async () => {
    if (!confirm(`Import ${APP_LOCATIONS.length} locations from the app?`)) return;

    setImporting(true);
    setProgress({ current: 0, total: APP_LOCATIONS.length, success: 0, errors: 0 });
    setErrors([]);

    for (let i = 0; i < APP_LOCATIONS.length; i++) {
      const location = APP_LOCATIONS[i];
      try {
        const images = convertImagePaths(location.photos);

        const locationData = {
          name: location.name,
          description: location.description || '',
          category: location.category as 'beach' | 'cultural_spot' | 'natural_wonder' | 'restaurant' | 'local_shop' | 'club_bar' | 'hotel' | 'activity',
          images: images,
          location: location.address || '',
          latitude: location.coordinate.latitude,
          longitude: location.coordinate.longitude,
          address: location.address || '',
          contact_info: {},
          opening_hours: {},
          featured: false,
          active: true,
          display_order: 0,
        };

        const response = await mapLocationsApi.create(locationData);

        if (response.success) {
          setProgress(prev => ({ ...prev, current: i + 1, success: prev.success + 1 }));
        } else {
          const errorMsg = response.error || 'Unknown error';
          setErrors(prev => [...prev, { name: location.name, error: errorMsg }]);
          setProgress(prev => ({ ...prev, current: i + 1, errors: prev.errors + 1 }));
        }
      } catch (error) {
        setErrors(prev => [...prev, { name: location.name, error: error.message }]);
        setProgress(prev => ({ ...prev, current: i + 1, errors: prev.errors + 1 }));
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setImporting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Import Locations from App</h1>
          <p className="text-gray-600">Import all {APP_LOCATIONS.length} locations from the mobile app into the website database.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Location Summary</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Beaches: {APP_LOCATIONS.filter(l => l.category === 'beach').length}</li>
              <li>Cultural Spots: {APP_LOCATIONS.filter(l => l.category === 'cultural_spot').length}</li>
              <li>Natural Wonders: {APP_LOCATIONS.filter(l => l.category === 'natural_wonder').length}</li>
              <li>Total: {APP_LOCATIONS.length} locations</li>
            </ul>
          </div>

          {importing && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progress: {progress.current} / {progress.total}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round((progress.current / progress.total) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-600">
                ✅ Success: {progress.success} | ❌ Errors: {progress.errors}
              </div>
            </div>
          )}

          {!importing && progress.current > 0 && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Import Complete!</h3>
              <p className="text-sm text-green-700">
                Successfully imported {progress.success} locations. {progress.errors > 0 && `${progress.errors} errors occurred.`}
              </p>
            </div>
          )}

          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">Errors ({errors.length})</h3>
              <ul className="text-sm text-red-700 space-y-1 max-h-40 overflow-y-auto">
                {errors.map((e, i) => (
                  <li key={i}>• {e.name}: {e.error}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleImport}
            disabled={importing}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {importing ? 'Importing...' : `Import ${APP_LOCATIONS.length} Locations`}
          </button>
        </div>
      </div>
    </div>
  );
}

