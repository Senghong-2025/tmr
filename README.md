# Transaction Manager (TMR)

A modern transaction and expense tracking application built with Nuxt 3, Vue 3, and PostgreSQL. Track your daily expenses, visualize spending patterns, and manage multiple currencies.

## Features

- **Transaction Management**: Create, view, edit, and delete transactions
- **Data Visualization**: Interactive bar charts showing spending patterns over time
- **Multi-Currency Support**: Track expenses in different currencies (USD, KHR)
- **User Authentication**: Secure email/password login and registration
- **Category Management**: Organize transactions by custom categories
- **Profile Settings**: Manage user profile and preferences
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Lazy Loading**: Infinite scroll for efficient data loading

## Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/)
- **UI Library**: [PrimeVue](https://primevue.org/) with custom Tailwind CSS styling
- **Charts**: Chart.js with vue-chartjs
- **Backend**: Nuxt server API with Neon PostgreSQL
- **Styling**: Tailwind CSS 4
- **Icons**: Heroicons
- **Date Handling**: date-fns

## Prerequisites

- Node.js (v18 or higher recommended)
- npm, pnpm, yarn, or bun
- PostgreSQL database, such as Neon, and the `psql` CLI for schema publishing

## Environment Setup

Create a `.env` file in the root directory with your PostgreSQL connection string:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
# Optional. Defaults to "neon" for *.neon.tech hosts and "pg" otherwise.
# DATABASE_DRIVER=pg
```

Publish the database schema before starting the app:

```bash
npm run db:publish
```

To validate the publish script without changing the database:

```bash
npm run db:publish:dry
```

The schema is split into ordered SQL files under `server/database/sql`:

```text
server/database/sql/
├── 001_extensions.sql
├── functions/
│   └── 001_set_updated_at.sql
└── tables/
    ├── 001_users.sql
    ├── 002_sessions.sql
    ├── 003_categories.sql
    ├── 004_currencies.sql
    └── 005_transactions.sql
```

To build the app and publish SQL in one command:

```bash
npm run build:publish-sql
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

Run the built Node server directly:

```bash
npm run build
npm run start
```

## Deployment

### Cloudflare Pages

This project is configured for deployment to Cloudflare Pages:

```bash
# Build and deploy to Cloudflare Pages
npm run deploy
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
├── server/
│   ├── api/                   # Nuxt API routes
│   ├── database/              # PostgreSQL connection and schema
│   ├── repositories/          # SQL access layer
│   ├── services/              # Business logic
│   └── utils/                 # Auth and hashing helpers
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
