# RSJ Jewelers

A premium jewelry eCommerce platform with real-time dynamic pricing based on live metal rates.

## Tech Stack

- **Framework**: Next.js 13.5 (App Router)
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Animations**: Framer Motion

## Features

- Real-time metal rate ticker with live pricing
- Dynamic product pricing (Weight x Rate + Making Charges + 3% GST)
- Digital Gold vault for buying/selling gold
- User authentication and profiles
- Shopping cart with checkout flow
- Wishlist functionality
- Order management
- Admin dashboard for products and rates
- Category-based filtering (Gold, Silver, Diamond)
- Mobile responsive design

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local`
4. Run database migrations (see `/scripts` folder)
5. Start development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks

## Database Setup

Execute SQL scripts in order from `/scripts` folder:
1. `setup-database.sql` - Creates tables and initial schema
2. `01-schema.sql` - Additional schema setup

Supabase migrations are in `/supabase/migrations/`.

## Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── admin/           # Admin dashboard pages
│   ├── api/             # API routes
│   ├── auth/            # Authentication pages
│   ├── product/         # Product detail pages
│   └── ...              # Other pages
├── components/          # React components
│   ├── home/            # Homepage components
│   ├── layout/          # Layout components (Header, Footer)
│   └── ui/              # shadcn/ui components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and context providers
└── scripts/             # Database setup scripts
```

## Deployment

Deploy to Vercel:
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy

---

Built with excellence since 1985.
