# Royal Coffee - Premium Single-Origin Coffee E-Commerce

Proyecto académico para la asignatura **Sistemas Web I**.  
Se trata de una aplicación web para un café de especialidad que combina diseño atractivo, interactividad y animaciones para ofrecer una experiencia de usuario dinámica.

## Miembros del grupo
- Álvaro Íñiguez  
- Pedro Varona  
- Lorenzo Sanz  
- Alfredo Martínez  
- Claudia Erguido  
- Juan García


## 🎯 Project Overview

- **Home**: Hero section with featured products and call-to-actions
- **Menu**: Filterable product catalog with detailed product pages
- **Cart**: Full shopping cart with fake checkout (no real payments)
- **Reservations**: Table booking system with validation and confirmation
- **Feed**: Realtime news and user opinions with live updates
- **Profile**: User account management with reservation and opinion history
- **Info**: Location information with embedded map
- **Admin**: Dashboard for managing products, reservations, news, opinions, and users

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **TailwindCSS** - Styling
- **Shadcn/ui** - Component library
- **Lucide React** - Icons

### Backend (Lovable Cloud/Supabase)
- **Supabase Auth** - User authentication
- **Supabase Database** - PostgreSQL database
- **Supabase Realtime** - Live updates for feed
- **Row Level Security** - Database security

### Features
- ✅ User authentication (sign up, sign in, sign out, password recovery)
- ✅ Role-based access (Guest, User, Admin)
- ✅ Dark mode with theme persistence
- ✅ Realtime updates for news and opinions
- ✅ Form validation (client and server)
- ✅ Toast notifications for user feedback
- ✅ Scroll reveal animations
- ✅ Responsive design (mobile-first)
- ✅ SEO optimized
- ✅ Accessible (WCAG compliant)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Lovable Cloud enabled (or Supabase account)

### Installation

1. **Enable Lovable Cloud** (if not already enabled):
   Click the "Connect Lovable Cloud" button in the Lovable interface.

2. **Run Database Migrations**:
   Execute the SQL schema in the Lovable Cloud Database interface or Supabase SQL editor:

```sql
-- See full schema below in Database Schema section
```

3. **Install Dependencies** (handled automatically by Lovable):
```bash
npm install
```

4. **Start Development Server**:
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## 📊 Database Schema

### Tables

#### `profiles`
User profile information
- `id` (uuid, PK, references auth.users)
- `name` (text)
- `email` (text)
- `avatar_url` (text)
- `theme_preference` (text: 'light' or 'dark')
- `role` (text: 'user' or 'admin')
- `created_at` (timestamp)

#### `products`
Coffee products catalog
- `id` (uuid, PK)
- `name` (text)
- `slug` (text, unique)
- `origin` (text)
- `notes` (text)
- `size_options` (jsonb array)
- `price_cents` (integer)
- `image_url` (text)
- `active` (boolean)
- `created_at` (timestamp)

#### `orders`
Customer orders
- `id` (uuid, PK)
- `user_id` (uuid, FK to profiles, nullable)
- `status` (enum: 'cart', 'submitted', 'completed', 'cancelled')
- `total_cents` (integer)
- `created_at` (timestamp)

#### `order_items`
Line items for orders
- `id` (uuid, PK)
- `order_id` (uuid, FK to orders)
- `product_id` (uuid, FK to products)
- `size` (text)
- `qty` (integer)
- `unit_price_cents` (integer)
- `line_total_cents` (integer)

#### `reservations`
Table reservations
- `id` (uuid, PK)
- `user_id` (uuid, FK to profiles, nullable)
- `name` (text)
- `email` (text)
- `phone` (text)
- `date` (date)
- `time_slot` (text)
- `party_size` (integer)
- `status` (enum: 'requested', 'confirmed', 'cancelled')
- `created_at` (timestamp)

#### `news`
News articles
- `id` (uuid, PK)
- `title` (text)
- `body` (text)
- `image_url` (text)
- `published` (boolean)
- `created_at` (timestamp)

#### `opinions`
User reviews and feedback
- `id` (uuid, PK)
- `user_id` (uuid, FK to profiles)
- `rating` (integer, 1-5)
- `text` (text)
- `approved` (boolean)
- `created_at` (timestamp)

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- **profiles**: Users can read/update own; admins can manage all
- **products**: Public read; admin can manage
- **orders/order_items**: Users can access own; admin can read all
- **reservations**: Users can CRUD own; admin can manage all
- **news**: Public read if published; admin can manage
- **opinions**: Users can insert/update/delete own; admin can approve/moderate

### Realtime

Enabled on `news` and `opinions` tables for live feed updates.

## 🔐 Authentication

The app uses Supabase Auth with the following flows:

- **Sign Up**: Email/password registration with email verification
- **Sign In**: Email/password authentication
- **Sign Out**: Session termination
- **Password Recovery**: Email-based password reset (ready to implement)

**Note**: For development/testing, you can disable "Confirm email" in Lovable Cloud settings.

### Creating an Admin User

After signing up, manually update the user's role in the database:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

## 🎨 Design System

The app uses a coffee-inspired design system defined in `src/index.css`:

### Colors
- **Primary**: Rich espresso brown (HSL: 25 55% 25%)
- **Secondary**: Warm latte cream (HSL: 30 50% 92%)
- **Accent**: Golden amber (HSL: 35 80% 55%)
- **Background**: Warm whites (light) / Deep coffee-black (dark)

### Custom Utilities
- `.bg-gradient-coffee` - Coffee brown gradient
- `.bg-gradient-cream` - Cream gradient
- `.bg-gradient-hero` - Hero section gradient
- `.shadow-soft` - Soft shadow
- `.shadow-glow` - Glowing shadow (accent color)
- `.transition-smooth` - Smooth transitions
- `.reveal` / `.revealed` - Scroll reveal animation

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## ♿ Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus states on interactive elements
- Color contrast meets WCAG AA standards
- Alt text on all images

## 🔧 Environment Variables

**IMPORTANT**: This project uses Lovable Cloud, which automatically manages environment variables. No manual .env file setup is needed.

Lovable Cloud automatically provides:
- Supabase URL
- Supabase Anon Key
- All necessary API endpoints

## 📦 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn components
│   ├── Navbar.jsx      # Navigation bar
│   ├── Footer.jsx      # Footer component
│   ├── ProductCard.jsx # Product display card
│   ├── QuantityPicker.jsx
│   ├── ThemeToggle.jsx
│   └── ProtectedRoute.jsx
├── contexts/           # React contexts
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   └── ToastContext.jsx
├── lib/               # Utilities
│   ├── supabaseClient.js
│   ├── api.js
│   └── onScroll.js
├── routes/            # Page components
│   ├── Home.jsx
│   ├── Menu.jsx
│   ├── Product.jsx
│   ├── Cart.jsx
│   ├── Reservations.jsx
│   ├── Profile.jsx
│   ├── Feed.jsx
│   ├── Info.jsx
│   ├── Auth.jsx
│   └── Admin.jsx
├── App.jsx            # Root component
├── main.jsx          # Entry point
└── index.css         # Global styles & design system
```

## 🎯 User Roles & Permissions

### Guest
- Browse home, menu, product details
- Add items to cart (stored in localStorage)
- View feed (news and approved opinions)
- Submit reservations (with contact info)

### Registered User
- All guest permissions, plus:
- Place orders (fake checkout)
- View and manage profile
- View reservation history
- Post and manage own opinions
- Theme preference persisted to profile

### Admin
- All user permissions, plus:
- Access admin dashboard
- CRUD products
- Manage all reservations
- Publish/edit news articles
- Approve/moderate opinions
- View all users

## 🧪 Testing

### Test Accounts

Create test accounts through the sign-up flow. For admin access, manually update the role in the database.

### Test Scenarios

1. **Guest Flow**: Browse → Add to cart → Checkout (creates order)
2. **User Flow**: Sign up → Make reservation → Post opinion
3. **Admin Flow**: Sign in as admin → Manage products → Approve opinions

## 🚀 Deployment

This project is built with Lovable and can be deployed with one click:

1. Click "Publish" in the Lovable interface
2. Your app will be deployed to `yoursite.lovable.app`
3. Optionally connect a custom domain in Settings

## 📝 Notes

- **No Real Payments**: This is a demo project. Cart checkout creates orders but processes no payments.
- **Email Verification**: Can be disabled in Lovable Cloud settings for testing.
- **Realtime Updates**: Feed automatically updates when new content is published.
- **Dark Mode**: Theme preference persists for logged-in users; guests use localStorage.

## 🙏 Credits

- **Coffee Images**: Unsplash
- **Icons**: Lucide React
- **UI Components**: Shadcn/ui
- **Backend**: Lovable Cloud (Supabase)

## 📄 License

This is a class project for educational purposes.

---

Built with ❤️ and ☕ by Royal Coffee Team
