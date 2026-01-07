/**
 * Script to import all locations from the app into the website database
 * Run with: npx tsx scripts/import-locations.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Location data extracted from arubaLocationsService.ts
const APP_LOCATIONS = [
  // Beaches
  {
    id: 'eagle_beach',
    name: 'Eagle Beach',
    type: 'beach',
    category: 'beach',
    coordinate: { latitude: 12.550274875454315, longitude: -70.05704907038385 },
    description: 'One of the most beautiful beaches in the world, known for its pristine white sand and calm waters.',
    address: 'Eagle Beach, Aruba',
    photos: ['local:eagle beach.png', 'local:eagle beach 1.png', 'local:eagle beach 2.png'],
  },
  {
    id: 'palm_beach',
    name: 'Palm Beach',
    type: 'beach',
    category: 'beach',
    coordinate: { latitude: 12.574383563420247, longitude: -70.04582323792525 },
    description: 'Popular beach with water sports, resorts, and vibrant nightlife.',
    address: 'Hyatt Regency Aruba Resort, Palm Beach, Aruba',
    photos: ['local:palm beach.png', 'local:palm beach 1.png', 'local:palm beach 2.png'],
  },
  {
    id: 'arashi_beach',
    name: 'Arashi Beach',
    type: 'beach',
    category: 'beach',
    coordinate: { latitude: 12.610624798460535, longitude: -70.0534174774951 },
    description: 'Great for snorkeling and diving with excellent underwater visibility.',
    address: 'Arashi Beach, Aruba',
    photos: ['local:Arashi Beach.png', 'local:arashi beach 1.png', 'local:arashi beach 2.png'],
  },
  {
    id: 'baby_beach',
    name: 'Baby Beach',
    type: 'beach',
    category: 'beach',
    coordinate: { latitude: 12.414492503272646, longitude: -69.88081181374633 },
    description: 'Shallow waters perfect for families with children.',
    address: 'Baby Beach, Aruba',
    photos: ['local:baby beach aruba.png', 'local:baby beach 1.png', 'local:baby beach 2.png'],
  },
  {
    id: 'mangel_halto',
    name: 'Mangel Halto Beach',
    type: 'beach',
    category: 'beach',
    coordinate: { latitude: 12.464157254453244, longitude: -69.9693743897331 },
    description: 'Secluded beach popular with locals, great for snorkeling.',
    address: 'Mangel Halto, Aruba',
    photos: ['local:mangel halto beach.png', 'local:mangel halto 1.png', 'local:mangel halto 2.png'],
  },
  {
    id: 'boca_catalina',
    name: 'Boca Catalina',
    type: 'beach',
    category: 'beach',
    coordinate: { latitude: 12.604505048606592, longitude: -70.0514888772983 },
    description: 'Small, quiet beach perfect for snorkeling and relaxation.',
    address: 'Boca Catalina, Aruba',
    photos: ['local:boca catalina.png', 'local:boca catalina 1.png', 'local:boca catalina 2.png'],
  },
  {
    id: 'malmok_beach',
    name: 'Malmok Beach',
    type: 'beach',
    category: 'beach',
    coordinate: { latitude: 12.59737852089334, longitude: -70.04980323442956 },
    description: 'Popular snorkeling beach with calm waters and abundant marine life.',
    address: 'Malmok, Aruba',
    photos: ['local:malmok beach aruba.png', 'local:malmok 1.png', 'local:malmok 2.png'],
  },
  {
    id: 'druif_beach',
    name: 'Druif Beach',
    type: 'beach',
    category: 'beach',
    coordinate: { latitude: 12.53155076567351, longitude: -70.0552460773203 },
    description: 'Quiet beach between Eagle and Palm Beach, perfect for relaxation.',
    address: 'Druif Beach, Aruba',
    photos: ['local:druif beach 1.png', 'local:druif beach 2.png'],
  },
  {
    id: 'rodgers_beach',
    name: 'Rodgers Beach',
    type: 'beach',
    category: 'beach',
    coordinate: { latitude: 12.417704048620537, longitude: -69.88441130448008 },
    description: 'Secluded beach on the east coast with dramatic cliffs and strong waves.',
    address: 'Rodgers Beach, Aruba',
    photos: ['local:rodgers beach aruba.png', 'local:rodgers beach 1.png', 'local:rodgers beach 2.png'],
  },
  {
    id: 'andicuri_beach',
    name: 'Andicuri Beach',
    type: 'beach',
    category: 'beach',
    coordinate: { latitude: 12.537493059758647, longitude: -69.95594991163237 },
    description: 'Remote beach with strong waves, popular with surfers and bodyboarders.',
    address: 'Andicuri Beach, Aruba',
    photos: ['local:andicuri beach aruba.png', 'local:Andicuri Beach 1.png', 'local:Andicuri Beach 2.png'],
  },
  {
    id: 'dos_playa',
    name: 'Dos Playa',
    type: 'beach',
    category: 'beach',
    coordinate: { latitude: 12.504862472815688, longitude: -69.91800601313987 },
    description: 'Two adjacent coves within Arikok National Park, great for hiking and photography.',
    address: 'Arikok National Park, Aruba',
    photos: ['local:dos playa aruba.png', 'local:dos playa 1.png', 'local:dos playa 2.png'],
  },
  {
    id: 'flamingo_beach',
    name: 'Flamingo Beach',
    type: 'beach',
    category: 'beach',
    coordinate: { latitude: 12.501184006994368, longitude: -70.02938747512418 },
    description: 'Private beach on Renaissance Island famous for its resident pink flamingos.',
    address: 'Renaissance Island, Aruba',
    photos: ['local:flamingo beach aruba.png', 'local:flamingo beach 1.png', 'local:flamingo beach 2.png'],
  },
  {
    id: 'fishermans_hut_beach',
    name: 'Fisherman\'s Hut Beach',
    type: 'beach',
    category: 'beach',
    coordinate: { latitude: 12.585717666060098, longitude: -70.04606688648597 },
    description: 'Popular beach known for windsurfing and kitesurfing with excellent wind conditions.',
    address: 'Hadicurari Beach, J.E. Irausquin Blvd, Noord, Aruba',
    photos: ['local:fishermans hut beach aruba.png', 'local:fisherman\'s hut beach 1.png', 'local:fisherman\'s hut beach 2.png'],
  },
  {
    id: 'savaneta_beach',
    name: 'Savaneta Beach',
    type: 'beach',
    category: 'beach',
    coordinate: { latitude: 12.45064485909309, longitude: -69.9536988751247 },
    description: 'Historic fishing village beach with authentic local atmosphere.',
    address: 'Savaneta, Aruba',
    photos: ['local:savaneta beach aruba.png', 'local:savaneta beach 1.png', 'local:savaneta beach 2.png'],
  },
  {
    id: 'wariruri_beach',
    name: 'Wariruri Beach',
    type: 'beach',
    category: 'beach',
    coordinate: { latitude: 12.558868057547263, longitude: -69.988206857567 },
    description: 'Remote beach with natural bridge formation and strong surf.',
    address: 'Wariruri Beach, Aruba',
    photos: ['local:wariruri beach aruba.png', 'local:wariruri beach 1.png', 'local:wariruri beach 2.png'],
  },

  // Cultural Spots
  {
    id: 'california_lighthouse',
    name: 'California Lighthouse',
    type: 'culture',
    category: 'cultural_spot',
    coordinate: { latitude: 12.613806986563766, longitude: -70.05140167697627 },
    description: 'Historic lighthouse built in 1910, offering panoramic views of the island.',
    address: 'California Lighthouse, Aruba',
    photos: ['local:california lighthouse aruba.png', 'local:california lighthouse 1.png', 'local:california lighthouse 2.png'],
  },
  {
    id: 'bushiribana_ruins',
    name: 'Bushiribana Gold Mill Ruins',
    type: 'culture',
    category: 'cultural_spot',
    coordinate: { latitude: 12.55374131752189, longitude: -69.97656767512365 },
    description: 'Historic gold mill ruins from the 19th century gold rush era.',
    address: 'Bushiribana, Aruba',
    photos: ['local:bushiribana ruins aruba.png', 'local:Bushiri Gold Mill Ruins 1.png', 'local:Bushiri Gold Mill Ruins 2.png'],
  },
  {
    id: 'balashi_ruins',
    name: 'Balashi Gold Mill Ruins',
    type: 'culture',
    category: 'cultural_spot',
    coordinate: { latitude: 12.483637615579621, longitude: -69.97303427512443 },
    description: 'Another historic gold mill site with well-preserved ruins.',
    address: 'Balashi, Aruba',
    photos: ['local:balashi gold mill ruins aruba.png', 'local:Balashi Gold Mill Ruins 1.png', 'local:Balashi Gold Mill Ruins 2.png'],
  },
  {
    id: 'numismatic_museum',
    name: 'Numismatic Museum',
    type: 'culture',
    category: 'cultural_spot',
    coordinate: { latitude: 12.520995632223459, longitude: -70.03986464980007 },
    description: 'Museum showcasing Aruba\'s currency and coin history.',
    address: 'Oranjestad, Aruba',
    photos: ['local:numismatic museum aruba.png', 'local:Numismatic Museum 1.png', 'local:Numismatic Museum 2.png'],
  },
  {
    id: 'red_anchor',
    name: 'The Red Anchor',
    type: 'culture',
    category: 'cultural_spot',
    coordinate: { latitude: 12.434393308541278, longitude: -69.8768207616335 },
    description: 'Iconic red anchor monument honoring Aruba\'s maritime heritage, popular photo spot.',
    address: 'San Nicolas, Aruba',
    photos: ['local:the red anchor aruba.png', 'local:The Red Anchor Aruba 1.png', 'local:The Red Anchor Aruba 2.png'],
  },
  {
    id: 'plaza_betico_croes',
    name: 'Plaza Betico Croes',
    type: 'culture',
    category: 'cultural_spot',
    coordinate: { latitude: 12.510250995824858, longitude: -70.0263628481413 },
    description: 'Historic plaza honoring Gilberto François "Betico" Croes, pivotal figure in Aruba\'s autonomy.',
    address: 'Oranjestad, Aruba',
    photos: ['local:plaza betico croes aruba.png', 'local:Plaza Betico Croes 1.png', 'local:Plaza Betico Croes 2.png'],
  },
  {
    id: 'fort_zoutman',
    name: 'Fort Zoutman & Willem III Tower',
    type: 'culture',
    category: 'cultural_spot',
    coordinate: { latitude: 12.518008358829487, longitude: -70.0356648174516 },
    description: 'Aruba\'s oldest structure (1798), now housing the Historical Museum with colonial artifacts.',
    address: 'Oranjestad, Aruba',
    photos: ['local:fort zoutman aruba.png', 'local:Fort Zoutman 1.png', 'local:Fort Zoutman 2.png'],
  },
  {
    id: 'alto_vista_chapel',
    name: 'Alto Vista Chapel',
    type: 'culture',
    category: 'cultural_spot',
    coordinate: { latitude: 12.576157516272943, longitude: -70.01095174628718 },
    description: 'Historic chapel (1750) known as "Pilgrims Church," site of first Christian conversion on Aruba.',
    address: 'Alto Vista, Aruba',
    photos: ['local:alto vista chapel aruba.png', 'local:Alto Vista Chapel 1.png', 'local:Alto Vista Chapel 2.png'],
  },
  {
    id: 'national_archaeological_museum',
    name: 'National Archaeological Museum',
    type: 'culture',
    category: 'cultural_spot',
    coordinate: { latitude: 12.521262366157835, longitude: -70.03812647327094 },
    description: 'Museum showcasing 5,000 years of Amerindian artifacts in historic Dutch Colonial building.',
    address: 'Oranjestad, Aruba',
    photos: ['local:national archaelogical museum aruba.png', 'local:national archaeological museum aruba 1.png', 'local:national archaeological museum aruba 2.png'],
  },
  {
    id: 'san_nicolas_art_murals',
    name: 'San Nicolas Art Murals',
    type: 'culture',
    category: 'cultural_spot',
    coordinate: { latitude: 12.436054432074318, longitude: -69.91075457539131 },
    description: 'Street art capital of the Caribbean with vibrant murals by international artists since 2016.',
    address: 'San Nicolas, Aruba',
    photos: ['local:san nicolas art murals aruba.png', 'local:san nicolas art murals 1.png', 'local:san nicolas art murals 2.png'],
  },
  {
    id: 'museum_of_industry',
    name: 'Museum of Industry',
    type: 'culture',
    category: 'cultural_spot',
    coordinate: { latitude: 12.435937934113127, longitude: -69.90914366488958 },
    description: 'Housed in restored water tower, showcasing Aruba\'s industrial history including gold mining and oil refining.',
    address: 'San Nicolas, Aruba',
    photos: ['local:musem of industry aruba.png', 'local:museum of industry aruba 1.png', 'local:museum of industry aruba 2.png'],
  },
  {
    id: 'eagle_refinery_main_office',
    name: 'Eagle Refinery Main Office',
    type: 'culture',
    category: 'cultural_spot',
    coordinate: { latitude: 12.53384455111749, longitude: -70.0532818414469 },
    description: 'Historic building (1929) representing Aruba\'s oil refining history and economic development.',
    address: 'Oranjestad, Aruba',
    photos: ['local:eagle refinery main office.png', 'local:eagle refinery main office 1.png', 'local:eagle refinery main office 2.png'],
  },
  {
    id: 'addison_croes_merchants_house',
    name: 'Aruba Town Hall',
    type: 'culture',
    category: 'cultural_spot',
    coordinate: { latitude: 12.518819436740916, longitude: -70.03585290396023 },
    description: 'Historic government building serving as the administrative center of Oranjestad and Aruba.',
    address: 'Oranjestad, Aruba',
    photos: ['local:aruba town hall.png', 'local:Aruba Town Hall 1.png', 'local:Aruba Town Hall 2.png'],
  },
  {
    id: 'sero_colorado_canons',
    name: 'Sero Colorado Canons',
    type: 'culture',
    category: 'cultural_spot',
    coordinate: { latitude: 12.418550789854441, longitude: -69.86910458762264 },
    description: 'Historic canons from late 18th-early 19th century discovered in 1957, part of Sero Colorado Memorial with WWII bunker and lighthouse.',
    address: 'Sero Colorado, Aruba',
    photos: ['local:seroe colorado aruba.png', 'local:sero colorado canons 1.png', 'local:sero colorado canons 2.png'],
  },

  // Natural Wonders
  {
    id: 'natural_pool',
    name: 'Natural Pool (Conchi)',
    type: 'eco',
    category: 'natural_wonder',
    coordinate: { latitude: 12.523859208548807, longitude: -69.93058983521186 },
    description: 'Natural swimming pool formed by volcanic rock, accessible by 4WD.',
    address: 'Arikok National Park, Aruba',
    photos: ['local:natural pool aruba.png', 'local:natural pool aruba 1.png', 'local:natural pool aruba 2.png'],
  },
  {
    id: 'arikok_national_park',
    name: 'Arikok National Park',
    type: 'eco',
    category: 'natural_wonder',
    coordinate: { latitude: 12.499039606208482, longitude: -69.94642046163275 },
    description: 'Protected natural area covering 18% of the island with diverse wildlife.',
    address: 'Arikok National Park, Aruba',
    photos: ['local:arikok national park aruba.png', 'local:arikok national park 1.png', 'local:arikok national park 2.png'],
  },
  {
    id: 'fontein_cave',
    name: 'Fontein Cave',
    type: 'eco',
    category: 'natural_wonder',
    coordinate: { latitude: 12.493198008190335, longitude: -69.90717360396053 },
    description: 'Ancient cave with Arawak Indian drawings and unique limestone formations.',
    address: 'Arikok National Park, Aruba',
    photos: ['local:fontein cave.png', 'local:fontein cave 1.png', 'local:fontein cave 2.png'],
  },
  {
    id: 'quadiriki_cave',
    name: 'Quadiriki Cave',
    type: 'eco',
    category: 'natural_wonder',
    coordinate: { latitude: 12.482508941970917, longitude: -69.89986157697784 },
    description: 'Twin caves with impressive stalactites and stalagmites, accessible by guided tour.',
    address: 'Arikok National Park, Aruba',
    photos: ['local:quadirikiri cave aruba.png', 'local:quadirikiri cave aruba 1.png', 'local:quadirikiri cave aruba 2.png'],
  },
  {
    id: 'huliba_cave',
    name: 'Huliba Cave',
    type: 'eco',
    category: 'natural_wonder',
    coordinate: { latitude: 12.472831578427812, longitude: -69.89662471930556 },
    description: 'Known as the "Tunnel of Love" - a narrow cave passage with romantic legends.',
    address: 'Arikok National Park, Aruba',
    photos: ['local:huliba cave aruba.png', 'local:Huliba Cave 1.png', 'local:Huliba Cave 2.png'],
  },
  {
    id: 'natural_bridge',
    name: 'Natural Bridge',
    type: 'eco',
    category: 'natural_wonder',
    coordinate: { latitude: 12.472831578427812, longitude: -69.89662471930556 },
    description: 'Historic limestone bridge that collapsed in 2005, with the nearby Baby Bridge still standing.',
    address: 'Santa Cruz, Aruba',
    photos: ['local:natural bridge aruba.png', 'local:Natural Bridge Aruba 1.png', 'local:Natural Bridge Aruba 2.png'],
  },
  {
    id: 'three_point_natural_bridge',
    name: 'Three Point Natural Bridge',
    type: 'eco',
    category: 'natural_wonder',
    coordinate: { latitude: 12.538131475815979, longitude: -69.95009608142075 },
    description: 'Unique rock formation with three natural archways, perfect for photography.',
    address: 'Santa Cruz, Aruba',
    photos: ['local:three point bridge aruba.png', 'local:three point natural bridge aruba 1.png', 'local:three point natural bridge aruba 2.png'],
  },
  {
    id: 'boca_prins_sand_dunes',
    name: 'Boca Prins Sand Dunes',
    type: 'eco',
    category: 'natural_wonder',
    coordinate: { latitude: 12.497352150915525, longitude: -69.90755080112233 },
    description: 'Stunning sand dunes in Arikok National Park, great for hiking and photography.',
    address: 'Arikok National Park, Aruba',
    photos: ['local:boca prins sand dunes.png', 'local:boca prins sand dunes aruba 1.png', 'local:boca prins sand dunes aruba 2.png'],
  },
  {
    id: 'black_rock_beach',
    name: 'Black Rock Beach',
    type: 'eco',
    category: 'natural_wonder',
    coordinate: { latitude: 12.538131475815979, longitude: -69.95009608142075 },
    description: 'Unique beach with dark volcanic rocks contrasting against the white sand.',
    address: 'Santa Cruz, Aruba',
    photos: ['local:blackstone beach aruba.png', 'local:black rock beach aruba 1.png', 'local:black rock beach aruba 2.png'],
  },
  {
    id: 'ayo_rock_formations',
    name: 'Ayo Rock Formations',
    type: 'eco',
    category: 'natural_wonder',
    coordinate: { latitude: 12.53137179260238, longitude: -69.97072747267933 },
    description: 'Massive boulders with ancient petroglyphs, offering scenic hiking trails.',
    address: 'Ayo, Aruba',
    photos: ['local:ayo rock formation aruba.png', 'local:ayo rock formation 1.png', 'local:ayo rock formation 2.png'],
  },
  {
    id: 'casibari_rock_formations',
    name: 'Casibari Rock Formations',
    type: 'eco',
    category: 'natural_wonder',
    coordinate: { latitude: 12.531267928027532, longitude: -69.9964103616325 },
    description: 'Unique tonalite rock formations with trails leading to panoramic island views.',
    address: 'Casibari, Aruba',
    photos: ['local:casibari rock formation aruba.png', 'local:casibari rock formation aruba 1.png', 'local:casibari rock formation aruba 2.png'],
  },
  {
    id: 'hooiberg',
    name: 'Hooiberg (Haystack Mountain)',
    type: 'eco',
    category: 'natural_wonder',
    coordinate: { latitude: 12.517039308460657, longitude: -69.99446962173884 },
    description: '165-meter volcanic formation with 600+ steps leading to 360-degree island views.',
    address: 'Paradera, Aruba',
    photos: ['local:hooiberg aruba.png', 'local:hooiberg aruba 1.png', 'local:hooiberg aruba 2.png'],
  },
  {
    id: 'yamanota_berg',
    name: 'Jamanota',
    type: 'eco',
    category: 'natural_wonder',
    coordinate: { latitude: 12.487730986272965, longitude: -69.94061708524627 },
    description: 'Highest point in Aruba at 188 meters, offering challenging hiking and scenic vistas.',
    address: 'Jamanota, Aruba',
    photos: ['local:jamanota aruba.png', 'local:jamanota aruba 1.png', 'local:jamanota aruba 2.png'],
  },
];

// Map app location types to website categories
function mapCategory(appType: string): string {
  const categoryMap: Record<string, string> = {
    'beach': 'beach',
    'culture': 'cultural_spot',
    'eco': 'natural_wonder',
    'restaurant': 'restaurant',
    'shop': 'local_shop',
    'nightlife': 'club_bar',
    'hotel': 'hotel',
    'hotspots': 'activity',
    'attraction': 'cultural_spot', // Can be cultural or natural, defaulting to cultural
  };
  return categoryMap[appType] || 'activity';
}

// Convert local: image paths to URLs (you may need to adjust this)
function convertImagePaths(photos: string[]): string[] {
  return photos.map(photo => {
    if (photo.startsWith('local:')) {
      // Remove 'local:' prefix and convert to public URL
      const filename = photo.replace('local:', '').trim();
      // You may need to upload these images or adjust the path
      return `/images/${filename}`;
    }
    return photo;
  });
}

async function importLocations() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ydycncbqobpljrtknpqd.supabase.co';
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!SUPABASE_ANON_KEY) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
    process.exit(1);
  }

  const API_BASE_URL = `${SUPABASE_URL}/functions/v1`;
  let successCount = 0;
  let errorCount = 0;

  console.log(`📦 Starting import of ${APP_LOCATIONS.length} locations...\n`);

  for (const location of APP_LOCATIONS) {
    try {
      const category = location.category || mapCategory(location.type);
      const images = location.photos ? convertImagePaths(location.photos) : [];

      const locationData = {
        name: location.name,
        description: location.description || '',
        category: category as any,
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

      const response = await fetch(`${API_BASE_URL}/admin-content/map-locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(locationData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log(`✅ Imported: ${location.name} (${category})`);
        successCount++;
      } else {
        console.error(`❌ Failed: ${location.name} - ${data.error || response.statusText}`);
        errorCount++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`❌ Error importing ${location.name}:`, error);
      errorCount++;
    }
  }

  console.log(`\n📊 Import Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📦 Total: ${APP_LOCATIONS.length}`);
}

// Run the import
importLocations().catch(console.error);

