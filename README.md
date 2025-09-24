# Cosmic Portals SaaS

**Transform every scan, tap, and click into measurable insights. NFC-powered engagement for businesses, events, and communities.**

## 🚀 Features

- **NFC Device Management** - Business cards, signage, event badges
- **Event Management** - Attendee tracking, check-ins, photo galleries
- **Real-time Analytics** - Engagement metrics, conversion tracking
- **Multi-tenant Architecture** - Organization-based data segregation
- **AI-Powered Insights** - Trend analysis and predictive analytics
- **White-label Solutions** - Custom branding and domains
- **Hardware Store** - NFC tags and accessories
- **Community Pricing** - Schools, HOAs, and organizations

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini API
- **Payments**: Stripe
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

## 🏗️ Architecture

### Multi-tenant SaaS Platform
- **Organizations** - Top-level tenant isolation
- **Users** - Role-based access control
- **NFC Devices** - Physical touchpoints
- **Events** - Engagement campaigns
- **Analytics** - Data aggregation and insights

### Subscription Tiers
- **Starter** - $29/month (10 devices, 1 event, 100 attendees)
- **Professional** - $99/month (100 devices, 10 events, 1000 attendees)
- **Enterprise** - $299/month (Unlimited everything)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Clerk account
- Google Gemini API key
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cosmic-portals-saas.git
   cd cosmic-portals-saas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys to `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api
   GEMINI_API_KEY=your_gemini_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
   STRIPE_SECRET_KEY=your_stripe_secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
   ```

4. **Set up the database**
   ```bash
   # Run the database schema
   psql -h your-supabase-host -U postgres -d postgres -f lib/database/cosmic-portals-schema.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
cosmic-portals-saas/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── api/               # API routes
│   └── pricing/           # Pricing page
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   └── ...                # Feature components
├── lib/                   # Utility functions
│   ├── database/          # Database schemas
│   ├── ai/                # AI integration
│   └── ...                # Other utilities
└── types/                 # TypeScript types
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Schema
The project uses a comprehensive multi-tenant schema with:
- **Organizations** - Tenant isolation
- **Users** - Authentication and roles
- **NFC Devices** - Physical touchpoints
- **Events** - Engagement campaigns
- **Analytics** - Data tracking
- **Subscriptions** - Billing management

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify** - Static site hosting
- **Railway** - Full-stack deployment
- **AWS** - Enterprise deployment

## 📊 Monitoring

- **Analytics** - Built-in engagement tracking
- **Error Tracking** - Comprehensive logging
- **Performance** - Real-time monitoring
- **Security** - GDPR compliance and data protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation** - [docs.cosmicportals.com](https://docs.cosmicportals.com)
- **Support** - [support@cosmicportals.com](mailto:support@cosmicportals.com)
- **Community** - [Discord](https://discord.gg/cosmicportals)

---

**Built with ❤️ for the future of engagement**