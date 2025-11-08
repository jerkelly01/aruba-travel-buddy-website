# Aruba Travel Buddy Website

A modern, responsive website for the Aruba Travel Buddy mobile app. This website showcases the app's features, provides download links, and includes an admin dashboard for managing app content.

## Features

### Public Pages
- **Home Page** (`/`): Landing page with hero section and feature highlights
- **Features Page** (`/features`): Detailed information about all app features
- **About Page** (`/about`): Information about the app and team
- **Download Page** (`/download`): App store links and system requirements
- **FAQ Section**: Common questions and answers

### Admin Dashboard
- **Authentication**: Secure login system
- **Content Management**: Edit app title, description, features, and download URLs
- **Analytics Dashboard**: View app statistics and metrics
- **User Management**: Manage app users and permissions
- **Push Notifications**: Send notifications to app users
- **App Settings**: Configure app settings and preferences

## Tech Stack

- **Framework**: Next.js 15.5.6 (with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Custom Auth Context
- **Deployment**: Ready for Vercel, Netlify, or any Node.js hosting

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd aruba-travel-buddy-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with Navbar
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   ├── providers.tsx           # Auth provider wrapper
│   ├── features/
│   │   └── page.tsx            # Features page
│   ├── about/
│   │   └── page.tsx            # About page
│   ├── download/
│   │   └── page.tsx            # Download page
│   ├── login/
│   │   └── page.tsx            # Login page
│   └── admin/
│       └── page.tsx            # Admin dashboard
├── components/
│   └── Navbar.tsx              # Navigation component
└── lib/
    └── auth-context.tsx        # Authentication context
```

## Pages Overview

### Home Page (`/`)
- Hero section with app overview
- Feature highlights with icons
- Call-to-action buttons
- Responsive design for all devices

### Features Page (`/features`)
- Detailed feature descriptions
- Feature benefits and details
- Grid layout for easy scanning

### About Page (`/about`)
- Mission statement
- Why choose the app
- Team information
- Trust indicators

### Download Page (`/download`)
- iOS and Android download buttons
- System requirements
- FAQ section
- Feature highlights

### Admin Dashboard (`/admin`)
- Protected route (requires login)
- Content management interface
- Statistics and metrics
- Management options for:
  - Users
  - Analytics
  - Push notifications
  - App settings

### Login Page (`/login`)
- Email and password authentication
- Demo credentials display
- Error handling
- Redirect to dashboard on success

## Authentication

The website includes a demo authentication system using localStorage.

**Demo Credentials:**
- Email: `admin@arubabuddy.com`
- Password: `admin123`

### For Production
Integrate with:
- Supabase Auth
- Firebase Authentication
- Auth0
- NextAuth.js

## Customization

### Update App Content
1. Go to `/admin`
2. Login with demo credentials
3. Click "Edit Content"
4. Modify app information
5. Save changes

### Styling
- Tailwind CSS is configured with default colors
- Customize colors in `tailwind.config.ts`
- Global styles in `src/app/globals.css`

### Navigation Links
Update navigation links in `src/components/Navbar.tsx`

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`

### Docker
```bash
docker build -t aruba-travel-buddy-website .
docker run -p 3000:3000 aruba-travel-buddy-website
```

## Environment Variables

Create a `.env.local` file for environment-specific variables:

```
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## Performance Optimization

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- CSS optimization with Tailwind
- Responsive design for all screen sizes
- SEO-friendly metadata

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- [ ] Integration with Supabase for real authentication
- [ ] Real-time analytics dashboard
- [ ] User management system
- [ ] Push notification system
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Blog/News section
- [ ] User reviews and testimonials
- [ ] Social media integration
- [ ] Email newsletter signup

## Support

For support, email support@arubabuddy.com or open an issue on GitHub.

## License

This project is licensed under the MIT License.
