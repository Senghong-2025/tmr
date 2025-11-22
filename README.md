# Transaction Manager (TMR)

A modern transaction and expense tracking application built with Nuxt 3, Vue 3, and Firebase. Track your daily expenses, visualize spending patterns, and manage multiple currencies.

## Features

- **Transaction Management**: Create, view, edit, and delete transactions
- **Data Visualization**: Interactive bar charts showing spending patterns over time
- **Multi-Currency Support**: Track expenses in different currencies (USD, KHR)
- **User Authentication**: Secure login and registration with Firebase
- **Category Management**: Organize transactions by custom categories
- **Profile Settings**: Manage user profile and preferences
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Lazy Loading**: Infinite scroll for efficient data loading

## Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/)
- **UI Library**: [PrimeVue](https://primevue.org/) with custom Tailwind CSS styling
- **Charts**: Chart.js with vue-chartjs
- **Backend**: Firebase (Authentication & Firestore)
- **Styling**: Tailwind CSS 4
- **Icons**: Heroicons
- **Date Handling**: date-fns

## Prerequisites

- Node.js (v18 or higher recommended)
- npm, pnpm, yarn, or bun
- Firebase project with Firestore and Authentication enabled

## Environment Setup

Create a `.env` file in the root directory with your Firebase configuration:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Installation

Install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

The development server is configured to run on all network interfaces (`0.0.0.0`), allowing access from other devices on your local network.

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Preview production build locally:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Deployment

### Cloudflare Pages

This project is configured for deployment to Cloudflare Pages:

```bash
# Build for Cloudflare Pages
npm run build:prod

# Deploy to Cloudflare Pages
npm run deploy:prod
```

For other deployment options, check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment).

## Project Structure

```
├── pages/
│   ├── index.vue              # Dashboard with charts
│   ├── login.vue              # Login page
│   ├── register.vue           # Registration page
│   ├── setting.vue            # Settings page
│   ├── setting/
│   │   ├── category.vue       # Category management
│   │   ├── currency.vue       # Currency settings
│   │   └── profile.vue        # User profile
│   └── transaction/
│       ├── index.vue          # Transaction list
│       ├── create.vue         # Create new transaction
│       └── [id].vue           # Transaction details/edit
├── components/
│   ├── charts/                # Chart components
│   ├── formfields/            # Reusable form inputs
│   ├── buttons/               # Button components
│   └── Modals/                # Modal components
├── plugins/                   # Nuxt plugins (Firebase)
└── assets/                    # Static assets and styles
```

## Key Features Explained

### Dashboard
- View spending trends with interactive bar charts
- Filter data by date range
- Real-time updates

### Transaction Management
- Grouped by date with daily totals
- Support for multiple currencies
- Quick search and filtering
- Infinite scroll for large datasets

### Settings
- Manage expense categories
- Configure currency preferences
- Update user profile information

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and not licensed for public use.
