/**
 * Script to import all locations from the app into the website database
 * 
 * Usage:
 *   1. Make sure you're logged into the admin panel in your browser
 *   2. Copy your auth token from localStorage (DevTools → Application → Local Storage → authToken)
 *   3. Set AUTH_TOKEN environment variable: export AUTH_TOKEN="your-token-here"
 *   4. Run: node scripts/import-locations.js
 * 
 * Or run via admin API route (recommended):
 *   - Create an admin API route that handles authentication automatically
 */

const fs = require('fs');
const path = require('path');

// Read locations from the app's service file
const appLocationsPath = path.join(__dirname, '../../src/services/arubaLocationsService.ts');
const appLocationsContent = fs.readFileSync(appLocationsPath, 'utf-8');

// Extract REAL_ARUBA_LOCATIONS array using regex
const locationsMatch = appLocationsContent.match(/private readonly REAL_ARUBA_LOCATIONS: Partial<ArubaLocation>\[\] = \[([\s\S]*?)\];/);
if (!locationsMatch) {
  console.error('❌ Could not find REAL_ARUBA_LOCATIONS in the service file');
  process.exit(1);
}

// Parse locations (simplified - we'll extract the key data)
const locationsText = locationsMatch[1];

// Map app location types to website categories
function mapCategory(appType) {
  const categoryMap = {
    'beach': 'beach',
    'culture': 'cultural_spot',
    'eco': 'natural_wonder',
    'restaurant': 'restaurant',
    'shop': 'local_shop',
    'nightlife': 'club_bar',
    'hotel': 'hotel',
    'hotspots': 'activity',
    'attraction': 'cultural_spot', // Default to cultural
  };
  return categoryMap[appType] || 'activity';
}

// Convert local: image paths to placeholder URLs (images need to be uploaded separately)
function convertImagePaths(photos) {
  if (!photos || !Array.isArray(photos)) return [];
  return photos.map(photo => {
    if (photo.startsWith('local:')) {
      const filename = photo.replace('local:', '').trim();
      // For now, use placeholder - you'll need to upload images to public folder
      return `/images/${filename}`;
    }
    return photo;
  });
}

// Parse locations from the TypeScript file
function parseLocations(content) {
  const locations = [];
  const locationBlocks = content.split(/\{\s*id:/).slice(1); // Split by location start
  
  locationBlocks.forEach(block => {
    try {
      // Extract id
      const idMatch = block.match(/id:\s*['"]([^'"]+)['"]/);
      if (!idMatch) return;
      const id = idMatch[1];
      
      // Extract name
      const nameMatch = block.match(/name:\s*['"]([^'"]+)['"]/);
      if (!nameMatch) return;
      const name = nameMatch[1].replace(/\\'/g, "'");
      
      // Extract type
      const typeMatch = block.match(/type:\s*['"]([^'"]+)['"]/);
      if (!typeMatch) return;
      const type = typeMatch[1];
      
      // Extract coordinates
      const coordMatch = block.match(/coordinate:\s*\{\s*latitude:\s*([\d.]+),\s*longitude:\s*(-?[\d.]+)\s*\}/);
      if (!coordMatch) return;
      const latitude = parseFloat(coordMatch[1]);
      const longitude = parseFloat(coordMatch[2]);
      
      // Extract description
      const descMatch = block.match(/description:\s*['"]([^'"]+)['"]/);
      const description = descMatch ? descMatch[1].replace(/\\'/g, "'") : '';
      
      // Extract address
      const addrMatch = block.match(/address:\s*['"]([^'"]+)['"]/);
      const address = addrMatch ? addrMatch[1].replace(/\\'/g, "'") : '';
      
      // Extract photos
      const photosMatch = block.match(/photos:\s*\[([^\]]+)\]/);
      let photos = [];
      if (photosMatch) {
        const photosText = photosMatch[1];
        const photoMatches = photosText.matchAll(/['"]([^'"]+)['"]/g);
        photos = Array.from(photoMatches).map(m => m[1]);
      }
      
      locations.push({
        id,
        name,
        type,
        category: mapCategory(type),
        coordinate: { latitude, longitude },
        description,
        address,
        photos,
      });
    } catch (error) {
      console.warn(`⚠️  Error parsing location block:`, error.message);
    }
  });
  
  return locations;
}

const locations = parseLocations(locationsText);
console.log(`📦 Found ${locations.length} locations to import\n`);

// Import function
async function importLocations() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ydycncbqobpljrtknpqd.supabase.co';
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const AUTH_TOKEN = process.env.AUTH_TOKEN || '';
  
  if (!SUPABASE_ANON_KEY) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
    process.exit(1);
  }
  
  if (!AUTH_TOKEN) {
    console.error('❌ AUTH_TOKEN is required');
    console.error('   Get it from: localStorage.getItem("authToken") in browser DevTools');
    console.error('   Then run: export AUTH_TOKEN="your-token-here"');
    process.exit(1);
  }

  const API_BASE_URL = `${SUPABASE_URL}/functions/v1`;
  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  console.log(`🚀 Starting import of ${locations.length} locations...\n`);

  for (const location of locations) {
    try {
      const images = convertImagePaths(location.photos);

      const locationData = {
        name: location.name,
        description: location.description || '',
        category: location.category,
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

      const response = await fetch(`${API_BASE_URL}/admin-map-locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(locationData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log(`✅ Imported: ${location.name} (${location.category})`);
        successCount++;
      } else {
        const errorMsg = data.error || response.statusText || 'Unknown error';
        console.error(`❌ Failed: ${location.name} - ${errorMsg}`);
        errors.push({ name: location.name, error: errorMsg });
        errorCount++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`❌ Error importing ${location.name}:`, error.message);
      errors.push({ name: location.name, error: error.message });
      errorCount++;
    }
  }

  console.log(`\n📊 Import Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📦 Total: ${locations.length}`);
  
  if (errors.length > 0) {
    console.log(`\n❌ Errors:`);
    errors.forEach(e => console.log(`   - ${e.name}: ${e.error}`));
  }
}

// Run the import
importLocations().catch(console.error);

