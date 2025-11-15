# SPAMRUN

Beat the Spam Filter. Reach the Inbox.

AI-powered email analysis that tells you exactly why your emails land in spam—and how to fix it.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **Deployment**: Vercel
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude API

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/PresidentHadley/spam-run.git
cd spam-run
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables in `.env.local`:
- Supabase credentials
- Stripe keys
- Anthropic API key
- Other configuration

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

1. Create a Supabase project
2. Run the SQL schema from the project documentation to set up tables
3. Enable Row Level Security (RLS) policies
4. Update environment variables with your Supabase credentials

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables Required

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_URL`

## Features

- ✅ Email spam analysis
- ✅ Deliverability scoring
- ✅ API access with key management
- ✅ Usage tracking and limits
- ✅ Stripe subscription integration
- ✅ Beautiful dashboard UI
- ✅ Check history
- ✅ Responsive design

## API Documentation

Visit `/api-docs` in the app for complete API documentation.

## License

Proprietary - All rights reserved

## Support

For support, email support@spamrun.com or visit our help center.

