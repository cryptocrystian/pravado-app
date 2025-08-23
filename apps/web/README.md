# PRAVADO Web Application

A modern React/TypeScript web application for the PRAVADO analytics platform, built with Vite and featuring comprehensive analytics dashboards, real-time data visualization, and CiteMind integration.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Analytics Dashboard**: Comprehensive KPI tracking and visualization
- **CiteMind Integration**: Specialized analytics for citation data
- **Chart Visualization**: Chart.js integration with responsive charts
- **State Management**: Zustand for efficient state handling
- **Telemetry**: PostHog integration for user analytics
- **Responsive Design**: Mobile-first, fully responsive interface
- **E2E Testing**: Playwright test suite
- **Production Ready**: Optimized builds for Cloudflare Pages

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard/          # Dashboard-specific components
│   ├── Analytics/          # Analytics page components
│   ├── Layout/            # Layout components (Header, Sidebar)
│   └── common/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and services
│   ├── analytics.ts       # PostHog integration
│   ├── api.ts            # API client with mock data
│   ├── store.ts          # Zustand state management
│   └── utils.ts          # Helper functions
├── pages/                # Main page components
├── types/                # TypeScript type definitions
└── App.tsx               # Main application component
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:e2e:ui` - Run Playwright tests with UI

## 🎨 UI Components

### Core Components
- **MetricCard**: KPI display with trend indicators
- **LoadingSkeleton**: Loading states for better UX
- **ErrorState**: Consistent error handling
- **EmptyState**: Empty data state management
- **Tabs**: Generic tabbed interface

### Specialized Components
- **CiteMindDashboard**: Advanced analytics for citation data
- **DashboardHeader**: Main dashboard header with actions
- **TimeRangeSelector**: Date range picker for analytics

## 📊 State Management

Using Zustand for lightweight, efficient state management:

- **DashboardStore**: KPI metrics and dashboard data
- **AnalyticsStore**: CiteMind analytics and time range selection
- **AppStore**: Global app state (theme, sidebar, notifications)

## 🔧 API Integration

The application includes a mock API client that simulates real backend integration:

- Dashboard metrics endpoint
- CiteMind analytics data
- Error handling and loading states
- Ready for production API integration

## 📱 Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Collapsible sidebar
- Touch-friendly interactions
- Optimized for all screen sizes

## 📈 Analytics & Telemetry

PostHog integration provides:
- Page view tracking
- Event tracking (clicks, interactions)
- Error tracking
- Feature usage analytics
- Performance monitoring

## 🧪 Testing

Comprehensive E2E testing with Playwright:
- Dashboard functionality
- Analytics interactions
- Navigation flow
- Mobile responsiveness
- Error handling

Run tests:
```bash
npm run test:e2e
```

## 🚀 Deployment

### Cloudflare Pages
The app is optimized for Cloudflare Pages deployment:

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to Cloudflare Pages

### Environment Variables
Set these in your Cloudflare Pages environment:
- `VITE_API_BASE_URL`: Your API endpoint
- `VITE_POSTHOG_KEY`: PostHog project key
- `VITE_POSTHOG_HOST`: PostHog instance URL

## 🎯 Key Features

### Dashboard
- Real-time KPI metrics
- Interactive metric cards
- System status monitoring
- Quick actions panel
- Auto-refresh capability

### Analytics
- Multi-tab interface
- Time range selection
- CiteMind integration
- Chart visualizations
- Data export tools

### CiteMind Analytics
- Citation tracking
- Source analysis
- Relevance scoring
- Category breakdown
- Time series visualization

## 🔧 Customization

### Adding New Metrics
1. Update the `KPIMetric` type in `types/index.ts`
2. Add mock data in `lib/api.ts`
3. Create visualization in `components/Dashboard/`

### Adding New Analytics
1. Create new tab in `pages/Analytics.tsx`
2. Build visualization component
3. Add to analytics store if needed

### Styling
- Tailwind CSS for utility classes
- Custom CSS components in `index.css`
- PRAVADO brand colors configured
- Dark mode ready (toggle in AppStore)

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Follow the established patterns
2. Write tests for new features
3. Use TypeScript strictly
4. Follow accessibility guidelines
5. Test on mobile devices

## 🔗 Related

- API: `packages/api/`
- Documentation: `docs/`
- Deployment: `CLOUDFLARE-SETUP.md`