# How to Change the Favicon

## Current Setup
Your favicon is located at: `src/app/favicon.ico`

## Method 1: Replace the favicon.ico file (Easiest)

1. **Create or find your favicon image** (should be `.ico` format, or `.png`/`.svg`)
2. **Convert to .ico if needed** (use an online converter like https://favicon.io/favicon-converter/)
3. **Replace the file**: 
   - Replace `src/app/favicon.ico` with your new favicon
   - Or place it in `public/favicon.ico` and update the metadata in `layout.tsx`

## Method 2: Use PNG/SVG favicon

If you want to use a PNG or SVG instead:

1. **Place your image in the `public` folder**:
   - `public/favicon.png` (recommended: 32x32 or 16x16)
   - Or `public/favicon.svg` (scalable vector)

2. **The layout.tsx is already configured** to use `/logo.png` as an icon option

3. **To use a different file**, update `layout.tsx`:
   ```typescript
   icons: {
     icon: [
       { url: '/your-favicon.png', type: 'image/png', sizes: '32x32' },
     ],
   }
   ```

## Method 3: Use your existing logo.png

You already have `public/logo.png`. The layout is configured to use it as an icon. Just make sure:
- The logo is square (or close to square)
- Recommended size: 32x32px for favicon, 180x180px for Apple touch icon

## Quick Steps to Change Now:

1. **Get your favicon file** (`.ico`, `.png`, or `.svg`)
2. **Option A - Replace favicon.ico**:
   ```bash
   # Replace src/app/favicon.ico with your new file
   ```

3. **Option B - Use a PNG/SVG**:
   ```bash
   # Place your file in public/ (e.g., public/favicon.png)
   # Update layout.tsx icons.url to point to your file
   ```

4. **Test locally**:
   ```bash
   npm run dev
   # Check http://localhost:3000 - the favicon should appear in the browser tab
   ```

## Recommended Favicon Sizes:
- **favicon.ico**: 16x16, 32x32, 48x48 (multi-size ICO file)
- **favicon.png**: 32x32 or 16x16
- **Apple touch icon**: 180x180 (for iOS home screen)

## Online Tools:
- **Generate favicon from image**: https://favicon.io/favicon-converter/
- **Create favicon from text**: https://favicon.io/
- **Convert PNG to ICO**: https://convertio.co/png-ico/



